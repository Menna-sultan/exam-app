import { IDocumentFields } from "./api";

export type ExamIconKey =
  | "html"
  | "css"
  | "js"
  | "react"
  | "angular"
  | "vue";

export interface IExam extends IDocumentFields {
  id: string;
  diplomaId: string;
  title: string;
  description: string;
  image: string | null;
  questionsCount: number;
  duration: number;
  diploma: {
    id: string;
    title: string;
  };
}

export interface IQuestionOption {
  id: string;
  label: string;
}

export interface IQuestion {
  id: string;
  prompt: string;
  options: IQuestionOption[];
}