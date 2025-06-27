import { QuestionsClient } from '@/app/quizzes/[quizId]/questions/QuestionsClient';

interface QuestionsPageProps {
  params: {
    quizId: string;
  };
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
  const resolvedParams = await params;
  return <QuestionsClient quizId={resolvedParams.quizId} />;
} 