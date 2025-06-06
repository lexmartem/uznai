'use client';

import { useState } from 'react';
import { useQuestions } from '@/hooks/useQuestions';
import { QuestionForm } from '@/components/quiz/QuestionForm';
import { useRouter } from 'next/navigation';
import { Question, QuizError } from '@/types/quiz';
import Link from 'next/link';

interface QuestionsClientProps {
  quizId: string;
}

export function QuestionsClient({ quizId }: QuestionsClientProps) {
  const router = useRouter();
  const { questions, createQuestion, isCreating, error } = useQuestions(quizId);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateQuestion = async (data: any) => {
    try {
      await createQuestion(data, {
        onSuccess: (question: Question) => {
          setShowCreateForm(false);
          router.refresh();
        },
        onError: (error: QuizError) => {
          console.error('Failed to create question:', error);
        }
      });
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Questions</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage questions for this quiz. Add, edit, or remove questions as needed.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Question
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Question</h3>
            <div className="mt-5">
              <QuestionForm onSubmit={handleCreateQuestion} isLoading={isCreating} />
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {questions && questions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {questions.map((question: Question) => (
              <li key={question.id} className="py-4">
                <Link href={`/quizzes/${quizId}/questions/${question.id}/answers`} className="block hover:bg-gray-50">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">{question.questionText}</p>
                        <p className="mt-1 text-sm text-gray-500">Type: {question.questionType}</p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {question.orderIndex + 1}
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new question.</p>
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