import { usePublicQuizzes } from '../../../hooks/useQuizzes';
import { QuizList } from '../../../components/quiz/QuizList';

export default function PublicQuizzesPage() {
  const { quizzes, isLoading, error } = usePublicQuizzes();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Public Quizzes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all public quizzes available on the platform.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <QuizList quizzes={quizzes} isLoading={isLoading} onDelete={() => {}} error={error} />
      </div>
    </div>
  );
} 