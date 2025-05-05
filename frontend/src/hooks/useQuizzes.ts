import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import quizService from '../services/quiz-service';
import { Quiz, QuizSummary, CreateQuizRequest, UpdateQuizRequest } from '../types/quiz';

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