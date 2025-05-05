import { render, screen } from '@testing-library/react';
import QuizListPage from '../page';
import { useQuizzes } from '@hooks/useQuizzes';
import { TestWrapper } from '@/test-utils/test-wrapper';

jest.mock('@hooks/useQuizzes');

describe('QuizListPage', () => {
  const mockQuizzes = [
    {
      id: '1',
      title: 'Test Quiz 1',
      description: 'Test Description 1',
      isPublic: true,
      questionCount: 5,
      collaboratorCount: 2,
      activeUsers: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Quiz 2',
      description: 'Test Description 2',
      isPublic: false,
      questionCount: 3,
      collaboratorCount: 1,
      activeUsers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    (useQuizzes as jest.Mock).mockReturnValue({
      quizzes: [],
      isLoading: false,
      error: null,
      totalPages: 1,
      deleteQuiz: jest.fn(),
    });
  });

  it('renders page title and description', () => {
    render(<QuizListPage />, { wrapper: TestWrapper });

    expect(screen.getByText('My Quizzes')).toBeInTheDocument();
    expect(screen.getByText('A list of all your quizzes, including public and private ones.')).toBeInTheDocument();
  });

  it('renders quiz list', () => {
    (useQuizzes as jest.Mock).mockReturnValue({
      quizzes: mockQuizzes,
      isLoading: false,
      error: null,
      totalPages: 1,
      deleteQuiz: jest.fn(),
    });

    render(<QuizListPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Test Quiz 1')).toBeInTheDocument();
    expect(screen.getByText('Test Quiz 2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useQuizzes as jest.Mock).mockReturnValue({
      quizzes: [],
      isLoading: true,
      error: null,
      totalPages: 1,
      deleteQuiz: jest.fn(),
    });

    render(<QuizListPage />, { wrapper: TestWrapper });

    const loadingSkeletons = screen.getAllByRole('presentation');
    expect(loadingSkeletons).toHaveLength(3);
  });

  it('shows empty state', () => {
    (useQuizzes as jest.Mock).mockReturnValue({
      quizzes: [],
      isLoading: false,
      error: null,
      totalPages: 1,
      deleteQuiz: jest.fn(),
    });

    render(<QuizListPage />, { wrapper: TestWrapper });

    expect(screen.getByText('No quizzes')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating a new quiz.')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useQuizzes as jest.Mock).mockReturnValue({
      quizzes: [],
      isLoading: false,
      error: new Error('Failed to load quizzes'),
      totalPages: 1,
      deleteQuiz: jest.fn(),
    });

    render(<QuizListPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Failed to load quizzes')).toBeInTheDocument();
  });
}); 