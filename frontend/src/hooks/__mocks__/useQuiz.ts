export const useQuiz = jest.fn().mockReturnValue({
  quiz: null,
  isLoading: false,
  error: null,
  updateQuiz: jest.fn(),
  isUpdating: false,
}); 