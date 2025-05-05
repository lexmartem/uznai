import { useMutation, useQueryClient } from '@tanstack/react-query';
import quizService from '../services/quiz-service';
import { Answer, CreateAnswerRequest, UpdateAnswerRequest } from '../types/quiz';

export const useAnswers = (questionId: string) => {
  const queryClient = useQueryClient();

  const createAnswerMutation = useMutation({
    mutationFn: (answer: CreateAnswerRequest) => 
      quizService.createAnswer(questionId, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const updateAnswerMutation = useMutation({
    mutationFn: ({ id, answer }: { id: string; answer: UpdateAnswerRequest }) => 
      quizService.updateAnswer(id, answer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  const deleteAnswerMutation = useMutation({
    mutationFn: (id: string) => quizService.deleteAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });

  return {
    createAnswer: createAnswerMutation.mutate,
    updateAnswer: updateAnswerMutation.mutate,
    deleteAnswer: deleteAnswerMutation.mutate,
    isCreating: createAnswerMutation.isPending,
    isUpdating: updateAnswerMutation.isPending,
    isDeleting: deleteAnswerMutation.isPending,
  };
}; 