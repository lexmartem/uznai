import { QuizDetailClient } from '../[quizId]/QuizDetailClient';

interface QuizPageProps {
  params: {
    quizId: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return <QuizDetailClient quizId={params.quizId} />;
} 