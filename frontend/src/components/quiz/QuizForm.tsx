import React, { useEffect, useState } from 'react';
import { useQuizCollaboration } from '@/hooks/useQuizCollaboration';
import { UserPresence } from './UserPresence';
import { QuizChat } from './QuizChat';
import { ChangeType, QuizData } from '@/types/quiz';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateQuizRequest } from '../../types/quiz';

const quizSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(500, 'Description is too long'),
  isPublic: z.boolean(),
  collaborators: z.array(z.string()),
});

type QuizFormData = CreateQuizRequest;

interface QuizFormProps {
  quizId: string;
  initialData?: Partial<QuizData>;
  onSave?: (data: QuizData) => void;
}

export const QuizForm: React.FC<QuizFormProps> = ({ quizId, initialData, onSave }) => {
  const [quizData, setQuizData] = useState<QuizData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    isPublic: initialData?.isPublic || false,
    questions: initialData?.questions || [],
    version: initialData?.version || 0
  });

  const { activeUsers, isConnected, sendChange } = useQuizCollaboration({
    quizId,
    onQuizUpdate: (data) => {
      // Handle real-time updates
      if (data.type === 'QUIZ_UPDATED') {
        setQuizData(prev => ({
          ...prev,
          ...data.changes,
          version: data.version
        }));
      }
    }
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setQuizData(prev => ({ ...prev, title: newTitle }));
    sendChange(ChangeType.QUIZ_UPDATED, { title: newTitle }, quizData.version);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setQuizData(prev => ({ ...prev, description: newDescription }));
    sendChange(ChangeType.QUIZ_UPDATED, { description: newDescription }, quizData.version);
  };

  const handlePublicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIsPublic = e.target.checked;
    setQuizData(prev => ({ ...prev, isPublic: newIsPublic }));
    sendChange(ChangeType.QUIZ_UPDATED, { isPublic: newIsPublic }, quizData.version);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Quiz</h2>
        <UserPresence users={activeUsers} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={quizData.title}
              onChange={handleTitleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={quizData.description}
              onChange={handleDescriptionChange}
              className="w-full p-2 border rounded"
              rows={4}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={quizData.isPublic}
              onChange={handlePublicChange}
              className="mr-2"
            />
            <label className="text-sm font-medium">Make this quiz public</label>
          </div>

          {/* Question list and management components */}
        </div>

        <div className="md:col-span-1">
          <QuizChat quizId={quizId} />
        </div>
      </div>
    </div>
  );
}; 