import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuizForm } from '../QuizForm';
import { CreateQuizRequest } from '@/types/quiz';

describe('QuizForm', () => {
  const mockOnSubmit = jest.fn();
  const mockInitialData: CreateQuizRequest = {
    title: 'Test Quiz',
    description: 'Test Description',
    isPublic: true,
    collaborators: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useForm to return initial values
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: (name: string) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name,
        value: mockInitialData[name as keyof CreateQuizRequest],
        checked: name === 'isPublic' ? mockInitialData.isPublic : undefined
      }),
      handleSubmit: (fn: (data: any) => void) => (e: React.FormEvent) => {
        e.preventDefault();
        fn(mockInitialData);
      },
      watch: jest.fn().mockReturnValue(undefined),
      formState: { errors: {} },
      setValue: jest.fn(),
      getValues: jest.fn(),
      trigger: jest.fn(),
    }));
  });

  it('renders form fields correctly', () => {
    render(<QuizForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/make this quiz public/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save quiz/i })).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    render(<QuizForm onSubmit={mockOnSubmit} initialData={mockInitialData} />);

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
    const descriptionInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    const isPublicCheckbox = screen.getByLabelText(/make this quiz public/i) as HTMLInputElement;

    expect(titleInput.value).toBe('Test Quiz');
    expect(descriptionInput.value).toBe('Test Description');
    expect(isPublicCheckbox.checked).toBe(true);
  });

  it('validates required fields', async () => {
    // Mock form validation to show errors
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: (name: string) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name
      }),
      handleSubmit: (fn: (data: any) => void) => (e: React.FormEvent) => {
        e.preventDefault();
        fn({});
      },
      watch: jest.fn().mockReturnValue(undefined),
      formState: {
        errors: {
          title: { message: 'Title is required' }
        }
      },
      setValue: jest.fn(),
      getValues: jest.fn(),
      trigger: jest.fn(),
    }));

    render(<QuizForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save quiz/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<QuizForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const isPublicCheckbox = screen.getByLabelText(/make this quiz public/i);
    const submitButton = screen.getByRole('button', { name: /save quiz/i });

    fireEvent.change(titleInput, { target: { value: 'Test Quiz' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(isPublicCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Test Quiz',
        description: 'Test Description',
        isPublic: true,
        collaborators: []
      });
    });
  });

  it('shows loading state', () => {
    render(<QuizForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });
}); 