export const useQuizzes = jest.fn().mockReturnValue({
  quizzes: [],
  isLoading: false,
  error: null,
  createQuiz: jest.fn(),
  updateQuiz: jest.fn(),
  deleteQuiz: jest.fn(),
}); 