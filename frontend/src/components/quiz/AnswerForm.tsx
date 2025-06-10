import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateAnswerRequest } from '../../types/quiz';
import { useEffect } from 'react';

const answerSchema = z.object({
  answerText: z.string().min(1, 'Answer text is required').max(500, 'Answer text is too long'),
  correct: z.boolean(),
  orderIndex: z.number().min(0),
});

type AnswerFormData = CreateAnswerRequest;

interface AnswerFormProps {
  initialData?: Partial<AnswerFormData>;
  onSubmit: (data: AnswerFormData) => void;
  isLoading?: boolean;
}

export const AnswerForm = ({ initialData, onSubmit, isLoading }: AnswerFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: initialData || {
      answerText: '',
      correct: false,
      orderIndex: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="answerText" className="block text-sm font-medium text-gray-700">
          Answer Text
        </label>
        <textarea
          id="answerText"
          {...register('answerText')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.answerText && (
          <p className="mt-1 text-sm text-red-600">{errors.answerText.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="correct"
          {...register('correct')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="correct" className="ml-2 block text-sm text-gray-900">
          This is the correct answer
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Answer'}
        </button>
      </div>
    </form>
  );
}; 