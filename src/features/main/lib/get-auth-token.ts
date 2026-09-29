import { getSession } from "next-auth/react";

export type AuthToken = string;

export type RequestOptions = {
  token?: AuthToken;
};

export async function getAuthToken(token?: AuthToken): Promise<string> {
  const authToken = token ?? (await getSession())?.token;

  if (!authToken) {
    throw new Error("Authentication required");
  }

  return authToken;
}