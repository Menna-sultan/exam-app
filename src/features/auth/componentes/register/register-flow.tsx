'use client'

import  { useMemo, useState } from "react";

import {
  registerEmailSchema,
  registerOtpSchema,
  registerPasswordSchema,
  registerProfileSchema,
} from "@/features/auth/schemes/register.schema";
import {
  confirmEmailVerification,
  sendEmailVerification,
} from "@/features/auth/apis/register.api";

import useRegister from "@/features/auth/hooks/useRegister";



import StepEmail from "@/features/auth/componentes/steps/step-1-email";
import StepOtp from "@/features/auth/componentes/steps/step-2-otp";
import StepProfile from "@/features/auth/componentes/steps/step-3-profile";
import StepPassword from "@/features/auth/componentes/steps/step-4-password";
import OnboardingSteps from "@/features/auth/componentes/OnboardingSteps";
import { RegisterFormData, registerInitialValues, RegisterStepId } from "../../types/register";

type StepErrors = Partial<Record<keyof RegisterFormData, string>>;

function pickStepErrors(step: RegisterStepId, values: RegisterFormData): StepErrors {
  const res =
    step === 1
      ? registerEmailSchema.safeParse(values)
      : step === 2
        ? registerOtpSchema.safeParse(values)
        : step === 3
          ? registerProfileSchema.safeParse(values)
          : registerPasswordSchema.safeParse(values);

  if (res.success) return {};

  return res.error.issues.reduce((acc, issue) => {
    const key = issue.path[0] as keyof RegisterFormData | undefined;
    if (!key) return acc;
    return { ...acc, [key]: issue.message };
  }, {} as StepErrors);
}


function mapBackendError(message: string): { step?: RegisterStepId; field?: keyof RegisterFormData } {
  const normalized = message.toLowerCase();

  if (normalized.includes("username")) return { step: 3, field: "username" };
  if (normalized.includes("phone")) return { step: 3, field: "phone" };
  if (normalized.includes("first name") || normalized.includes("firstname")) return { step: 3, field: "firstName" };
  if (normalized.includes("last name") || normalized.includes("lastname")) return { step: 3, field: "lastName" };
  if (normalized.includes("email") || normalized.includes("verify")) return { step: 1, field: "email" };
  if (normalized.includes("password")) return { step: 4, field: "password" };

  return {};
}

export default function RegisterFlow() {
  const [step, setStep] = useState<RegisterStepId>(1);
  const [values, setValues] = useState<RegisterFormData>(registerInitialValues);
  const [errors, setErrors] = useState<StepErrors>({});
  const [generalError, setGeneralError] = useState<string>("");
  const [isSubmittingStep, setIsSubmittingStep] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const registerMutation = useRegister();

  const isLast = step === 4;
  const loading = isSubmittingStep || registerMutation.isPending;

  const handleResendOtp = async (): Promise<boolean> => {
    try {
      const res = await sendEmailVerification({ email: values.email });
      if (!res.status) {
        setErrors((prev) => ({ ...prev, otp: res.message || "Failed to resend code" }));
        return false;
      }
      return true;
    } catch (e) {
      setErrors((prev) => ({
        ...prev,
        otp: e instanceof Error ? e.message : "Failed to resend code",
      }));
      return false;
    }
  };

  const stepComponent = useMemo(() => {
    const common = {
      values,
      errors,
      onChange: (patch: Partial<RegisterFormData>) => {
        setValues((prev) => ({ ...prev, ...patch }));
      },
      loading,
      onNext: () => {
        void handleNext();
      },
      onSubmit: () => {
        void handleSubmit();
      },
      onBack: () => {
        handleBack();
      },
    };

    if (step === 1) return <StepEmail {...common} />;
    if (step === 2)
      return (
        <StepOtp
          {...common}
          onEditEmail={() => {
            setStep(1);
            setErrors({});
          }}
          onResendOtp={handleResendOtp}
        />
      );
    if (step === 3) return <StepProfile {...common} />;
    return <StepPassword {...common} generalError={generalError} />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, loading, step, values, generalError]);

  const handleNext = async () => {
    const nextStep = (step + 1) as RegisterStepId;

    // gate: steps 3+ require email verification
    if (step >= 3 && !isEmailVerified) {
      setStep(2);
      setErrors({});
      return;
    }

    const stepErrs = pickStepErrors(step, values);

    setErrors(stepErrs);
    if (Object.keys(stepErrs).length > 0) {
      return;
    }

    if (step === 1) {
      setIsSubmittingStep(true);
      try {
        const res = await sendEmailVerification({ email: values.email });

        if (!res.status) {
          setErrors({ email: res.message || "Failed to send email verification" });
          return;
        }

        if (typeof window !== "undefined") {
          window.localStorage.setItem(
            "register-otp-resend-end-time",
            (Date.now() + 60 * 1000).toString()
          );
        }

        setStep(2);
        setErrors({});
      } catch (e) {
        setErrors({ email: e instanceof Error ? e.message : "Failed to send email verification" });
      } finally {
        setIsSubmittingStep(false);
      }
      return;
    }

    if (step === 2) {
      setIsSubmittingStep(true);
      try {
        const res = await confirmEmailVerification({ email: values.email, code: values.otp });
        if (!res.status) {
          setErrors({ otp: res.message || "Invalid OTP" });
          return;
        }
        setIsEmailVerified(true);
        setStep(3);
        setErrors({});
      } catch (e) {
        setErrors({ otp: e instanceof Error ? e.message : "Invalid OTP" });
      } finally {
        setIsSubmittingStep(false);
      }
      return;
    }

    if (step === 3) {
      if (!isEmailVerified) {
        setStep(2);
        return;
      }
      setStep(nextStep);
      setErrors({});
      return;
    }

    if (!isLast) {
      setStep(nextStep);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (step !== 4) return;

    const stepErrs = pickStepErrors(4, values);
    setErrors(stepErrs);
    if (Object.keys(stepErrs).length > 0) return;

    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const username = values.username.trim();

    setGeneralError("");

    registerMutation.mutate(
      {
        username,
        email: values.email.trim().toLowerCase(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        firstName,
        lastName,
        phone: values.phone.trim().replace(/\s+/g, ""),
      },
      {
        onSuccess: () => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("register-otp-resend-end-time");
          }
          window.location.href = "/login";
        },
        onError: (e) => {
          const message = e instanceof Error ? e.message : "Registration failed";
          const { step: targetStep, field } = mapBackendError(message);

          if (field) {
            setErrors({ [field]: message } as StepErrors);
          }

          if (targetStep && targetStep !== 4) {
            setStep(targetStep);
            return;
          }

          setGeneralError(message);
        },
      }
    );
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((s) => (s - 1) as RegisterStepId);
    setErrors({});
  };

  return (
    <div className="w-full flex flex-col gap-14">
      <OnboardingSteps currentStep={step} />

      {stepComponent}
    </div>
  );
}