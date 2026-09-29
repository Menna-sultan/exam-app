import type { User } from "./user";

export type RegisterStepId = 1 | 2 | 3 | 4;

export type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  otp: string;
};

export const registerInitialValues: RegisterFormData = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phone: "",
  otp: "",
};

export type RegisterStepMeta = {
  step: RegisterStepId;
  title: string;
  description?: string;
};

export type RegisterOtpData = {
  otp: string;
};

export type SendEmailVerificationBody = {
  email: string;
};

export type SendEmailVerificationResponse = {
  email?: string;
};

export type ConfirmEmailVerificationBody = {
  email: string;
  code: string;
};

export type ConfirmEmailVerificationResponse = {
  email?: string;
  verified?: boolean;
};

export type RegisterBody = Omit<RegisterFormData, "otp">;

export type RegisterResponse = {
  user: User;
  token: string;
};
