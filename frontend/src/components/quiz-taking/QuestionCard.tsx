import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionType, type Question } from '@/types/quiz-session';

interface QuestionCardProps {
    question: Question;
    onAnswer: (answerIds: string[] | string) => void;
    isSubmitting: boolean;
}

export function QuestionCard({ question, onAnswer, isSubmitting }: QuestionCardProps) {
    const handleMultipleChoiceAnswer = (answerId: string) => {
        onAnswer([answerId]);
    };

    const handleTrueFalseAnswer = (answerId: string) => {
        onAnswer([answerId]);
    };

    const handleShortAnswer = (text: string) => {
        onAnswer(text);
    };

    const renderAnswers = () => {
        switch (question.type) {
            case QuestionType.MULTIPLE_CHOICE:
                return (
                    <RadioGroup
                        onValueChange={handleMultipleChoiceAnswer}
                        disabled={isSubmitting}
                        className="space-y-2"
                    >
                        {question.answers.map((answer) => (
                            <div key={answer.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={answer.id} id={answer.id} />
                                <Label htmlFor={answer.id}>{answer.text}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case QuestionType.TRUE_FALSE:
                return (
                    <RadioGroup
                        onValueChange={handleTrueFalseAnswer}
                        disabled={isSubmitting}
                        className="space-y-2"
                    >
                        {question.answers.map((answer) => (
                            <div key={answer.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={answer.id} id={answer.id} />
                                <Label htmlFor={answer.id}>{answer.text}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case QuestionType.SHORT_ANSWER:
                return (
                    <Textarea
                        placeholder="Type your answer here..."
                        onChange={(e) => handleShortAnswer(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl">
                    Question {question.orderIndex + 1}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg">{question.text}</p>
                {question.imageUrl && (
                    <img
                        src={question.imageUrl}
                        alt="Question illustration"
                        className="max-w-full h-auto rounded-lg"
                    />
                )}
                {question.codeSnippet && (
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{question.codeSnippet}</code>
                    </pre>
                )}
                <div className="mt-4">{renderAnswers()}</div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={() => onAnswer([])}
                    disabled={isSubmitting}
                    variant="outline"
                    className="w-full"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
            </CardFooter>
        </Card>
    );
} 