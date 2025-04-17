import { ApiClient } from './client';
import { UserProfile, ProfileUpdateRequest } from '@/types/user';
import { PasswordChangeRequest } from '@/types/auth';

export const userApi = {
  getCurrentUser: () => ApiClient.get<UserProfile>('/api/v1/users/me'),

  updateProfile: (data: ProfileUpdateRequest) =>
    ApiClient.put<UserProfile>('/api/v1/users/me', data),

  changePassword: (data: PasswordChangeRequest) =>
    ApiClient.put<void>('/api/v1/users/me/password', data),
}; 