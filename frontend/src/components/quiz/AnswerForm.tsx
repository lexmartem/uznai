import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateAnswerRequest } from '../../types/quiz';

const answerSchema = z.object({
  answerText: z.string().min(1, 'Answer text is required').max(500, 'Answer text is too long'),
  isCorrect: z.boolean().default(false),
  orderIndex: z.number().min(0),
  imageUrl: z.string().url().optional(),
  codeSnippet: z.string().optional(),
});

type AnswerFormData = z.infer<typeof answerSchema>;

interface AnswerFormProps {
  initialData?: Partial<AnswerFormData>;
  onSubmit: (data: AnswerFormData) => void;
  isLoading?: boolean;
}

export const AnswerForm = ({ initialData, onSubmit, isLoading }: AnswerFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AnswerFormData>({
    resolver: zodResolver(answerSchema),
    defaultValues: initialData || {
      answerText: '',
      isCorrect: false,
      orderIndex: 0,
    },
  });

  const hasMedia = watch('imageUrl') || watch('codeSnippet');

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
          id="isCorrect"
          {...register('isCorrect')}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="isCorrect" className="ml-2 block text-sm text-gray-900">
          This is the correct answer
        </label>
      </div>

      {!hasMedia && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => register('imageUrl').onChange({ target: { value: '' } })}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Image
          </button>
          <button
            type="button"
            onClick={() => register('codeSnippet').onChange({ target: { value: '' } })}
            className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add Code Snippet
          </button>
        </div>
      )}

      {watch('imageUrl') !== undefined && (
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            {...register('imageUrl')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.imageUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
        </div>
      )}

      {watch('codeSnippet') !== undefined && (
        <div>
          <label htmlFor="codeSnippet" className="block text-sm font-medium text-gray-700">
            Code Snippet
          </label>
          <textarea
            id="codeSnippet"
            {...register('codeSnippet')}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
          />
          {errors.codeSnippet && (
            <p className="mt-1 text-sm text-red-600">{errors.codeSnippet.message}</p>
          )}
        </div>
      )}

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