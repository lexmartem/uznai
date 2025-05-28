import { useUserPublicQuizzes } from '../../../../hooks/useQuizzes';
import { QuizList } from '../../../../components/quiz/QuizList';
import { useRouter } from 'next/router';

export default function UserPublicQuizzesPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const { quizzes, isLoading, error } = useUserPublicQuizzes(userId);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">User's Public Quizzes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all public quizzes created by this user.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <QuizList quizzes={quizzes} isLoading={isLoading} onDelete={() => {}} error={error} />
      </div>
    </div>
  );
} 