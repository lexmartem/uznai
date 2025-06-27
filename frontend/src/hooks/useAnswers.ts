import { useState, useEffect } from 'react';
import { Answer, CreateAnswerRequest, UpdateAnswerRequest, QuizError } from '@/types/quiz';
import { ApiClient } from '@/lib/api/client';

interface UseAnswersResult {
  answers: Answer[];
  isLoading: boolean;
  error: QuizError | null;
  createAnswer: (data: CreateAnswerRequest, callbacks?: {
    onSuccess?: (answer: Answer) => void;
    onError?: (error: QuizError) => void;
  }) => Promise<void>;
  updateAnswer: (id: string, data: UpdateAnswerRequest, callbacks?: {
    onSuccess?: (answer: Answer) => void;
    onError?: (error: QuizError) => void;
  }) => Promise<void>;
  deleteAnswer: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
}

export function useAnswers(quizId: string, questionId: string): UseAnswersResult {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<QuizError | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!quizId || !questionId) return;
    fetchAnswers();
  }, [quizId, questionId]);

  const fetchAnswers = async () => {
    if (!quizId || !questionId) return;
    try {
      setIsLoading(true);
      const response = await ApiClient.get<Answer[]>(`/api/v1/quizzes/${quizId}/questions/${questionId}/answers`);
      setAnswers(response);
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to fetch answers',
        code: 'FETCH_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createAnswer = async (data: CreateAnswerRequest, callbacks?: {
    onSuccess?: (answer: Answer) => void;
    onError?: (error: QuizError) => void;
  }) => {
    if (!quizId || !questionId) return;
    try {
      setIsCreating(true);
      const response = await ApiClient.post<Answer>(`/api/v1/quizzes/${quizId}/questions/${questionId}/answers`, data);
      setAnswers(prev => [...prev, response]);
      callbacks?.onSuccess?.(response);
      setError(null);
    } catch (err) {
      const error = {
        message: 'Failed to create answer',
        code: 'CREATE_ERROR'
      };
      setError(error);
      callbacks?.onError?.(error);
    } finally {
      setIsCreating(false);
    }
  };

  const updateAnswer = async (id: string, data: UpdateAnswerRequest, callbacks?: {
    onSuccess?: (answer: Answer) => void;
    onError?: (error: QuizError) => void;
  }) => {
    if (!quizId || !questionId) return;
    try {
      setIsUpdating(true);
      const response = await ApiClient.put<Answer>(`/api/v1/quizzes/${quizId}/questions/${questionId}/answers/${id}`, data);
      setAnswers(prev => prev.map(answer => answer.id === id ? response : answer));
      callbacks?.onSuccess?.(response);
      setError(null);
    } catch (err) {
      const error = {
        message: 'Failed to update answer',
        code: 'UPDATE_ERROR'
      };
      setError(error);
      callbacks?.onError?.(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteAnswer = async (id: string) => {
    if (!quizId || !questionId) return;
    try {
      await ApiClient.delete(`/api/v1/quizzes/${quizId}/questions/${questionId}/answers/${id}`);
      setAnswers(prev => prev.filter(answer => answer.id !== id));
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to delete answer',
        code: 'DELETE_ERROR'
      });
    }
  };

  return {
    answers,
    isLoading,
    error,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    isCreating,
    isUpdating
  };
} 