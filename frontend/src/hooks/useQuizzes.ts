import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import quizService from '../services/quiz-service';
import { Quiz, QuizSummary, CreateQuizRequest, UpdateQuizRequest } from '../types/quiz';
import { useState, useEffect } from 'react';
import { ApiClient } from '../lib/api/client';

interface QuizError {
  message: string;
  code: string;
}

export const useQuizzes = (page: number = 0, size: number = 10) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['quizzes', page, size],
    queryFn: () => quizService.getQuizzes(page, size),
  });

  const createQuizMutation = useMutation({
    mutationFn: (quiz: CreateQuizRequest) => quizService.createQuiz(quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  const updateQuizMutation = useMutation({
    mutationFn: ({ id, quiz }: { id: string; quiz: UpdateQuizRequest }) => 
      quizService.updateQuiz(id, quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  const deleteQuizMutation = useMutation({
    mutationFn: (id: string) => quizService.deleteQuiz(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });

  return {
    quizzes: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
    createQuiz: createQuizMutation.mutate,
    updateQuiz: updateQuizMutation.mutate,
    deleteQuiz: deleteQuizMutation.mutate,
    isCreating: createQuizMutation.isPending,
    isUpdating: updateQuizMutation.isPending,
    isDeleting: deleteQuizMutation.isPending,
  };
};

export const useQuiz = (id: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizService.getQuizById(id),
  });

  const updateQuizMutation = useMutation({
    mutationFn: (quiz: UpdateQuizRequest) => quizService.updateQuiz(id, quiz),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', id] });
    },
  });

  return {
    quiz: data,
    isLoading,
    error,
    updateQuiz: updateQuizMutation.mutate,
    isUpdating: updateQuizMutation.isPending,
  };
};

export const usePublicQuizzes = (page: number = 0, size: number = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['publicQuizzes', page, size],
    queryFn: () => quizService.getAllPublicQuizzes(page, size),
  });
  return {
    quizzes: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
  };
};

export const useUserPublicQuizzes = (userId: string, page: number = 0, size: number = 10) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userPublicQuizzes', userId, page, size],
    queryFn: () => quizService.getPublicQuizzesByUser(userId, page, size),
    enabled: !!userId,
  });
  return {
    quizzes: data?.content || [],
    totalPages: data?.totalPages || 0,
    totalElements: data?.totalElements || 0,
    isLoading,
    error,
  };
};

interface UseQuizzesResult {
  quizzes: Quiz[];
  isLoading: boolean;
  error: QuizError | null;
  createQuiz: (data: CreateQuizRequest, callbacks?: {
    onSuccess?: (quiz: Quiz) => void;
    onError?: (error: QuizError) => void;
  }) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
  isCreating: boolean;
}

export function useQuizzesLegacy(): UseQuizzesResult {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<QuizError | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const response = await ApiClient.get<Quiz[]>('/quizzes');
      setQuizzes(response);
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to fetch quizzes',
        code: 'FETCH_ERROR'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createQuiz = async (data: CreateQuizRequest, callbacks?: {
    onSuccess?: (quiz: Quiz) => void;
    onError?: (error: QuizError) => void;
  }) => {
    try {
      setIsCreating(true);
      const response = await ApiClient.post<Quiz>('/quizzes', data);
      setQuizzes(prev => [...prev, response]);
      callbacks?.onSuccess?.(response);
      setError(null);
    } catch (err) {
      const error = {
        message: 'Failed to create quiz',
        code: 'CREATE_ERROR'
      };
      setError(error);
      callbacks?.onError?.(error);
    } finally {
      setIsCreating(false);
    }
  };

  const deleteQuiz = async (id: string) => {
    try {
      await ApiClient.delete(`/quizzes/${id}`);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to delete quiz',
        code: 'DELETE_ERROR'
      });
    }
  };

  return {
    quizzes,
    isLoading,
    error,
    createQuiz,
    deleteQuiz,
    isCreating
  };
} 