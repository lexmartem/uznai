export type QuestionType = 
  | 'MULTIPLE_CHOICE_SINGLE'
  | 'MULTIPLE_CHOICE_MULTIPLE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'IMAGE'
  | 'CODE';

export interface Answer {
  id: string;
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
  imageUrl?: string;
  codeSnippet?: string;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  orderIndex: number;
  imageUrl?: string;
  codeSnippet?: string;
  explanation?: string;
  answers: Answer[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface QuizCollaborator {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  collaborators: QuizCollaborator[];
  questions: Question[];
  version: number;
}

export interface QuizSummary {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  collaboratorCount: number;
  activeUsers: number;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  isPublic: boolean;
  collaborators: string[];
}

export interface UpdateQuizRequest extends CreateQuizRequest {
  version: number;
}

export interface CreateQuestionRequest {
  questionText: string;
  questionType: QuestionType;
  orderIndex: number;
  imageUrl?: string;
  codeSnippet?: string;
}

export interface UpdateQuestionRequest extends CreateQuestionRequest {
  version: number;
}

export interface CreateAnswerRequest {
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
  imageUrl?: string;
  codeSnippet?: string;
}

export interface UpdateAnswerRequest extends CreateAnswerRequest {
  version: number;
} 