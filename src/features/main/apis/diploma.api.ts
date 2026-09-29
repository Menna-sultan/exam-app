import type {
  Diploma,
  DiplomaInput,
  DiplomaListOptions,
  PaginatedDiplomas,
} from "../types/diploma";

export type { Diploma, DiplomaInput, DiplomaListOptions, PaginatedDiplomas };

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

  return body.payload as T;
}

export async function getDiplomas(
  token: string,
  filters: DiplomaListOptions = {}
): Promise<PaginatedDiplomas> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();

  const response = await fetch(
    `${API_BASE}/diplomas${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  return parseResponse<PaginatedDiplomas>(
    response,
    "Failed to load diplomas"
  );
}

export async function getDiploma(
  token: string,
  id: string
): Promise<Diploma> {
  const response = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ diploma: Diploma }>(
    response,
    "Failed to load diploma"
  );

  return body.diploma;
}

export async function createDiploma(
  token: string,
  input: DiplomaInput
): Promise<Diploma> {
  const response = await fetch(`${API_BASE}/diplomas`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ diploma: Diploma }>(
    response,
    "Failed to create diploma"
  );

  return body.diploma;
}

export async function updateDiploma(
  token: string,
  id: string,
  input: DiplomaInput
): Promise<Diploma> {
  const response = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ diploma: Diploma }>(
    response,
    "Failed to update diploma"
  );

  return body.diploma;
}

export async function deleteDiploma(
  token: string,
  id: string
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/diplomas/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  return parseResponse<{ message: string }>(
    response,
    "Failed to delete diploma"
  );
}