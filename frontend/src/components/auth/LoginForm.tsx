import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoginRequest } from '@/types/auth';
import Link from 'next/link';

export function LoginForm() {
  const { login, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: '',
    remember_me: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      await login(formData);
      setSuccess(true);
    } catch (err) {
      setError(authError || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Login successful! Welcome back.
        </div>
        <div className="text-center">
          <Link href="/quizzes/new" className="text-blue-500 hover:text-blue-600">
            Create a New Quiz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember_me"
            checked={formData.remember_me}
            onChange={(e) =>
              setFormData({ ...formData, remember_me: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
            Remember me
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>
    </div>
  );
} 