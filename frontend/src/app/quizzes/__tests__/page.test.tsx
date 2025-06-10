import { render, screen } from '@testing-library/react';
import QuizListPage from '../page';
import { useQuizzes } from '@hooks/useQuizzes';
import { TestWrapper } from '@/test-utils/test-wrapper';

jest.mock('@hooks/useQuizzes');
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
      quizzes: undefined,
      isLoading: true,
      error: null,
    });

    render(<QuizListPage />, { wrapper: TestWrapper });

    // Look for loading spinner
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
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