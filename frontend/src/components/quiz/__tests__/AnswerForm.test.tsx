import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AnswerForm } from '../AnswerForm';
import { CreateAnswerRequest } from '@/types/answer';

describe('AnswerForm', () => {
  const mockOnSubmit = jest.fn();
  const mockInitialData: CreateAnswerRequest = {
    answerText: 'Test Answer',
    isCorrect: true,
    orderIndex: 0,
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
        value: mockInitialData[name as keyof CreateAnswerRequest],
        checked: name === 'isCorrect' ? mockInitialData.isCorrect : undefined
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
    render(<AnswerForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/answer text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/this is the correct answer/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save answer/i })).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    render(<AnswerForm onSubmit={mockOnSubmit} initialData={mockInitialData} />);

    const answerTextInput = screen.getByLabelText(/answer text/i) as HTMLTextAreaElement;
    const isCorrectCheckbox = screen.getByLabelText(/this is the correct answer/i) as HTMLInputElement;

    expect(answerTextInput.value).toBe('Test Answer');
    expect(isCorrectCheckbox.checked).toBe(true);
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
          answerText: { message: 'Answer text is required' }
        }
      },
      setValue: jest.fn(),
      getValues: jest.fn(),
      trigger: jest.fn(),
    }));

    render(<AnswerForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save answer/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/answer text is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<AnswerForm onSubmit={mockOnSubmit} />);

    const answerTextInput = screen.getByLabelText(/answer text/i);
    const isCorrectCheckbox = screen.getByLabelText(/this is the correct answer/i);
    const submitButton = screen.getByRole('button', { name: /save answer/i });

    fireEvent.change(answerTextInput, { target: { value: 'Test Answer' } });
    fireEvent.click(isCorrectCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        answerText: 'Test Answer',
        isCorrect: true,
        orderIndex: 0
      });
    });
  });
}); 