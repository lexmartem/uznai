import { render, screen, fireEvent } from '@testing-library/react';
import { QuizForm } from '../QuizForm';
import { CreateQuizRequest } from '@/types/quiz';

describe('QuizForm', () => {
  const mockOnSave = jest.fn();
  const mockInitialData: CreateQuizRequest = {
    title: 'Test Quiz',
    description: 'Test Description',
    isPublic: true,
    collaborators: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<QuizForm quizId="test-quiz" onSave={mockOnSave} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/make this quiz public/i)).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    render(<QuizForm quizId="test-quiz" onSave={mockOnSave} initialData={mockInitialData} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const isPublicCheckbox = screen.getByLabelText(/make this quiz public/i) as HTMLInputElement;

    expect(titleInput.value).toBe('Test Quiz');
    expect(descriptionInput.value).toBe('Test Description');
    expect(isPublicCheckbox.checked).toBe(true);
  });

  it('handles input changes', () => {
    render(<QuizForm quizId="test-quiz" onSave={mockOnSave} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const isPublicCheckbox = screen.getByLabelText(/make this quiz public/i);

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
    fireEvent.click(isPublicCheckbox);

    expect(titleInput).toHaveValue('New Title');
    expect(descriptionInput).toHaveValue('New Description');
    expect(isPublicCheckbox).toBeChecked();
  });
}); 