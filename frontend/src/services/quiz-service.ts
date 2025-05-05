import axios from 'axios';
import { Quiz, QuizSummary, CreateQuizRequest, UpdateQuizRequest, Question, CreateQuestionRequest, UpdateQuestionRequest, Answer, CreateAnswerRequest, UpdateAnswerRequest } from '../types/quiz';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

const quizService = {
  // Quiz endpoints
  getQuizzes: async (page: number = 0, size: number = 10): Promise<{ content: QuizSummary[]; totalPages: number; totalElements: number }> => {
    const response = await axios.get(`${API_BASE_URL}/v1/quizzes/me`, {
      params: { page, size }
    });
    return response.data;
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    const response = await axios.get(`${API_BASE_URL}/v1/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (quiz: CreateQuizRequest): Promise<Quiz> => {
    const response = await axios.post(`${API_BASE_URL}/v1/quizzes`, quiz);
    return response.data;
  },

  updateQuiz: async (id: string, quiz: UpdateQuizRequest): Promise<Quiz> => {
    const response = await axios.put(`${API_BASE_URL}/v1/quizzes/${id}`, quiz);
    return response.data;
  },

  deleteQuiz: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/v1/quizzes/${id}`);
  },

  // Question endpoints
  getQuestionsByQuizId: async (quizId: string): Promise<Question[]> => {
    const response = await axios.get(`${API_BASE_URL}/v1/quizzes/${quizId}/questions`);
    return response.data;
  },

  createQuestion: async (quizId: string, question: CreateQuestionRequest): Promise<Question> => {
    const response = await axios.post(`${API_BASE_URL}/v1/quizzes/${quizId}/questions`, question);
    return response.data;
  },

  updateQuestion: async (id: string, question: UpdateQuestionRequest): Promise<Question> => {
    const response = await axios.put(`${API_BASE_URL}/v1/questions/${id}`, question);
    return response.data;
  },

  deleteQuestion: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/v1/questions/${id}`);
  },

  // Answer endpoints
  createAnswer: async (questionId: string, answer: CreateAnswerRequest): Promise<Answer> => {
    const response = await axios.post(`${API_BASE_URL}/v1/questions/${questionId}/answers`, answer);
    return response.data;
  },

  updateAnswer: async (id: string, answer: UpdateAnswerRequest): Promise<Answer> => {
    const response = await axios.put(`${API_BASE_URL}/v1/answers/${id}`, answer);
    return response.data;
  },

  deleteAnswer: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/v1/answers/${id}`);
  }
};

export default quizService; 