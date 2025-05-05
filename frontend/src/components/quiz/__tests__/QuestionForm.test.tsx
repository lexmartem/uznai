import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuestionForm } from '../QuestionForm';
import { CreateQuestionRequest } from '@/types/question';

describe('QuestionForm', () => {
  const mockOnSubmit = jest.fn();
  const mockInitialData: CreateQuestionRequest = {
    questionText: 'Test Question',
    questionType: 'MULTIPLE_CHOICE_SINGLE',
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
        value: mockInitialData[name as keyof CreateQuestionRequest]
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
    render(<QuestionForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/question text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/question type/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save question/i })).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} initialData={mockInitialData} />);

    const questionTextInput = screen.getByLabelText(/question text/i) as HTMLTextAreaElement;
    const questionTypeSelect = screen.getByLabelText(/question type/i) as HTMLSelectElement;

    expect(questionTextInput.value).toBe('Test Question');
    expect(questionTypeSelect.value).toBe('MULTIPLE_CHOICE_SINGLE');
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
          questionText: { message: 'Question text is required' }
        }
      },
      setValue: jest.fn(),
      getValues: jest.fn(),
      trigger: jest.fn(),
    }));

    render(<QuestionForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: /save question/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/question text is required/i)).toBeInTheDocument();
    });
  });

  it('shows image URL field when question type is IMAGE', async () => {
    // Mock the form state to show imageUrl field
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: (name: string) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name
      }),
      handleSubmit: jest.fn(),
      watch: jest.fn().mockImplementation((field) => {
        if (field === 'questionType') return 'IMAGE';
        if (field === 'imageUrl') return '';
        return undefined;
      }),
      formState: { errors: {} }
    }));

    render(<QuestionForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    });
  });

  it('shows code snippet field when question type is CODE', async () => {
    // Mock the form state to show codeSnippet field
    jest.spyOn(require('react-hook-form'), 'useForm').mockImplementation(() => ({
      register: (name: string) => ({
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name
      }),
      handleSubmit: jest.fn(),
      watch: jest.fn().mockImplementation((field) => {
        if (field === 'questionType') return 'CODE';
        if (field === 'codeSnippet') return '';
        return undefined;
      }),
      formState: { errors: {} }
    }));

    render(<QuestionForm onSubmit={mockOnSubmit} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/code snippet/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<QuestionForm onSubmit={mockOnSubmit} />);

    const questionTextInput = screen.getByLabelText(/question text/i);
    const questionTypeSelect = screen.getByLabelText(/question type/i);
    const submitButton = screen.getByRole('button', { name: /save question/i });

    fireEvent.change(questionTextInput, { target: { value: 'Test Question' } });
    fireEvent.change(questionTypeSelect, { target: { value: 'MULTIPLE_CHOICE_SINGLE' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        questionText: 'Test Question',
        questionType: 'MULTIPLE_CHOICE_SINGLE',
        orderIndex: 0
      });
    });
  });

  it('shows loading state', () => {
    render(<QuestionForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', { name: /saving/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Saving...');
  });
}); 