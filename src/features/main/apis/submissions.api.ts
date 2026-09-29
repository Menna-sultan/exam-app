import type {
  Submission,
  SubmissionAnalytics,
  SubmitExamInput,
  SubmitExamResponse,
} from "../types/submissions";

export type { Submission, SubmissionAnalytics, SubmitExamInput, SubmitExamResponse };

const API_BASE = process.env.NEXT_PUBLIC_API!;

export async function submitExam(
  token: string,
  input: SubmitExamInput
): Promise<SubmitExamResponse> {
  const response = await fetch(`${API_BASE}/submissions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? "Failed to submit exam");
  }

  return body.payload;
}