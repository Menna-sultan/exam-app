import type {
  ChangePasswordBody,
  IUserProfile,
  UpdateProfileBody,
} from "../types/users";



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

export async function getProfile(token: string): Promise<IUserProfile> {
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const body = await parseResponse<{ user: IUserProfile }>(
    response,
    "Failed to get profile"
  );

  return body.user ?? body;
}

export async function updateProfile(
  token: string,
  body: UpdateProfileBody
): Promise<IUserProfile> {
  const response = await fetch(`${API_BASE}/users/profile`, {
    method: "PATCH",
    headers: getAuthHeaders(token),
    body: JSON.stringify(body),
  });

  const data = await parseResponse<{ user: IUserProfile }>(
    response,
    "Failed to update profile"
  );

  return data.user;
}

export async function changePassword(
  token: string,
  body: ChangePasswordBody
): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/users/change-password`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(body),
  });

  return parseResponse<{ message: string }>(
    response,
    "Failed to change password"
  );
}

export async function requestEmailChange(
  token: string,
  newEmail: string
): Promise<{ message: string; code: string }> {
  const response = await fetch(`${API_BASE}/users/email/request`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ newEmail }),
  });

  return parseResponse<{ message: string; code: string }>(
    response,
    "Failed to request email change"
  );
}

export async function confirmEmailChange(
  token: string,
  code: string
): Promise<{ message: string; user: IUserProfile }> {
  const response = await fetch(`${API_BASE}/users/email/confirm`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify({ code }),
  });

  return parseResponse<{ message: string; user: IUserProfile }>(
    response,
    "Failed to confirm email change"
  );
}

export async function deleteAccount(token: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE}/users/account`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });

  return parseResponse<{ message: string }>(
    response,
    "Failed to delete account"
  );
}