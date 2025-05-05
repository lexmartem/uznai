export interface CreateAnswerRequest {
  answerText: string;
  isCorrect: boolean;
  orderIndex: number;
  imageUrl?: string;
  codeSnippet?: string;
} 