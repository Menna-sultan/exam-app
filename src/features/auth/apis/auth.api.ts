import { API_BASE, HEADERS } from "@/shared/constants/api.constant";
import { IApiResponse } from "@/shared/types/api";
import {
  ConfirmEmailVerificationBody,
  RegisterBody,
  RegisterResponse,
  SendEmailVerificationBody,
  SendEmailVerificationResponse,
} from "../apis/register.api";
import { LoginFields, LoginResponse } from "../types/auth";
import type { IApiResponse as ApiResponse } from "@/shared/types/api";


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

export const login = async (credentials: LoginFields) => {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(credentials),
  });

  const payload: IApiResponse<LoginResponse> = await response.json();

  if (!response.ok) {
    console.error("Login API error:", response.status, payload);
    throw new Error(payload.message || "Login failed");
  }

  console.info("Login API response:", payload);

  return payload;
};

export const sendEmailVerification = async (
  body: SendEmailVerificationBody
): Promise<ApiResponse<SendEmailVerificationResponse>> => {
  const response = await fetch(`${API_BASE}/auth/send-email-verification`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<ApiResponse<SendEmailVerificationResponse>>(text);

  if (parsed) return parsed;

  if (!response.ok) {
    return {
      status: false,
      message: text || "Failed to send email verification",
      code: response.status,
    };
  }

  return {
    status: false,
    message: text || "Unexpected response",
    code: response.status,
  };
};

export const confirmEmailVerification = async (
  body: ConfirmEmailVerificationBody
): Promise<ApiResponse<{ email?: string; verified?: boolean }>> => {
  const response = await fetch(`${API_BASE}/auth/confirm-email-verification`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<ApiResponse<{ email?: string; verified?: boolean }>>(text);

  if (parsed) return parsed;

  if (!response.ok) {
    return {
      status: false,
      message: text || "Invalid OTP",
      code: response.status,
    };
  }

  return {
    status: false,
    message: text || "Unexpected response",
    code: response.status,
  };
};

export const register = async (
  body: RegisterBody
): Promise<ApiResponse<RegisterResponse>> => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<ApiResponse<RegisterResponse>>(text);

  if (parsed) return parsed;

  if (!response.ok) {
    return {
      status: false,
      message: text || "Registration failed",
      code: response.status,
    };
  }

  return {
    status: false,
    message: text || "Unexpected response",
    code: response.status,
  };
};
