import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { quizSessionService } from '@/services/quiz-session-service';
import quizService from '@/services/quiz-service';
import type { QuizSession, Question, SubmitAnswerRequest, Quiz as QuizSessionQuiz } from '@/types/quiz-session';
import type { Quiz as ApiQuiz } from '@/types/quiz';
import React from 'react';
import { QuestionType } from '@/types/quiz-session';

export function useQuizSession(quizId: string) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: apiQuiz, isLoading: isLoadingQuiz } = useQuery<ApiQuiz>({
        queryKey: ['quiz', quizId],
        queryFn: () => quizService.getQuizById(quizId),
    });

    // Transform the API quiz into the format expected by the quiz session
    const quiz: QuizSessionQuiz | undefined = apiQuiz ? {
        id: apiQuiz.id,
        title: apiQuiz.title,
        description: apiQuiz.description,
        creator: {
            id: apiQuiz.createdBy,
            username: 'User', // TODO: Get actual username
        },
        questionCount: apiQuiz.questions.length,
        estimatedTimeMinutes: 10, // TODO: Calculate based on question count
        timeLimitMinutes: 30, // TODO: Get from API
    } : undefined;

    // Fetch all user sessions and find an active one for this quiz
    const { data: userSessions, isLoading: isLoadingUserSessions, refetch: refetchUserSessions } = useQuery<{ content: QuizSession[] }>({
        queryKey: ['user-sessions'],
        queryFn: () => quizSessionService.getUserSessions(0, 50),
    });

    const activeSession = userSessions?.content.find(
        (session) => session.quiz.id === quizId && session.status === 'IN_PROGRESS'
    );

    const startSessionMutation = useMutation({
        mutationFn: () => quizSessionService.startSession(quizId),
        onSuccess: (newSession) => {
            queryClient.setQueryData(['quiz-session', quizId], newSession);
            queryClient.invalidateQueries({ queryKey: ['quiz-questions', newSession.id] });
        },
    });

    // Initialize session - either use existing active session or start new one
    const initializeSession = async () => {
        if (activeSession) {
            queryClient.setQueryData(['quiz-session', quizId], activeSession);
            queryClient.invalidateQueries({ queryKey: ['quiz-questions', activeSession.id] });
            return activeSession;
        }
        return startSessionMutation.mutateAsync();
    };

    // Use the active session if it exists, otherwise use the session from mutation
    const sessionId = activeSession?.id || startSessionMutation.data?.id || '';

    const { data: session, isLoading: isLoadingSession } = useQuery<QuizSession>({
        queryKey: ['quiz-session', quizId],
        queryFn: () => quizSessionService.getSession(sessionId),
        enabled: !!sessionId,
    });

    const mapQuestionType = (qt: string) => {
        switch (qt) {
            case 'MULTIPLE_CHOICE_SINGLE':
            case 'MULTIPLE_CHOICE_MULTIPLE':
                return QuestionType.MULTIPLE_CHOICE;
            case 'TRUE_FALSE':
                return QuestionType.TRUE_FALSE;
            case 'SHORT_ANSWER':
                return QuestionType.SHORT_ANSWER;
            case 'IMAGE':
                return QuestionType.IMAGE;
            case 'CODE':
                return QuestionType.CODE;
            default:
                return QuestionType.MULTIPLE_CHOICE;
        }
    };

    const { data: questions, isLoading: isLoadingQuestions } = useQuery<{
        content: Question[];
        totalPages: number;
        totalElements: number;
    }>({
        queryKey: ['quiz-questions', session?.id],
        queryFn: () => quizSessionService.getSessionQuestions(session?.id || '', 0, 10),
        enabled: !!session?.id,
        select: (data) => ({
            ...data,
            content: data.content.map((q: any) => ({
                ...q,
                text: q.questionText,
                type: mapQuestionType(q.questionType),
                originalQuestionType: q.questionType,
                answers: q.answers.map((a: any) => ({
                    ...a,
                    text: a.answerText,
                })),
            })),
        }),
    });

    const submitAnswerMutation = useMutation({
        mutationFn: (request: SubmitAnswerRequest) => {
            // Map 'answer' to 'selectedAnswerIds' if present for backward compatibility
            const mappedRequest: SubmitAnswerRequest = {
                sessionId: request.sessionId,
                questionId: request.questionId,
                selectedAnswerIds: Array.isArray((request as any).answer) ? (request as any).answer : request.selectedAnswerIds,
                textAnswer: request.textAnswer ?? '',
            };
            return quizSessionService.submitAnswer(request.sessionId, request.questionId, mappedRequest);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quiz-questions', session?.id] });
        },
    });

    const completeSessionMutation = useMutation({
        mutationFn: (sessionId: string) => quizSessionService.completeSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quiz-session', quizId] });
        },
    });

    const expireSessionMutation = useMutation({
        mutationFn: (sessionId: string) => quizSessionService.expireSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quiz-session', quizId] });
        },
    });

    return {
        quiz,
        session,
        questions,
        isLoadingQuiz,
        isLoadingSession: isLoadingSession || isLoadingUserSessions,
        isLoadingQuestions,
        isSubmitting: submitAnswerMutation.isPending,
        initializeSession,
        submitAnswerMutation,
        completeSessionMutation,
        expireSessionMutation,
        activeSession,
        refetchUserSessions,
    };
} 