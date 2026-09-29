import type { Paginated } from "@/features/dashboard/types/types";
import type { Question } from "../types/question";
import type { Exam, ExamInput, ExamsParams } from "../types/exam";

export type { Exam, ExamInput, ExamsParams };
export type DiplomaOption = { id: string; title: string };
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

export async function getDiplomaOptions(
  token: string
): Promise<DiplomaOption[]> {
  const response = await fetch(`${API_BASE}/diplomas?limit=1000`, {
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ data: { id: string; title: string }[] }>(
    response,
    "Failed to load diploma options"
  );

  return (body.data ?? []).map(({ id, title }) => ({ id, title }));
}

export async function getExamQuestions(
  token: string,
  examId: string
): Promise<Question[]> {
  const response = await fetch(`${API_BASE}/questions/exam/${examId}`, {
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ questions: Question[] }>(
    response,
    "Failed to load exam questions"
  );

  return body.questions;
}

export async function examInputFromForm(
  token: string,
  formData: FormData
): Promise<ExamInput> {
  const rawImage = formData.get("image");
  let imageUrl = "";

  if (rawImage instanceof File && rawImage.size > 0) {
    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: (() => {
        const form = new FormData();
        form.append("image", rawImage);
        return form;
      })(),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(body?.message ?? "Failed to upload exam image");
    }

    imageUrl = body?.url ?? "";
  } else if (typeof rawImage === "string") {
    imageUrl = rawImage;
  }

  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    image: imageUrl,
    duration: Number(formData.get("duration") ?? 0),
    diplomaId: String(formData.get("diplomaId") ?? ""),
  };
}

export async function getExams(
  token: string,
  params: ExamsParams = {}
): Promise<Paginated<Exam>> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();

  const response = await fetch(
    `${API_BASE}/exams${query ? `?${query}` : ""}`,
    {
      headers: getAuthHeaders(token),
    }
  );

  return parseResponse<Paginated<Exam>>(
    response,
    "Failed to load exams"
  );
}

export async function getExam(
  token: string,
  id: string
): Promise<Exam> {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ exam: Exam }>(
    response,
    "Failed to load exam"
  );

  return body.exam;
}

export async function createExam(
  token: string,
  input: ExamInput
): Promise<Exam> {
  const response = await fetch(`${API_BASE}/exams`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ exam: Exam }>(
    response,
    "Failed to create exam"
  );

  return body.exam;
}

export async function updateExam(
  token: string,
  id: string,
  input: ExamInput
): Promise<Exam> {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ exam: Exam }>(
    response,
    "Failed to update exam"
  );

  return body.exam;
}

export async function deleteExam(
  token: string,
  id: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/exams/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  return parseResponse<{ message: string }>(
    response,
    "Failed to delete exam"
  );
}