import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { QuestionType, type Question } from '@/types/quiz-session';
import { useState } from 'react';

interface QuestionCardProps {
    question: Question;
    onAnswer: (answerIds: string[] | string) => void;
    isSubmitting: boolean;
}

export function QuestionCard({ question, onAnswer, isSubmitting }: QuestionCardProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string[] | string>('');
    const [shortAnswerText, setShortAnswerText] = useState('');

    const isMultipleChoiceMultiple = question.originalQuestionType === 'MULTIPLE_CHOICE_MULTIPLE';

    const handleMultipleChoiceAnswer = (answerId: string) => {
        if (isMultipleChoiceMultiple) {
            // For multiple choice questions, toggle the selected answer
            setSelectedAnswer((prev) => {
                const currentAnswers = Array.isArray(prev) ? prev : [];
                if (currentAnswers.includes(answerId)) {
                    return currentAnswers.filter(id => id !== answerId);
                } else {
                    return [...currentAnswers, answerId];
                }
            });
        } else {
            // For single choice questions, replace the selected answer
            setSelectedAnswer([answerId]);
        }
    };

    const handleTrueFalseAnswer = (answerId: string) => {
        setSelectedAnswer([answerId]);
    };

    const handleShortAnswerChange = (text: string) => {
        setShortAnswerText(text);
        setSelectedAnswer(text);
    };

    const handleSubmit = () => {
        if (question.type === QuestionType.SHORT_ANSWER) {
            onAnswer(shortAnswerText);
        } else {
            onAnswer(selectedAnswer);
        }
    };

    const isAnswerSelected = () => {
        if (question.type === QuestionType.SHORT_ANSWER) {
            return shortAnswerText.trim().length > 0;
        } else {
            return Array.isArray(selectedAnswer) && selectedAnswer.length > 0;
        }
    };

    const renderAnswers = () => {
        switch (question.type) {
            case QuestionType.MULTIPLE_CHOICE:
                if (isMultipleChoiceMultiple) {
                    // Use checkboxes for multiple choice questions
                    return (
                        <div className="space-y-2">
                            {question.answers.map((answer) => (
                                <div key={answer.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={answer.id}
                                        checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(answer.id)}
                                        onCheckedChange={() => handleMultipleChoiceAnswer(answer.id)}
                                        disabled={isSubmitting}
                                    />
                                    <Label htmlFor={answer.id}>{answer.text}</Label>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    // Use radio buttons for single choice questions
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
                }
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
                        value={shortAnswerText}
                        onChange={(e) => handleShortAnswerChange(e.target.value)}
                        disabled={isSubmitting}
                        className="min-h-[100px]"
                    />
                );
            case QuestionType.IMAGE:
            case QuestionType.CODE:
                // IMAGE and CODE questions can have multiple choice answers
                // Check if it's multiple choice based on originalQuestionType
                if (question.originalQuestionType === 'MULTIPLE_CHOICE_MULTIPLE') {
                    return (
                        <div className="space-y-2">
                            {question.answers.map((answer) => (
                                <div key={answer.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={answer.id}
                                        checked={Array.isArray(selectedAnswer) && selectedAnswer.includes(answer.id)}
                                        onCheckedChange={() => handleMultipleChoiceAnswer(answer.id)}
                                        disabled={isSubmitting}
                                    />
                                    <Label htmlFor={answer.id}>{answer.text}</Label>
                                </div>
                            ))}
                        </div>
                    );
                } else {
                    // Default to single choice for IMAGE and CODE questions
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
                }
            default:
                return null;
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-700 mb-2">
                    Question {question.orderIndex + 1}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-lg font-semibold text-gray-900">{question.text}</p>
                {question.imageUrl && (
                    <img
                        src={question.imageUrl}
                        alt="Question illustration"
                        className="max-w-full h-auto rounded-lg"
                    />
                )}
                {question.codeSnippet && (
                    <pre className="bg-blue-100 p-4 rounded-lg overflow-x-auto">
                        <code>{question.codeSnippet}</code>
                    </pre>
                )}
                <div className="mt-4">
                    {renderAnswers()}
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isAnswerSelected()}
                    className="w-full bg-purple-600 text-white rounded-full px-6 py-3 font-bold hover:bg-purple-700 shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
            </CardFooter>
        </Card>
    );
} 