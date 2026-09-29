import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export const otpSchema = z.object({
  otp: z.string().min(1, "Verification code is required").min(4, "Code must be at least 4 digits"),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});