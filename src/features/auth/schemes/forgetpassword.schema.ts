import { z } from "zod";

// Schema للخطوة الأولى (Email)
export const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

// Schema للخطوة الثانية (OTP)
export const otpSchema = z.object({
  otp: z.string().min(1, "Verification code is required").min(4, "Code must be at least 4 digits"),
});

// Schema للخطوة الثالثة (Reset Password)
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // الخطأ سيظهر عند حقل تأكيد كلمة السر
});