import { API_BASE, HEADERS } from "@/shared/constants/api.constant";
import { IApiResponse } from "@/shared/types/api";

export type SendEmailVerificationBody = {
  email: string;
};

export type ConfirmEmailVerificationBody = {
  email: string;
  code: string;
};

export type SendEmailVerificationResponse = {
  email?: string;
};

export type ConfirmEmailVerificationResponse = {
  email?: string;
  verified?: boolean;
};

const safeParseJson = <T,>(text: string): T | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Only parse likely JSON.
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return null;

  try {
    return JSON.parse(trimmed) as T;
  } catch {
    return null;
  }
};

export const sendEmailVerification = async (
  body: SendEmailVerificationBody
): Promise<IApiResponse<SendEmailVerificationResponse>> => {
  const response = await fetch(`${API_BASE}/auth/send-email-verification`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<IApiResponse<SendEmailVerificationResponse>>(text);

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

export type RegisterBody = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
};

export type RegisterResponse = {
  user: {
    id: string;
    username: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    profilePhoto: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
};

export const confirmEmailVerification = async (
  body: ConfirmEmailVerificationBody
): Promise<IApiResponse<ConfirmEmailVerificationResponse>> => {
  const response = await fetch(
    `${API_BASE}/auth/confirm-email-verification`,
    {
      method: "POST",
      headers: {
        ...HEADERS.jsonBody,
      },
      body: JSON.stringify(body),
    }
  );

  const text = await response.text();
  const parsed = safeParseJson<IApiResponse<ConfirmEmailVerificationResponse>>(text);

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
): Promise<IApiResponse<RegisterResponse>> => {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      ...HEADERS.jsonBody,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = safeParseJson<IApiResponse<RegisterResponse>>(text);

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

