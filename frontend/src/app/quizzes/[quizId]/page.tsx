import { QuizDetailClient } from '../[quizId]/QuizDetailClient';

interface QuizPageProps {
  params: {
    quizId: string;
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { quizId } = await params;
  return <QuizDetailClient quizId={quizId} />;
} 