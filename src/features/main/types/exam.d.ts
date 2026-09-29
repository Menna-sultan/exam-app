export type Exam = {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: number;
  questionsCount: number;
  diplomaId: string;
  diploma: {
    id: string;
    title: string;
  };
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ExamInput = {
  title: string;
  description: string;
  image: string;
  duration: number;
  diplomaId: string;
};

export type ExamsParams = {
  diplomaId?: string;
  immutable?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "questions";
  sortOrder?: "asc" | "desc";
  search?: string;
};