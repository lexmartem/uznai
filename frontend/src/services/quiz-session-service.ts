import { ApiClient } from '@/lib/api/client';
import type {
    QuizSession,
    Question,
    StartQuizSessionRequest,
    SubmitAnswerRequest,
} from '@/types/quiz-session';

export const quizSessionService = {
    startSession: async (quizId: string): Promise<QuizSession> => {
        return ApiClient.post<QuizSession>(`/api/v1/quizzes/${quizId}/sessions`, {
            quizId,
        });
    },

    getSession: async (sessionId: string): Promise<QuizSession> => {
        return ApiClient.get<QuizSession>(`/api/v1/sessions/${sessionId}`);
    },

    getSessionQuestions: async (sessionId: string, page = 0, size = 10): Promise<{
        content: Question[];
        totalPages: number;
        totalElements: number;
    }> => {
        return ApiClient.get(`/api/v1/sessions/${sessionId}/questions?page=${page}&size=${size}`);
    },

    submitAnswer: async (
        sessionId: string,
        questionId: string,
        request: SubmitAnswerRequest
    ): Promise<void> => {
        await ApiClient.post(
            `/api/v1/sessions/${sessionId}/questions/${questionId}/answers`,
            request
        );
    },

    completeSession: async (sessionId: string): Promise<QuizSession> => {
        return ApiClient.post<QuizSession>(`/api/v1/sessions/${sessionId}/complete`, {});
    },

    expireSession: async (sessionId: string): Promise<void> => {
        await ApiClient.post(`/api/v1/sessions/${sessionId}/expire`, {});
    },

    getUserSessions: async (page = 0, size = 10): Promise<{
        content: QuizSession[];
        totalPages: number;
        totalElements: number;
    }> => {
        return ApiClient.get(`/api/v1/users/me/sessions?page=${page}&size=${size}`);
    },
}; 