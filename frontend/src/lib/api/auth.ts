import { ApiClient } from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
} from '@/types/auth';

export const authApi = {
  login: (data: LoginRequest) =>
    ApiClient.post<AuthResponse>('/api/v1/auth/login', data),

  register: (data: RegisterRequest) =>
    ApiClient.post<AuthResponse>('/api/v1/auth/register', data),

  logout: () => ApiClient.post<void>('/api/v1/auth/logout', {}),

  forgotPassword: (data: ForgotPasswordRequest) =>
    ApiClient.post<void>('/api/v1/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordRequest) =>
    ApiClient.post<void>('/api/v1/auth/reset-password', data),

  refreshToken: (data: RefreshTokenRequest) =>
    ApiClient.post<AuthResponse>('/api/v1/auth/refresh', data),
}; 