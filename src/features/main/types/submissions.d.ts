
export type Submission = {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  exam: {
    id: string;
    title: string;
    duration: number;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  startedAt: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type SubmissionAnswer = {
  questionId: string;
  answerId: string;
};

export type SubmissionAnalytics = {
  questionId: string;
  questionText: string;
  selectedAnswer: unknown;
  isCorrect: boolean;
  correctAnswer: unknown;
};

export type SubmitExamInput = {
  examId: string;
  answers: SubmissionAnswer[];
  startedAt: string;
};

export type SubmitExamResponse = {
  submission: Submission;
  analytics: SubmissionAnalytics[];
};



