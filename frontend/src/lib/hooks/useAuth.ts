import { useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api/auth';
import { userApi } from '@/lib/api/user';
import { User } from '@/types/user';
import { LoginRequest, RegisterRequest } from '@/types/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await userApi.getCurrentUser();
        setUser(userData);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (data: LoginRequest) => {
    try {
      setError(null);
      const response = await authApi.login(data);
      localStorage.setItem('authToken', response.token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      setUser(response.user);
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      setError(null);
      const response = await authApi.register(data);
      localStorage.setItem('authToken', response.token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      setUser(response.user);
    } catch (err: any) {
      // Handle validation errors
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // If it's a validation error with field-specific messages
          const errorMessages = Object.values(errorData).join(', ');
          setError(errorMessages);
        } else {
          // If it's a general error message
          setError(errorData);
        }
      } else {
        setError('Registration failed. Please try again.');
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await authApi.refreshToken({ refresh_token: refreshToken });
      localStorage.setItem('authToken', response.token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      setUser(response.user);
      return true;
    } catch (err) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshToken,
  };
} 