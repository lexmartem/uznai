'use client';

import { useRouter } from 'next/navigation';
import { useQuizResults } from '@/hooks/useQuizResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizResultPageProps {
    params: {
        quizId: string;
    };
}

export default function QuizResultPage({ params }: QuizResultPageProps) {
    const router = useRouter();
    const { result, isLoading } = useQuizResults(params.quizId);

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
        <div className="container mx-auto py-8">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Quiz Results</CardTitle>
                    <CardDescription>
                        {result.quiz.title}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                            Score: {percent}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Completed on {new Date(result.completedAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {questionResults.map((questionResult) => (
                            <Card key={questionResult.questionId} className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        {questionResult.isCorrect ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">{questionResult.questionText}</p>
                                        <div className="mt-2 space-y-1">
                                            {/* Defensive: answerResults may be undefined/null */}
                                            {(questionResult.answerResults ?? []).map((answerResult: any) => (
                                                <div
                                                    key={answerResult.id}
                                                    className={`flex items-center gap-2 text-sm ${
                                                        answerResult.isCorrect
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    }`}
                                                >
                                                    {answerResult.isCorrect ? (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4" />
                                                    )}
                                                    <span>{answerResult.answerText}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push(`/quizzes/${params.quizId}`)}
                        >
                            Back to Quiz
                        </Button>
                        <Button
                            onClick={() => router.push(`/quizzes/${params.quizId}/take`)}
                        >
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 