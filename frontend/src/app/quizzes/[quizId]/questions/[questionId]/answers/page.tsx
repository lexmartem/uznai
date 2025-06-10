import { AnswersClient } from './AnswersClient';

interface AnswersPageProps {
  params: {
    quizId: string;
    questionId: string;
  };
}

export default function AnswersPage({ params }: AnswersPageProps) {
  return <AnswersClient quizId={params.quizId} questionId={params.questionId} />;
} 