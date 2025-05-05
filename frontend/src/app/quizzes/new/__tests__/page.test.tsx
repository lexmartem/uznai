import { render, screen, fireEvent } from '@testing-library/react';
import NewQuizPage from '../page';
import { useQuizzes } from '@hooks/useQuizzes';
import { TestWrapper } from '@/test-utils/test-wrapper';

jest.mock('@hooks/useQuizzes');

describe('NewQuizPage', () => {
  beforeEach(() => {
    (useQuizzes as jest.Mock).mockReturnValue({
      createQuiz: jest.fn(),
      isCreating: false,
      error: null,
    });
  });

  it('renders page title and description', () => {
    render(<NewQuizPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Create New Quiz')).toBeInTheDocument();
    expect(screen.getByText('Create a new quiz by filling out the form below. You can add questions and answers after creating the quiz.')).toBeInTheDocument();
  });

  it('renders quiz form', () => {
    render(<NewQuizPage />, { wrapper: TestWrapper });

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Make this quiz public')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Quiz' })).toBeInTheDocument();
  });

  it('handles quiz creation', async () => {
    const mockCreateQuiz = jest.fn();
    (useQuizzes as jest.Mock).mockReturnValue({
      createQuiz: mockCreateQuiz,
      isCreating: false,
      error: null,
    });

    render(<NewQuizPage />, { wrapper: TestWrapper });

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Quiz' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test Description' },
    });
    fireEvent.click(screen.getByLabelText('Make this quiz public'));
    fireEvent.click(screen.getByRole('button', { name: 'Save Quiz' }));

    expect(mockCreateQuiz).toHaveBeenCalledWith(
      {
        title: 'Test Quiz',
        description: 'Test Description',
        isPublic: true,
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      })
    );
  });

  it('shows loading state', () => {
    (useQuizzes as jest.Mock).mockReturnValue({
      createQuiz: jest.fn(),
      isCreating: true,
      error: null,
    });

    render(<NewQuizPage />, { wrapper: TestWrapper });

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });

  it('shows error state', () => {
    (useQuizzes as jest.Mock).mockReturnValue({
      createQuiz: jest.fn(),
      isCreating: false,
      error: new Error('Failed to create quiz'),
    });

    render(<NewQuizPage />, { wrapper: TestWrapper });

    expect(screen.getByText('Failed to create quiz')).toBeInTheDocument();
  });
}); 