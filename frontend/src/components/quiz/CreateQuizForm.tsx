'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateQuizRequest } from '../../types/quiz';

const quizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long'),
  isPublic: z.boolean(),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface CreateQuizFormProps {
  onSubmit: (data: QuizFormData) => void;
  isLoading: boolean;
}

export const CreateQuizForm: React.FC<CreateQuizFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full p-2 border rounded"
          disabled={isLoading}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full p-2 border rounded"
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isPublic"
          type="checkbox"
          {...register('isPublic')}
          className="mr-2"
          disabled={isLoading}
        />
        <label htmlFor="isPublic" className="text-sm font-medium">Make this quiz public</label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Creating...' : 'Create Quiz'}
      </button>
    </form>
  );
}; 