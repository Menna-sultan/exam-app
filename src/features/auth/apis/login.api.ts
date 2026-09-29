import { API_BASE, HEADERS } from "@/shared/constants/api.constant";
import { IApiResponse } from "@/shared/types/api";

import { LoginFields, LoginResponse } from "../types/auth";





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

