import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import quizService from '../services/quiz-service';
import { Question, CreateQuestionRequest, UpdateQuestionRequest } from '../types/quiz';

export const useQuestions = (quizId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['questions', quizId],
    queryFn: () => quizService.getQuestionsByQuizId(quizId),
  });

  const createQuestionMutation = useMutation({
    mutationFn: (question: CreateQuestionRequest) => 
      quizService.createQuestion(quizId, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', quizId] });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: ({ id, question }: { id: string; question: UpdateQuestionRequest }) => 
      quizService.updateQuestion(id, question),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', quizId] });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: string) => quizService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', quizId] });
    },
  });

  return {
    questions: data || [],
    isLoading,
    error,
    createQuestion: createQuestionMutation.mutate,
    updateQuestion: updateQuestionMutation.mutate,
    deleteQuestion: deleteQuestionMutation.mutate,
    isCreating: createQuestionMutation.isPending,
    isUpdating: updateQuestionMutation.isPending,
    isDeleting: deleteQuestionMutation.isPending,
  };
}; 