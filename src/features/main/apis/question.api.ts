import type {
  Question,
  QuestionAnswer,
  QuestionAnswerInput,
  QuestionCreateInput,
  QuestionInput,
  QuestionListParams,
} from "../types/question";

export type { Question, QuestionAnswer, QuestionAnswerInput, QuestionInput, QuestionCreateInput, QuestionListParams };
export type QuestionDraftInput = QuestionInput;
export type ExamOption = { id: string; title: string };

const API_BASE = process.env.NEXT_PUBLIC_API!;


function getAuthHeaders(token: string) {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function parseResponse<T>(
  response: Response,
  fallbackMessage: string
): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? fallbackMessage);
  }

  return (body?.payload ?? body) as T;
}

export async function getExamOptions(
  token: string
): Promise<ExamOption[]> {
  const response = await fetch(`${API_BASE}/exams?limit=1000`, {
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ data: { id: string; title: string }[] }>(
    response,
    "Failed to load exam options"
  );

  return (body.data ?? []).map(({ id, title }) => ({ id, title }));
}

export async function getQuestionsByExam(
  token: string,
  examId: string,
  params: QuestionListParams = {}
): Promise<Question[]> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  const response = await fetch(
    `${API_BASE}/questions/exam/${examId}${query ? `?${query}` : ""}`,
    {
      headers: getAuthHeaders(token),
    }
  );

  const body = await parseResponse<{ questions: Question[] }>(
    response,
    "Failed to load questions"
  );

  return body.questions;
}

export async function createQuestion(
  token: string,
  examId: string,
  input: QuestionInput
): Promise<Question> {
  const response = await fetch(
    `${API_BASE}/questions/exam/${examId}`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(input),
    }
  );

  const body = await parseResponse<{ question: Question }>(
    response,
    "Failed to create question"
  );

  return body.question;
}

export async function createQuestionsBulk(
  token: string,
  examId: string,
  questions: QuestionInput[]
): Promise<{
  message: string;
  questions: Question[];
  count: number;
}> {
  const response = await fetch(
    `${API_BASE}/questions/exam/${examId}/bulk`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify({ questions }),
    }
  );

  return parseResponse<{
    message: string;
    questions: Question[];
    count: number;
  }>(response, "Failed to create questions");
}

export async function getQuestion(
  token: string,
  id: string
): Promise<Question> {
  const response = await fetch(`${API_BASE}/questions/${id}`, {
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ question: Question }>(
    response,
    "Failed to load question"
  );

  return body.question;
}

export async function updateQuestion(
  token: string,
  id: string,
  input: QuestionInput
): Promise<Question> {
  const response = await fetch(`${API_BASE}/questions/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ question: Question }>(
    response,
    "Failed to update question"
  );

  return body.question;
}

export async function deleteQuestion(
  token: string,
  id: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/questions/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  return parseResponse<{ message: string }>(
    response,
    "Failed to delete question"
  );
}

export async function createQuestionWithExamId(
  token: string,
  input: QuestionCreateInput
): Promise<Question> {
  const response = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ question: Question }>(
    response,
    "Failed to create question"
  );

  return body.question;
}