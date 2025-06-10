import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import type { QuizSession } from '@/types/quiz-session';

interface QuizProgressProps {
    session: QuizSession;
    currentQuestionIndex: number;
    timeRemaining: number;
}

export function QuizProgress({ session, currentQuestionIndex, timeRemaining }: QuizProgressProps) {
    const progress = (currentQuestionIndex / session.questionCount) * 100;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    return (
        <Card className="w-full max-w-2xl mx-auto mb-4 shadow-lg rounded-xl bg-yellow-100">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-purple-700 font-bold">
                        Question {currentQuestionIndex + 1} of {session.questionCount}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-700 font-bold">
                        <Clock className="h-4 w-4" />
                        <span>
                            {minutes.toString().padStart(2, '0')}:
                            {seconds.toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>
                <Progress value={progress} className="h-2 bg-green-300" />
            </CardContent>
        </Card>
    );
} 