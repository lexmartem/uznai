'use client';

import { useState } from 'react';
import { useQuizzes } from '@/hooks/useQuizzes';
import { CreateQuizForm } from '@/components/quiz/CreateQuizForm';
import { useRouter } from 'next/navigation';
import { Quiz, QuizError, QuizSummary } from '@/types/quiz';
import Link from 'next/link';

export function QuizzesClient() {
  const router = useRouter();
  const { quizzes, createQuiz, isLoading, error } = useQuizzes();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateQuiz = async (data: any) => {
    try {
      await createQuiz(data, {
        onSuccess: (quiz: Quiz) => {
          setShowCreateForm(false);
          router.refresh();
        },
        onError: (error: QuizError) => {
          console.error('Failed to create quiz:', error);
        }
      });
    } catch (error) {
      console.error('Failed to create quiz:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your quizzes, including public and private ones.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Create Quiz
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Quiz</h3>
            <div className="mt-5">
              <CreateQuizForm onSubmit={handleCreateQuiz} isLoading={isLoading} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {quizzes && quizzes.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {quizzes.map((quiz: QuizSummary) => (
              <li key={quiz.id} className="py-4">
                <Link href={`/quizzes/${quiz.id}/questions`} className="block hover:bg-gray-50">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">{quiz.title}</p>
                        <p className="mt-1 text-sm text-gray-500">{quiz.description}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          quiz.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {quiz.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new quiz.</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-4">
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
    </div>
  );
} 