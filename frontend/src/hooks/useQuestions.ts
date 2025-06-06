import { useState, useEffect } from 'react';
import { Question, CreateQuestionRequest, QuizError } from '../types/quiz';
import { ApiClient } from '../lib/api/client';

interface UseQuestionsResult {
  questions: Question[];
  isLoading: boolean;
  error: QuizError | null;
  createQuestion: (data: CreateQuestionRequest, callbacks?: {
    onSuccess?: (question: Question) => void;
    onError?: (error: QuizError) => void;
  }) => Promise<void>;
  deleteQuestion: (id: string) => Promise<void>;
  isCreating: boolean;
}

export function useQuestions(quizId: string): UseQuestionsResult {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<QuizError | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.get<Question[]>(`/api/v1/quizzes/${quizId}/questions`);
      setQuestions(response);
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to fetch questions',
        code: 'FETCH_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createQuestion = async (data: CreateQuestionRequest, callbacks?: {
    onSuccess?: (question: Question) => void;
    onError?: (error: QuizError) => void;
  }) => {
    try {
      setIsCreating(true);
      const response = await ApiClient.post<Question>(`/api/v1/quizzes/${quizId}/questions`, data);
      setQuestions(prev => [...prev, response]);
      callbacks?.onSuccess?.(response);
      setError(null);
    } catch (err) {
      const error = {
        message: 'Failed to create question',
        code: 'CREATE_ERROR'
      };
      setError(error);
      callbacks?.onError?.(error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      await ApiClient.delete(`/api/v1/quizzes/${quizId}/questions/${id}`);
      setQuestions(prev => prev.filter(question => question.id !== id));
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to delete question',
        code: 'DELETE_ERROR'
      });
    }
  };

  return {
    questions,
    isLoading,
    error,
    createQuestion,
    deleteQuestion,
    isCreating
  };
} 