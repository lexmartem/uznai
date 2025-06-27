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
  const { questions, createQuestion, updateQuestion, deleteQuestion, isCreating, isUpdating, error } = useQuestions(quizId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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

  const handleUpdateQuestion = async (data: any) => {
    console.log('handleUpdateQuestion called', data, editingQuestion);
    if (!editingQuestion) return;
    
    try {
      await updateQuestion(editingQuestion.id, { ...data, version: editingQuestion.version }, {
        onSuccess: (question: Question) => {
          setEditingQuestion(null);
          router.refresh();
        },
        onError: (error: QuizError) => {
          console.error('Failed to update question:', error);
        }
      });
    } catch (error) {
      console.error('Failed to update question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        await deleteQuestion(questionId);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete question:', error);
      }
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

      {editingQuestion && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Question</h3>
            <div className="mt-5">
              <QuestionForm 
                initialData={editingQuestion} 
                onSubmit={handleUpdateQuestion} 
                isLoading={isUpdating} 
              />
            </div>
            <div className="mt-4">
              <button
                onClick={() => setEditingQuestion(null)}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        {questions && questions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {questions.map((question: Question) => (
              <li key={question.id} className="py-4">
                <div className="px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link href={`/quizzes/${quizId}/questions/${question.id}/answers`} className="block hover:bg-gray-50">
                        <p className="text-sm font-medium text-indigo-600 truncate">{question.questionText}</p>
                        <p className="mt-1 text-sm text-gray-500">Type: {question.questionType}</p>
                      </Link>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {question.orderIndex + 1}
                      </span>
                      <button
                        onClick={() => setEditingQuestion(question)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
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