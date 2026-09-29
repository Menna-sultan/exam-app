export type QuestionAnswer = {
  id?: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  text: string;
  examId: string;
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
  answers: QuestionAnswer[];
  exam: {
    id: string;
    title: string;
  };
};

export type QuestionAnswerInput = {
  text: string;
  isCorrect: boolean;
};

export type QuestionInput = {
  text: string;
  answers: QuestionAnswerInput[];
};

export type QuestionCreateInput = QuestionInput & {
  examId: string;
};

export type QuestionListParams = {
  sortBy?: "title" | "createdAt";
  sortOrder?: "asc" | "desc";
  immutable?: boolean;
  search?: string;
};
