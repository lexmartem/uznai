'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizSession } from '@/hooks/useQuizSession';
import { useQueryClient } from '@tanstack/react-query';
import { QuizOverview } from '@/components/quiz-taking/QuizOverview';
import { QuestionCard } from '@/components/quiz-taking/QuestionCard';
import { QuizProgress } from '@/components/quiz-taking/QuizProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { SubmitAnswerRequest } from '@/types/quiz-session';

interface QuizTakingPageProps {
    params: Promise<{ quizId: string }>;
}

export default function QuizTakingPage({ params }: QuizTakingPageProps) {
    const { quizId } = use(params);
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const queryClient = useQueryClient();

    const {
        quiz,
        session,
        questions,
        isLoadingQuiz,
        isLoadingSession,
        isLoadingQuestions,
        isSubmitting,
        initializeSession,
        submitAnswerMutation,
        completeSessionMutation,
        expireSessionMutation,
        activeSession,
        refetchUserSessions,
    } = useQuizSession(quizId);

    useEffect(() => {
        if (session?.startedAt) {
            const endTime = new Date(session.startedAt).getTime() + session.quiz.timeLimitMinutes * 60 * 1000;
            const updateTimer = () => {
                const now = new Date().getTime();
                const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
                setTimeRemaining(remaining);

                if (remaining === 0) {
                    expireSessionMutation.mutate(session.id);
                }
            };

            updateTimer();
            const timer = setInterval(updateTimer, 1000);
            return () => clearInterval(timer);
        }
    }, [session?.startedAt, session?.quiz.timeLimitMinutes, expireSessionMutation, session?.id]);

    useEffect(() => {
        if (!session || session.status !== 'IN_PROGRESS') return;
        const handleExit = () => {
            expireSessionMutation.mutate(session.id);
        };
        window.addEventListener('beforeunload', handleExit);
        return () => {
            window.removeEventListener('beforeunload', handleExit);
            handleExit(); // Also expire if component unmounts (e.g., route change)
        };
    }, [session, expireSessionMutation]);

    const handleStart = async () => {
        try {
            const newSession = await initializeSession();
            setHasStarted(true);
            setTimeRemaining(newSession.quiz.timeLimitMinutes * 60);
        } catch (error: any) {
            console.error('Quiz start error:', error);
            const errorMessage = error.response?.data?.message || error.message || '';
            if (errorMessage.includes('already have an active session')) {
                // Refetch user sessions and use the latest active session
                const { data: updatedSessions } = await refetchUserSessions();
                const foundSession = updatedSessions?.content.find(
                    (s) => s.quiz.id === quizId && s.status === 'IN_PROGRESS'
                );
                if (foundSession) {
                    setHasStarted(true);
                    setTimeRemaining(foundSession.quiz.timeLimitMinutes * 60);
                } else {
                    alert("Could not find your active session. Please refresh the page.");
                }
            } else {
                alert("An error occurred while starting the quiz. Please try again.");
            }
        }
    };

    const handleAnswer = async (answer: string[] | string) => {
        if (!session || !questions?.content[currentQuestionIndex]) return;

        const request: SubmitAnswerRequest = {
            sessionId: session.id,
            questionId: questions.content[currentQuestionIndex].id,
            ...(Array.isArray(answer) ? { selectedAnswerIds: answer } : {}),
            ...(typeof answer === 'string' ? { textAnswer: answer } : {})
        };

        await submitAnswerMutation.mutateAsync(request);

        if (currentQuestionIndex < questions.content.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            completeSessionMutation.mutate(session.id, {
                onSuccess: () => {
                    router.push(`/quizzes/${quizId}/results`);
                },
            });
        }
    };

    if (isLoadingQuiz || isLoadingSession || isLoadingQuestions) {
        return <div>Loading...</div>;
    }

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    if (!hasStarted) {
        return <QuizOverview quiz={quiz} onStart={handleStart} isLoading={isLoadingSession || isLoadingQuestions} />;
    }

    if (!session) {
        return <div>Session not found</div>;
    }

    if (!questions?.content[currentQuestionIndex]) {
        return <div>Loading questions...</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <QuizProgress
                session={session}
                currentQuestionIndex={currentQuestionIndex}
                timeRemaining={timeRemaining}
            />
            <QuestionCard
                question={questions.content[currentQuestionIndex]}
                onAnswer={handleAnswer}
                isSubmitting={isSubmitting}
            />
            {timeRemaining < 60 && (
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Less than a minute remaining! Please complete your answer.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
} 