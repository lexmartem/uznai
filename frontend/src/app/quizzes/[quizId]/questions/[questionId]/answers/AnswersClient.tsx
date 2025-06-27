'use client';

import { useState } from 'react';
import { useAnswers } from '@/hooks/useAnswers';
import { AnswerForm } from '@/components/quiz/AnswerForm';
import { useRouter } from 'next/navigation';
import { Answer } from '@/types/quiz';
import Link from 'next/link';

interface AnswersClientProps {
  quizId: string;
  questionId: string;
}

export function AnswersClient({ quizId, questionId }: AnswersClientProps) {
  const router = useRouter();
  const { answers, createAnswer, updateAnswer, deleteAnswer, isCreating, isUpdating, error } = useAnswers(quizId, questionId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);

  const handleCreateAnswer = async (data: any) => {
    try {
      await createAnswer(data, {
        onSuccess: (answer: Answer) => {
          setShowCreateForm(false);
          router.refresh();
        },
        onError: (error) => {
          console.error('Failed to create answer:', error);
        }
      });
    } catch (error) {
      console.error('Failed to create answer:', error);
    }
  };

  const handleUpdateAnswer = async (data: any) => {
    if (!editingAnswer) return;
    
    try {
      await updateAnswer(editingAnswer.id, { ...data, version: editingAnswer.version }, {
        onSuccess: (answer: Answer) => {
          setEditingAnswer(null);
          router.refresh();
        },
        onError: (error) => {
          console.error('Failed to update answer:', error);
        }
      });
    } catch (error) {
      console.error('Failed to update answer:', error);
    }
  };

  const handleDeleteAnswer = async (answerId: string) => {
    if (confirm('Are you sure you want to delete this answer? This action cannot be undone.')) {
      try {
        await deleteAnswer(answerId);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete answer:', error);
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Question Answers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage answers for this question. Add, edit, or remove answers as needed.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Answer
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Create New Answer</h3>
            <div className="mt-5">
              <AnswerForm onSubmit={handleCreateAnswer} isLoading={isCreating} />
            </div>
          </div>
        </div>
      )}

      {editingAnswer && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Answer</h3>
            <div className="mt-5">
              <AnswerForm 
                initialData={editingAnswer} 
                onSubmit={handleUpdateAnswer} 
                isLoading={isUpdating} 
              />
            </div>
            <div className="mt-4">
              <button
                onClick={() => setEditingAnswer(null)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {answers && answers.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {answers.map((answer) => (
              <li key={answer.id} className="py-4">
                <div className="px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-indigo-600 truncate">{answer.answerText}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {answer.correct ? 'Correct Answer' : 'Incorrect Answer'}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        answer.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {answer.correct ? 'Correct' : 'Incorrect'}
                      </span>
                      <button
                        onClick={() => setEditingAnswer(answer)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAnswer(answer.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No answers</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new answer.</p>
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