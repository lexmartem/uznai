'use client';

import { useQuizzes } from '../../../hooks/useQuizzes';
import { CreateQuizForm } from '../../../components/quiz/CreateQuizForm';
import { useRouter } from 'next/navigation';
import { Quiz } from '../../../types/quiz';

export function NewQuizClient() {
  const router = useRouter();
  const { createQuiz, isCreating, error } = useQuizzes();

  const handleSubmit = async (data: any) => {
    try {
      createQuiz(data, {
        onSuccess: (quiz: Quiz) => {
          router.push(`/quizzes/${quiz.id}`);
        },
        onError: (error) => {
          console.error('Failed to create quiz:', error);
        }
      });
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
        <p className="mt-2 text-gray-500">
          Create a new quiz by filling out the form below. You can add questions and answers after
          creating the quiz.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateQuizForm onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
} 