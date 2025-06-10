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
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Created by {quiz.creator.username}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{quiz.questionCount} questions</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated time: {quiz.estimatedTimeMinutes} minutes</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={onStart}
                    disabled={isLoading}
                    className="w-full"
                    size="lg"
                >
                    {isLoading ? 'Starting Quiz...' : 'Start Quiz'}
                </Button>
            </CardFooter>
        </Card>
    );
} 