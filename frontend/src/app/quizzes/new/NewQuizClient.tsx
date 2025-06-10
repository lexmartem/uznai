'use client';

import { useQuizzes } from '@/hooks/useQuizzes';
import { CreateQuizForm } from '@/components/quiz/CreateQuizForm';

export function NewQuizClient() {
  const { createQuiz, isCreating, error } = useQuizzes();

  return (
    <>
      <CreateQuizForm onSubmit={createQuiz} isLoading={isCreating} />
      {error && <p className="text-red-600 mt-4">{error.message}</p>}
    </>
  );
} 