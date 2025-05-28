import { QuizDetailClient } from './QuizDetailClient';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  return <QuizDetailClient quizId={params.id} />;
} 