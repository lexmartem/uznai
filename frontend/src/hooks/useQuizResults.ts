import { useQuery } from '@tanstack/react-query';
import { quizResultService } from '@/services/quiz-result-service';
import type { QuizResult } from '@/types/quiz-session';

export function useQuizResults(quizId: string) {
    const { data: result, isLoading: isLoadingResult } = useQuery<QuizResult>({
        queryKey: ['quiz-result', quizId],
        queryFn: () => quizResultService.getLatestResultForQuiz(quizId),
    });

    const { data: userResults, isLoading: isLoadingUserResults } = useQuery<{
        content: QuizResult[];
        totalPages: number;
        totalElements: number;
    }>({
        queryKey: ['user-results'],
        queryFn: () => quizResultService.getUserResults(),
    });

    const { data: quizResults, isLoading: isLoadingQuizResults } = useQuery<{
        content: QuizResult[];
        totalPages: number;
        totalElements: number;
    }>({
        queryKey: ['quiz-results', quizId],
        queryFn: () => quizResultService.getUserResultsForQuiz(quizId),
    });

    return {
        result,
        userResults,
        quizResults,
        isLoading: isLoadingResult || isLoadingUserResults || isLoadingQuizResults,
    };
} 