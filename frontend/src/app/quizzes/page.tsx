import { useQuizzes } from '../../hooks/useQuizzes';
import { QuizList } from '../../components/quiz/QuizList';
import Link from 'next/link';

export default function QuizzesPage() {
  const { quizzes, totalPages, isLoading, deleteQuiz, error } = useQuizzes();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await deleteQuiz(id);
      } catch (error) {
        console.error('Failed to delete quiz:', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your quizzes, including public and private ones.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/quizzes/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Quiz
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <QuizList quizzes={quizzes} isLoading={isLoading} onDelete={handleDelete} error={error} />
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page 1 of {totalPages}
          </span>
          <button
            disabled={isLoading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 