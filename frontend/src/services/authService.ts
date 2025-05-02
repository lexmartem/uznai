import { ApiClient } from '@/lib/api/client';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export const authService = {
  login: async (request: LoginRequest): Promise<AuthResponse> => {
    const response = await ApiClient.post<AuthResponse>('/api/v1/auth/login', request);
    if (response.accessToken) {
      localStorage.setItem('authToken', response.accessToken);
    }
    return response;
  },

  register: async (request: RegisterRequest): Promise<AuthResponse> => {
    const response = await ApiClient.post<AuthResponse>('/api/v1/auth/register', request);
    if (response.accessToken) {
      localStorage.setItem('authToken', response.accessToken);
    }
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await ApiClient.post<void>('/api/v1/auth/logout', {});
    } finally {
      localStorage.removeItem('authToken');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  async requestPasswordReset(email: string): Promise<void> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to request password reset');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
  },
}; 