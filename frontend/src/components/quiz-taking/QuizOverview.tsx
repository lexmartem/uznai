import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, FileText, User } from 'lucide-react';
import type { QuizSession } from '@/types/quiz-session';

interface QuizOverviewProps {
    quiz: QuizSession['quiz'];
    onStart: () => void;
    isLoading: boolean;
}

export function QuizOverview({ quiz, onStart, isLoading }: QuizOverviewProps) {
    return (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white p-8">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-purple-700 mb-2">{quiz.title}</CardTitle>
                <CardDescription className="text-lg text-purple-500 font-semibold">{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <User className="h-4 w-4" />
                    <span>Created by {quiz.creator.username}</span>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>{quiz.questionCount} questions</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-600">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: {quiz.estimatedTimeMinutes} minutes</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={onStart}
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white rounded-full px-6 py-3 font-bold hover:bg-purple-700 shadow"
                    size="lg"
                >
                    {isLoading ? 'Starting Quiz...' : 'Start Quiz'}
                </Button>
            </CardFooter>
        </Card>
    );
} 