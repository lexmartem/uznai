'use client';

import { useRouter } from 'next/navigation';
import { useQuizResults } from '@/hooks/useQuizResults';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { use } from "react";

interface QuizResultPageProps {
    params: Promise<{ quizId: string }>;
}

export default function QuizResultPage({ params }: QuizResultPageProps) {
    const { quizId } = use(params);
    const router = useRouter();
    const { result, isLoading } = useQuizResults(quizId);

    if (isLoading) {
        return <div>Loading results...</div>;
    }

    if (!result) {
        return <div>Results not found</div>;
    }

    // Defensive: ensure questionResults is always an array
    const questionResults = result.questionResults ?? [];
    const totalQuestions = questionResults.length;
    const percent = totalQuestions > 0 ? Math.round((result.score / totalQuestions) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-blue-100 to-yellow-100 flex flex-col items-center py-12">
            <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-purple-700 mb-2">Quiz Results</h1>
                    <div className="text-lg text-purple-500 font-semibold">{result.quiz.title}</div>
                </div>
                <div className="flex items-center justify-between mb-8">
                    <div className="text-4xl font-extrabold text-green-600 flex items-center gap-2">
                        🎉 Score: {percent}%
                    </div>
                    <div className="text-sm text-gray-500">
                        Completed on {new Date(result.completedAt).toLocaleDateString()}
                    </div>
                </div>
                <div className="space-y-8">
                    {questionResults.map((questionResult, idx) => {
                        // Assign a color from Kahoot palette for each question
                        const kahootColors = [
                            'bg-purple-500',
                            'bg-blue-500',
                            'bg-green-500',
                            'bg-red-500',
                            'bg-yellow-400',
                        ];
                        const colorClass = kahootColors[idx % kahootColors.length];
                        return (
                            <div key={questionResult.questionId} className={`rounded-xl shadow-lg p-6 text-white ${colorClass}`}> 
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {questionResult.isCorrect ? (
                                            <CheckCircle2 className="h-6 w-6 text-green-200" />
                                        ) : (
                                            <XCircle className="h-6 w-6 text-red-200" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-xl mb-3">{questionResult.questionText}</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {(questionResult.answerResults ?? []).map((answerResult, aidx) => {
                                                // Colorful answer blocks
                                                const answerColors = [
                                                    'bg-purple-300',
                                                    'bg-blue-300',
                                                    'bg-green-300',
                                                    'bg-red-300',
                                                    'bg-yellow-200',
                                                ];
                                                const answerColor = answerColors[aidx % answerColors.length];
                                                return (
                                                    <div
                                                        key={answerResult.id}
                                                        className={`flex items-center gap-2 rounded-lg px-4 py-3 font-semibold text-base shadow-md ${answerColor} ${answerResult.isCorrect ? 'ring-4 ring-green-300' : ''}`}
                                                    >
                                                        {answerResult.isCorrect ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-700" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-700" />
                                                        )}
                                                        <span className="text-gray-900">{answerResult.answerText}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-10">
                    <Button
                        variant="outline"
                        className="bg-gray-100 text-gray-700 rounded-full px-6 py-3 font-bold hover:bg-gray-200 shadow"
                        onClick={() => router.push(`/quizzes/${quizId}`)}
                    >
                        Back to Quiz
                    </Button>
                    <Button
                        className="bg-purple-600 text-white rounded-full px-6 py-3 font-bold hover:bg-purple-700 shadow"
                        onClick={() => router.push(`/quizzes/${quizId}/take`)}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        </div>
    );
} 