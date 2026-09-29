import { z } from "zod";

export const registerEmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const registerOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "Please enter the 6-digit verification code")
    .regex(/^\d{6}$/, "Please enter the 6-digit verification code"),
});

export const registerProfileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: z.string().trim().min(2, "Username is too short"),
  phone: z
    .string()
    .trim()
    .min(7, "Phone is too short")
    .max(20, "Phone is too long"),
});

export const registerPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[a-z]/, "Password must include a lowercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });