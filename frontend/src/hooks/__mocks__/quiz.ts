export const useQuiz = jest.fn().mockReturnValue({
  quiz: null,
  isLoading: false,
  error: null,
  createQuiz: jest.fn(),
  updateQuiz: jest.fn(),
  deleteQuiz: jest.fn(),
}); 