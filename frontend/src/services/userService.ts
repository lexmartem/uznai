import { ApiClient } from '@/lib/api/client';
import { UserProfile, PasswordChangeRequest } from '@/types';

export const userService = {
  getCurrentUser: async (): Promise<UserProfile> => {
    return ApiClient.get<UserProfile>('/api/v1/users/me');
  },

  updateCurrentUser: async (profile: UserProfile): Promise<UserProfile> => {
    return ApiClient.put<UserProfile>('/api/v1/users/me', profile);
  },

  changePassword: async (request: PasswordChangeRequest): Promise<void> => {
    return ApiClient.put<void>('/api/v1/users/me/password', request);
  }
}; 