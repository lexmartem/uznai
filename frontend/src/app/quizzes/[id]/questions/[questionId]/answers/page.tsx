import { AnswersClient } from './AnswersClient';

interface AnswersPageProps {
  params: {
    id: string;
    questionId: string;
  };
}

export default function AnswersPage({ params }: AnswersPageProps) {
  return <AnswersClient quizId={params.id} questionId={params.questionId} />;
} 