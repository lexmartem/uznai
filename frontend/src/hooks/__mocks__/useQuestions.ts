export const useQuestions = jest.fn().mockReturnValue({
  questions: [],
  isLoading: false,
  error: null,
  createQuestion: jest.fn(),
  updateQuestion: jest.fn(),
  deleteQuestion: jest.fn(),
  getQuestion: jest.fn(),
}); 