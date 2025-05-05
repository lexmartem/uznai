export const useAnswers = jest.fn().mockReturnValue({
  answers: [],
  isLoading: false,
  error: null,
  createAnswer: jest.fn(),
  updateAnswer: jest.fn(),
  deleteAnswer: jest.fn(),
}); 