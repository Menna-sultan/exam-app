import { API_BASE, HEADERS } from "@/shared/constants/api.constant";
import { IApiResponse } from "@/shared/types/api";

// --- Types ---

export type ForgotPasswordBody = {
  email: string;
  redirectUrl: string;
};

export type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
};

export type ResetPasswordBody = {
  token: string;
  newPassword: string;
  confirmPassword: string;
};

export type ResetPasswordResponse = {
  message: string;
};

// --- Helpers ---

const safeParseJson = <T,>(text: string): T | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return null;
  }
};

// --- API Functions ---

export const forgotPassword = async (
  body: ForgotPasswordBody
): Promise<IApiResponse<ForgotPasswordResponse>> => {
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<IApiResponse<ForgotPasswordResponse>>(text);

  if (parsed) return parsed;

  if (!response.ok) {
    return {
      status: false,
      message: text || "Failed to request password reset",
      code: response.status,
    };
  }

  return {
    status: false,
    message: text || "Unexpected response",
    code: response.status,
  };
};

export const resetPassword = async (
  body: ResetPasswordBody
): Promise<IApiResponse<ResetPasswordResponse>> => {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<IApiResponse<ResetPasswordResponse>>(text);

  if (parsed) return parsed;

  if (!response.ok) {
    return {
      status: false,
      message: text || "Failed to reset password",
      code: response.status,
    };
  }

  return {
    status: false,
    message: text || "Unexpected response",
    code: response.status,
  };
};