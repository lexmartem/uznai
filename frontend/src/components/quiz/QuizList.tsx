import { QuizSummary } from '../../types/quiz';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuizListProps {
  quizzes: QuizSummary[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  error?: Error | null;
}

export const QuizList = ({ quizzes, isLoading, onDelete, error }: QuizListProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div data-testid="loading-spinner" className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600" />
        <p className="mt-2 text-sm text-gray-500">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{error.message}</p>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new quiz.</p>
        <div className="mt-6">
          <Link
            href="/quizzes/new"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              <Link href={`/quizzes/${quiz.id}/questions`} className="hover:underline">
                {quiz.title}
              </Link>
            </h3>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  quiz.isPublic
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {quiz.isPublic ? 'Public' : 'Private'}
              </span>
              <button
                onClick={() => router.push(`/quizzes/${quiz.id}/take`)}
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Take Quiz
              </button>
              <button
                onClick={() => onDelete(quiz.id)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Delete</span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">{quiz.description}</p>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div>
              <span>{quiz.questionCount} questions</span>
            </div>
            <div>
              <span>{quiz.activeUsers} active</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 