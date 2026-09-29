import { IErrorResponse } from "@/shared/types/api";

export const Responses = {
  unauthorized: {
    status: false,
    code: 401,
    message: "Unauthorized.",
  } as IErrorResponse,
};