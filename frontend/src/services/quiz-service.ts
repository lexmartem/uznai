import { ApiClient } from '@/lib/api/client';
import { Quiz, QuizSummary, CreateQuizRequest, UpdateQuizRequest, Question, CreateQuestionRequest, UpdateQuestionRequest, Answer, CreateAnswerRequest, UpdateAnswerRequest } from '../types/quiz';

const quizService = {
  // Quiz endpoints
  getQuizzes: async (page: number = 0, size: number = 10): Promise<{ content: QuizSummary[]; totalPages: number; totalElements: number }> => {
    return ApiClient.get(`/api/v1/quizzes/me?page=${page}&size=${size}`);
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    return ApiClient.get(`/api/v1/quizzes/${id}`);
  },

  createQuiz: async (quiz: CreateQuizRequest): Promise<Quiz> => {
    return ApiClient.post(`/api/v1/quizzes`, quiz);
  },

  updateQuiz: async (id: string, quiz: UpdateQuizRequest): Promise<Quiz> => {
    return ApiClient.put(`/api/v1/quizzes/${id}`, quiz);
  },

  deleteQuiz: async (id: string): Promise<void> => {
    return ApiClient.delete(`/api/v1/quizzes/${id}`);
  },

  // Question endpoints
  getQuestionsByQuizId: async (quizId: string): Promise<Question[]> => {
    return ApiClient.get(`/api/v1/quizzes/${quizId}/questions`);
  },

  createQuestion: async (quizId: string, question: CreateQuestionRequest): Promise<Question> => {
    return ApiClient.post(`/api/v1/quizzes/${quizId}/questions`, question);
  },

  updateQuestion: async (id: string, question: UpdateQuestionRequest): Promise<Question> => {
    return ApiClient.put(`/api/v1/questions/${id}`, question);
  },

  deleteQuestion: async (id: string): Promise<void> => {
    return ApiClient.delete(`/api/v1/questions/${id}`);
  },

  // Answer endpoints
  createAnswer: async (quizId: string, questionId: string, answer: CreateAnswerRequest): Promise<Answer> => {
    return ApiClient.post(`/api/v1/quizzes/${quizId}/questions/${questionId}/answers`, answer);
  },

  updateAnswer: async (id: string, answer: UpdateAnswerRequest): Promise<Answer> => {
    return ApiClient.put(`/api/v1/answers/${id}`, answer);
  },

  deleteAnswer: async (id: string): Promise<void> => {
    return ApiClient.delete(`/api/v1/answers/${id}`);
  },

  getAllPublicQuizzes: async (page: number = 0, size: number = 10): Promise<{ content: QuizSummary[]; totalPages: number; totalElements: number }> => {
    return ApiClient.get(`/api/v1/quizzes/public?page=${page}&size=${size}`);
  },

  getPublicQuizzesByUser: async (userId: string, page: number = 0, size: number = 10): Promise<{ content: QuizSummary[]; totalPages: number; totalElements: number }> => {
    return ApiClient.get(`/api/v1/users/${userId}/quizzes?page=${page}&size=${size}`);
  }
};

export default quizService; 