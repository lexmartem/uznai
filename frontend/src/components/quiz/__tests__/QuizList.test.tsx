import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QuizList } from '../QuizList';
import { QuizSummary } from '@/types/quiz';

describe('QuizList', () => {
  const mockQuizzes: QuizSummary[] = [
    {
      id: '1',
      title: 'Test Quiz 1',
      description: 'Test Description 1',
      isPublic: true,
      questionCount: 0,
      collaboratorCount: 0,
      activeUsers: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Quiz 2',
      description: 'Test Description 2',
      isPublic: false,
      questionCount: 0,
      collaboratorCount: 0,
      activeUsers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    render(<QuizList quizzes={[]} isLoading={true} onDelete={mockOnDelete} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<QuizList quizzes={[]} isLoading={false} onDelete={mockOnDelete} />);
    expect(screen.getByText(/no quizzes/i)).toBeInTheDocument();
    expect(screen.getByText(/get started by creating a new quiz/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create quiz/i })).toBeInTheDocument();
  });

  it('renders quiz list correctly', () => {
    render(<QuizList quizzes={mockQuizzes} isLoading={false} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Quiz 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();

    expect(screen.getByText('Test Quiz 2')).toBeInTheDocument();
    expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('shows active user count', () => {
    render(<QuizList quizzes={mockQuizzes} isLoading={false} onDelete={mockOnDelete} />);

    expect(screen.getByText('1 active')).toBeInTheDocument();
    expect(screen.getByText('0 active')).toBeInTheDocument();
  });
}); 