import { QuestionsClient } from '@/app/quizzes/[quizId]/questions/QuestionsClient';

interface QuestionsPageProps {
  params: {
    quizId: string;
  };
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  return <QuestionsClient quizId={params.quizId} />;
} 