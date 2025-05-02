// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
}

// Common Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt?: string;
  updatedAt?: string;
}

// Quiz Types
export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  correctAnswer: string | string[];
  explanation?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  SHORT_ANSWER = 'SHORT_ANSWER',
}

// User Profile Types
export interface UserProfile {
  username: string;
  bio?: string;
  avatarUrl?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 