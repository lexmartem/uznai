import { render, screen, fireEvent } from '@testing-library/react';
import QuizPage from '../../[quizId]/page';
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

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));
jest.mock('zod', () => ({
  z: {
    object: () => ({
      parse: jest.fn(),
      safeParse: jest.fn(),
    }),
    string: () => ({
      min: jest.fn().mockReturnThis(),
      max: jest.fn().mockReturnThis(),
      optional: jest.fn().mockReturnThis(),
      url: jest.fn().mockReturnThis(),
    }),
    boolean: () => ({
      default: jest.fn().mockReturnThis(),
    }),
    array: () => ({
      default: jest.fn().mockReturnThis(),
    }),
    number: () => ({
      min: jest.fn().mockReturnThis(),
    }),
    enum: () => jest.fn().mockReturnThis(),
  },
}));
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: () => jest.fn(),
}));
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: () => ({
    register: (name: string) => ({
      onChange: jest.fn(),
      onBlur: jest.fn(),
      ref: jest.fn(),
      name
    }),
    handleSubmit: (fn: any) => (e: any) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data: Record<string, any> = Object.fromEntries(formData.entries());
      // Convert checkbox values to boolean
      Object.keys(data).forEach(key => {
        if (data[key] === 'on') {
          data[key] = true;
        }
      });
      fn(data);
    },
    watch: jest.fn().mockReturnValue(undefined),
    formState: { errors: {} },
    setValue: jest.fn(),
    getValues: jest.fn(),
    trigger: jest.fn(),
  })
}));
jest.mock('@/services/websocket-service', () => ({
  websocketService: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribeToQuiz: jest.fn().mockReturnValue(() => {}),
    sendQuizChange: jest.fn(),
  },
}));

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
    render(<QuizPage params={{ quizId: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByText('Test Quiz')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders questions and answers', () => {
    render(<QuizPage params={{ quizId: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByText('Test Question 1')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useQuiz as jest.Mock).mockReturnValue({
      quiz: null,
      isLoading: true,
      error: null,
    });

    render(<QuizPage params={{ quizId: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('shows error state', () => {
    (useQuiz as jest.Mock).mockReturnValue({
      quiz: null,
      isLoading: false,
      error: new Error('Failed to load quiz'),
    });

    render(<QuizPage params={{ quizId: '1' }} />, { wrapper: TestWrapper });

    expect(screen.getByText('Failed to load quiz')).toBeInTheDocument();
  });
}); 