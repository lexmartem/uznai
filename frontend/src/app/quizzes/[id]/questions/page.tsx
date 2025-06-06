import { QuestionsClient } from './QuestionsClient';

interface QuestionsPageProps {
  params: {
    id: string;
  };
}

export default function QuestionsPage({ params }: QuestionsPageProps) {
  return <QuestionsClient quizId={params.id} />;
} 