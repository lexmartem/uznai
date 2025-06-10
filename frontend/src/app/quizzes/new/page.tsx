import { NewQuizClient } from './NewQuizClient';

export default function NewQuizPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
      <p className="text-gray-600 mb-8">
        Create a new quiz by filling out the form below. You can add questions and answers after creating the quiz.
      </p>
      <NewQuizClient />
    </div>
  );
} 