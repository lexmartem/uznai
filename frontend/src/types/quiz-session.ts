export enum QuestionType {
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
    TRUE_FALSE = 'TRUE_FALSE',
    SHORT_ANSWER = 'SHORT_ANSWER',
}

export interface Answer {
    id: string;
    text: string;
    orderIndex: number;
}

export interface Question {
    id: string;
    text: string;
    type: QuestionType;
    originalQuestionType?: string;
    orderIndex: number;
    imageUrl?: string;
    codeSnippet?: string;
    answers: Answer[];
    userAnswers?: string[];
}

export interface QuizCreator {
    id: string;
    username: string;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    creator: QuizCreator;
    questionCount: number;
    estimatedTimeMinutes: number;
    timeLimitMinutes: number;
}

export interface QuizSession {
    id: string;
    quiz: Quiz;
    startedAt: string;
    completedAt?: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
    questionCount: number;
    answeredCount: number;
}

export interface QuizResult {
    id: string;
    quiz: Quiz;
    user: QuizCreator;
    score: number;
    completedAt: string;
    questionResults: QuestionResult[];
}

export interface QuestionResult {
    questionId: string;
    questionText: string;
    isCorrect: boolean;
    answerResults: AnswerResult[];
}

export interface AnswerResult {
    id: string;
    answerText: string;
    isCorrect: boolean;
}

export interface StartQuizSessionRequest {
    quizId: string;
}

export interface SubmitAnswerRequest {
    sessionId: string;
    questionId: string;
    selectedAnswerIds?: string[];
    textAnswer?: string;
} 