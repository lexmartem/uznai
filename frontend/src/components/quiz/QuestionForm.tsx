import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateQuestionRequest, QuestionType } from '../../types/quiz';
import { useEffect } from 'react';

const questionSchema = z.object({
  questionText: z.string().min(1, 'Question text is required').max(500, 'Question text is too long'),
  questionType: z.enum([
    'MULTIPLE_CHOICE_SINGLE',
    'MULTIPLE_CHOICE_MULTIPLE',
    'TRUE_FALSE',
    'SHORT_ANSWER',
    'IMAGE',
    'CODE'
  ] as const),
  orderIndex: z.number().min(0),
  imageUrl: z.string().url('Invalid URL').nullable().optional(),
  codeSnippet: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.questionType === 'IMAGE' && (!data.imageUrl || data.imageUrl === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Image URL is required for image questions',
      path: ['imageUrl'],
    });
  }
  if (data.questionType === 'CODE' && (!data.codeSnippet || data.codeSnippet === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Code snippet is required for code questions',
      path: ['codeSnippet'],
    });
  }
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  initialData?: Partial<QuestionFormData>;
  onSubmit: (data: QuestionFormData) => void;
  isLoading?: boolean;
}

export const QuestionForm = ({ initialData, onSubmit, isLoading }: QuestionFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: initialData || {
      questionText: '',
      questionType: 'MULTIPLE_CHOICE_SINGLE',
      orderIndex: 0,
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
  }, [errors]);

  const questionType = watch('questionType');

  return (
    <form onSubmit={handleSubmit((data) => { console.log('QuestionForm onSubmit', data); onSubmit(data); })} className="space-y-4">
      <div>
        <label htmlFor="questionText" className="block text-sm font-medium text-gray-700">
          Question Text
        </label>
        <textarea
          id="questionText"
          {...register('questionText')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.questionText && (
          <p className="mt-1 text-sm text-red-600">{errors.questionText.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="questionType" className="block text-sm font-medium text-gray-700">
          Question Type
        </label>
        <select
          id="questionType"
          {...register('questionType')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="MULTIPLE_CHOICE_SINGLE">Multiple Choice (Single Answer)</option>
          <option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice (Multiple Answers)</option>
          <option value="TRUE_FALSE">True/False</option>
          <option value="SHORT_ANSWER">Short Answer</option>
          <option value="IMAGE">Image</option>
          <option value="CODE">Code</option>
        </select>
        {errors.questionType && (
          <p className="mt-1 text-sm text-red-600">{errors.questionType.message}</p>
        )}
      </div>

      {questionType === 'IMAGE' && (
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

      {questionType === 'CODE' && (
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
          {isLoading ? 'Saving...' : 'Save Question'}
        </button>
      </div>
    </form>
  );
}; 