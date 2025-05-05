export type QuestionType =
  | 'MULTIPLE_CHOICE_SINGLE'
  | 'MULTIPLE_CHOICE_MULTIPLE'
  | 'TRUE_FALSE'
  | 'SHORT_ANSWER'
  | 'IMAGE'
  | 'CODE';

export interface CreateQuestionRequest {
  questionText: string;
  questionType: QuestionType;
  orderIndex: number;
  imageUrl?: string;
  codeSnippet?: string;
} 