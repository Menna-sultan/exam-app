'use client'

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { RegisterFormData } from "@/features/auth/types/register.types";


type StepErrors = Partial<Record<keyof RegisterFormData, string>>;

type Props = {
  values: RegisterFormData;
  errors: StepErrors;
  onChange: (patch: Partial<RegisterFormData>) => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
};

export default function StepEmail({ values, errors, onChange, loading, onNext }: Props) {
  const searchParams = useSearchParams();
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchParams?.get("focus") === "email") {
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [searchParams]);

  return (
    <div className="bg-white ">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
        Create Account
      </h2>

      <FieldGroup className="mt-6">
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            inputMode="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            ref={emailRef}
            value={values.email}
            aria-invalid={!!errors.email}
            onChange={(e) => onChange({ email: e.target.value })}
            disabled={loading}
          />
          {errors.email && <FieldError errors={[{ message: errors.email }]} />}
        </Field>
      </FieldGroup>

      {loading && <div className="mt-4 h-10 w-full rounded-xl bg-gray-100" />}

      <div className="mt-10">
        <Button
          type="button"
          onClick={() => onNext()}
          disabled={loading}
          className="w-full  py-4 px-4 bg-blue-50 text-grey-800 border border-blue-600 font-medium hover:opacity-90 transition-all hover:text-white"
        >
          {loading ? "Sending code…" : "Next"}
        </Button>
     </div>




        
       <div className="pt-4 text-center mt-10 "> 
      <p className="text-sm text-gray-500 text-center font-sans mt-9">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 font-medium">
          Login
        </Link>
      </p>
        </div>

       

      {/* <p className="text-xs text-gray-500 mt-3">
        We’ll send a one-time OTP to verify your email.
      </p> */}
    </div>
  );
}