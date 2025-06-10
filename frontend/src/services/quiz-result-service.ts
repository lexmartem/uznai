import { ApiClient } from '@/lib/api/client';
import type { QuizResult } from '@/types/quiz-session';

export const quizResultService = {
    getResult: async (resultId: string): Promise<QuizResult> => {
        return ApiClient.get<QuizResult>(`/api/v1/results/${resultId}`);
    },

    getUserResults: async (page = 0, size = 10): Promise<{
        content: QuizResult[];
        totalPages: number;
        totalElements: number;
    }> => {
        return ApiClient.get(`/api/v1/users/me/results?page=${page}&size=${size}`);
    },

    getUserResultsForQuiz: async (
        quizId: string,
        page = 0,
        size = 10
    ): Promise<{
        content: QuizResult[];
        totalPages: number;
        totalElements: number;
    }> => {
        return ApiClient.get(`/api/v1/users/me/results/quiz/${quizId}?page=${page}&size=${size}`);
    },

    getLatestResultForQuiz: async (quizId: string): Promise<QuizResult> => {
        return ApiClient.get<QuizResult>(`/api/v1/users/me/results/quiz/${quizId}/latest`);
    },
}; 