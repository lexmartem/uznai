import { useQuiz, useQuizzes } from '../../../hooks/useQuizzes';
import { useQuestions } from '../../../hooks/useQuestions';
import { QuestionForm } from '../../../components/quiz/QuestionForm';
import { AnswerForm } from '../../../components/quiz/AnswerForm';
import { useAnswers } from '../../../hooks/useAnswers';
import { useRouter } from 'next/navigation';

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter();
  const { quiz, isLoading: isLoadingQuiz, error: quizError } = useQuiz(params.id);
  const { questions, createQuestion, isLoading: isLoadingQuestions } = useQuestions(params.id);
  const { createAnswer, isCreating: isLoadingAnswer } = useAnswers('');

  if (quizError) {
    return (
      <div className="text-center">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{quizError.message}</p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/quizzes')}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (isLoadingQuiz) {
    return (
      <div className="animate-pulse space-y-4" role="presentation">
        <div className="h-8 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-24 rounded bg-gray-200" />
      </div>
    );
  }

  if (!quiz) {
    return null;
  }

  const handleCreateQuestion = async (data: any) => {
    const question = await createQuestion({
      ...data,
      orderIndex: questions.length,
    });
    return question;
  };

  const handleCreateAnswer = async (questionId: string, data: any) => {
    const answer = await createAnswer({
      ...data,
      orderIndex: 0, // This should be calculated based on existing answers
    });
    return answer;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
        <p className="mt-2 text-gray-500">{quiz.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Questions</h2>
        {questions.map((question) => (
          <div key={question.id} className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-base font-medium text-gray-900">{question.questionText}</h3>
            {question.imageUrl && (
              <img
                src={question.imageUrl}
                alt="Question image"
                className="mt-2 max-h-48 rounded-lg"
              />
            )}
            {question.codeSnippet && (
              <pre className="mt-2 rounded-lg bg-gray-100 p-4 font-mono text-sm">
                {question.codeSnippet}
              </pre>
            )}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Answers</h4>
              <div className="mt-2 space-y-2">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`rounded-lg border p-2 ${
                      answer.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <p className="text-sm text-gray-900">{answer.answerText}</p>
                    {answer.imageUrl && (
                      <img
                        src={answer.imageUrl}
                        alt="Answer image"
                        className="mt-2 max-h-32 rounded-lg"
                      />
                    )}
                    {answer.codeSnippet && (
                      <pre className="mt-2 rounded-lg bg-gray-100 p-2 font-mono text-xs">
                        {answer.codeSnippet}
                      </pre>
                    )}
                  </div>
                ))}
                <AnswerForm
                  onSubmit={(data) => handleCreateAnswer(question.id, data)}
                  isLoading={isLoadingAnswer}
                />
              </div>
            </div>
          </div>
        ))}
        <QuestionForm
          onSubmit={handleCreateQuestion}
          isLoading={isLoadingQuestions}
        />
      </div>
    </div>
  );
} 