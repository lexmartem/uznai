const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface ApiError {
  message: string;
  status: number;
  response?: {
    data: any;
    status: number;
    statusText: string;
  };
}

class ApiClient {
  private static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
      credentials: 'include', // Always include credentials
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error: ApiError = {
          message: 'An error occurred',
          status: response.status,
        };

        try {
          const data = await response.json();
          error.message = data.message || error.message;
          error.response = {
            data,
            status: response.status,
            statusText: response.statusText,
          };
        } catch {
          // If parsing fails, use default error message
        }

        throw error;
      }

      // For empty responses (like DELETE operations sometimes)
      if (response.status === 204) {
        return {} as T;
      }

      // Try to parse as JSON, but handle cases where response might not be JSON
      try {
        return await response.json();
      } catch (e) {
        return {} as T;
      }
    } catch (error) {
      // Do not wrap the error, just re-throw so custom properties are preserved
      throw error;
    }
  }

  static async get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  static async post<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export { ApiClient };