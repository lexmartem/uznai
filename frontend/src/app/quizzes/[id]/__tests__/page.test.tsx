import { render, screen, fireEvent } from '@testing-library/react';
import QuizPage from '../page';
import { useQuizzes, useQuiz } from '@hooks/useQuizzes';
import { useQuestions } from '@hooks/useQuestions';
import { useAnswers } from '@hooks/useAnswers';
import { TestWrapper } from '@/test-utils/test-wrapper';

jest.mock('@hooks/useQuizzes', () => ({
  useQuiz: jest.fn(),
  useQuizzes: jest.fn(),
}));
jest.mock('@hooks/useQuestions');
jest.mock('@hooks/useAnswers');

describe('QuizPage', () => {
  const mockQuiz = {
    id: '1',
    title: 'Test Quiz',
    description: 'Test Description',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockQuestions = [
    {
      id: '1',
      quizId: '1',
      questionText: 'Test Question 1',
      orderIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      answers: [],
    },
  ];

  const mockAnswers = [
    {
      id: '1',
      questionId: '1',
      answerText: 'Test Answer 1',
      isCorrect: true,
      orderIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (useQuiz as jest.Mock).mockReturnValue({
      quiz: mockQuiz,
      isLoading: false,
      error: null,
    });

    (useQuestions as jest.Mock).mockReturnValue({
      questions: mockQuestions,
      createQuestion: jest.fn(),
      isLoading: false,
      error: null,
    });

    (useAnswers as jest.Mock).mockReturnValue({
      createAnswer: jest.fn(),
      isCreating: false,
      error: null,
    });
  });

  it('renders quiz details', () => {
    render(<QuizPage params={{ id: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders questions and answers', () => {
    render(<QuizPage params={{ id: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByText('Test Question 1')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useQuiz as jest.Mock).mockReturnValue({
      quiz: null,
      isLoading: true,
      error: null,
    });

    render(<QuizPage params={{ id: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useQuiz as jest.Mock).mockReturnValue({
      quiz: null,
      isLoading: false,
      error: new Error('Failed to load quiz'),
    });

    render(<QuizPage params={{ id: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByText('Failed to load quiz')).toBeInTheDocument();
  });
}); 