'use client';

import { useQuiz, useQuizzes } from '@/hooks/useQuizzes';
import { useQuestions } from '@/hooks/useQuestions';
import { QuestionForm } from '@/components/quiz/QuestionForm';
import { AnswerForm } from '@/components/quiz/AnswerForm';
import { useAnswers } from '@/hooks/useAnswers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface QuizDetailClientProps {
  quizId: string;
}

export function QuizDetailClient({ quizId }: QuizDetailClientProps) {
  const router = useRouter();
  const { quiz, isLoading: isLoadingQuiz, error: quizError } = useQuiz(quizId);
  const { questions, createQuestion, isLoading: isLoadingQuestions } = useQuestions(quizId);

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const answersHook = useAnswers(quizId, selectedQuestionId ?? '');

  if (quizError) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{quizError.message}</p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/quizzes')}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingQuiz) {
    return (
      <div className="animate-pulse space-y-4" role="presentation">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-24 rounded bg-gray-200" />
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const handleCreateQuestion = async (data: any) => {
    const question = await createQuestion({
      ...data,
      orderIndex: questions.length,
    });
    return question;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="mt-2 text-gray-500">{quiz.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/quizzes/${quizId}/questions`)}
            className="inline-flex items-center rounded-md border border-transparent bg-gray-300 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Edit Quiz
          </button>
          <button
            onClick={() => router.push(`/quizzes/${quizId}/take`)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Take Quiz
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Questions</h2>
        {questions.map((question) => (
          <div key={question.id} className="rounded-xl shadow-lg p-4 bg-purple-100 mb-4">
            <h3 className="text-base font-bold text-purple-700">{question.questionText}</h3>
            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt="Question image"
                className="mt-2 max-h-48 rounded-lg"
              />
            )}
            {question.codeSnippet && (
              <pre className="mt-2 rounded-lg bg-blue-100 p-4 font-mono text-sm">
                {question.codeSnippet}
              </pre>
            )}
            <div className="mt-4">
              <h4 className="text-sm font-bold text-blue-700">Answers</h4>
              <div className="mt-2 space-y-2">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`rounded-lg p-2 shadow-md ${answer.correct ? 'bg-green-200' : 'bg-white'}`}
                  >
                    <p className="text-sm text-gray-900">{answer.answerText}</p>
                    {answer.imageUrl && (
                      <img
                        src={answer.imageUrl}
                        alt="Answer image"
                        className="mt-2 max-h-32 rounded-lg"
                      />
                    )}
                    {answer.codeSnippet && (
                      <pre className="mt-2 rounded-lg bg-blue-100 p-2 font-mono text-xs">
                        {answer.codeSnippet}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 