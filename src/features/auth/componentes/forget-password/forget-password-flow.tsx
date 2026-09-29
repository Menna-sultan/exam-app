'use client'

import React, { useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EmailStep } from "./steps/email-step.tsx"; 
import { OtpStep } from "./steps/otp-step";
import { ResetPasswordStep } from "./steps/reset-password-step";
import { emailSchema, otpSchema, resetPasswordSchema } from "@/features/auth/schemes/forgetpassword.schema";
import { forgotPassword, resetPassword } from "../../apis/forget-password.api";
import { LoadingState } from "@/shared/components/ui/loading-state";

// سنستخدم مكون داخلي للتعامل مع searchParams لضمان عمل Suspense في Next.js
function ForgetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");

  const [step, setStep] = useState<1 | 2 | 3>(tokenFromUrl ? 3 : 1);
  const [isPending, startTransition] = useTransition();
  
  const [values, setValues] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
    token: tokenFromUrl || "" 
  });
  
  const [errors, setErrors] = useState<any>({});

  // الخطوة 1: إرسال الإيميل
  const handleSendResetLink = async () => {
    const result = emailSchema.safeParse({ email: values.email });
    if (!result.success) {
      setErrors({ email: result.error.flatten().fieldErrors.email?.[0] });
      return;
    }

    startTransition(async () => {
      setErrors({});
      const res = await forgotPassword({
        email: values.email,
        redirectUrl: "http://localhost:3000/reset-password",
      });

      if (res.status) {
        setStep(2);
      } else {
        setErrors({ form: res.message }); 
      }
    });
  };

  // الخطوة 2: التحقق من الـ OTP (كود يدوي)
  const handleVerifyOtp = () => {
    const result = otpSchema.safeParse({ otp: values.otp });
    if (!result.success) {
      setErrors({ otp: result.error.flatten().fieldErrors.otp?.[0] });
      return;
    }

    setValues(prev => ({ ...prev, token: values.otp })); // نعتبر الكود هو التوكن
    setStep(3);
    setErrors({});
  };

  // الخطوة 3: تعيين كلمة السر الجديدة
  const handleResetPassword = async () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        newPassword: fieldErrors.newPassword?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
      });
      return;
    }

    startTransition(async () => {
      setErrors({});
      const res = await resetPassword({
        token: values.token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });

      if (res.status) {
        alert("Password reset successfully!");
        window.location.href = "/login";
      } else {
        setErrors({ form: res.message });
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 leading-tight">
        {step === 1 && "Forgot Password"}
        {step === 2 && "Verification Sent"}
        {step === 3 && "Create a New Password"}
      </h2>

      {step === 1 && (
        <EmailStep 
          email={values.email} 
          setEmail={(v: any) => setValues({...values, email: v})} 
          onNext={handleSendResetLink} 
          isLoading={isPending}
          error={errors.email || errors.form} 
        />
      )}

      {step === 2 && (
        <OtpStep 
          email={values.email}
          onBack={() => setStep(1)} 
          otp={values.otp} 
          setOtp={(v) => setValues({...values, otp: v})} 
          onVerify={handleVerifyOtp} 
          isLoading={isPending}
          error={errors.otp || errors.form}
        />
      )}

      {step === 3 && (
        <ResetPasswordStep 
          values={values} 
          setValues={setValues} 
          onReset={handleResetPassword} 
          errors={errors} 
          isLoading={isPending}
        />
      )}
    </div>
  );
}

// المكون الرئيسي المغلف بـ Suspense (مهم جداً في Next.js عند استخدام useSearchParams)
export default function ForgetPasswordFlow() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ForgetPasswordContent />
    </Suspense>
  );
}