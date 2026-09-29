'use client'

import React from "react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import type { RegisterFormData } from "@/features/auth/types/register";
import { Eye, EyeOff } from "lucide-react";
type StepErrors = Partial<Record<keyof RegisterFormData, string>>;


type Props = {
  values: RegisterFormData;
  errors: StepErrors;
  onChange: (patch: Partial<RegisterFormData>) => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  generalError?: string;
};

export default function StepPassword({ values, errors, onChange, loading, onSubmit, generalError }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  return (
    <div className="bg-white ">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 mt-5">Create Account</h2>
      <div className="mt-2">
        <span className="font-mono text-blue-600 font-bold block text-lg mb-4">Create a strong password</span>
      <FieldGroup className="mt-2">
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
  <Input
    id="password"
    type={showPassword ? "text" : "password"}
      autoComplete="new-password"
            placeholder="Minimum 8 characters"
 value={values.password}
            aria-invalid={!!errors.password}
            onChange={(e) => onChange({ password: e.target.value })}
            disabled={loading}
    className="pr-10"
  />

  <button
    type="button"
    onClick={() => setShowPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
  >
{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
</div>
          {errors.password ? (
            <FieldError errors={[{ message: errors.password }]} />
          ) : (
            <p className="text-xs text-slate-500 font-sans mt-1">
              At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.
            </p>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmPassword}>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <div className="relative">
  <Input
    id="confirmPassword"
    type={showConfirmPassword ? "text" : "password"}
    autoComplete="new-password"
            placeholder="Re-enter password"
            value={values.confirmPassword}
            aria-invalid={!!errors.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            disabled={loading}
    className="pr-10"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword((prev) => !prev)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
  >
    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
</div>
          {errors.confirmPassword && (
            <FieldError errors={[{ message: errors.confirmPassword }]} />
          )}
        </Field>
      </FieldGroup>

      {loading && <div className="mt-4 h-10 w-full rounded-xl bg-gray-100" />}

      {generalError && (
        <p className="mt-4 text-sm text-red-600 font-mono text-center">{generalError}</p>
      )}

      <div className="flex items-center  mt-10 pt-2">
        <Button
          type="button"
          onClick={() => onSubmit()}
          disabled={loading}
          className="flex-1 bg-primary text-white border border-blue-600 font-medium hover:opacity-90 transition-all hover:text-white"
        >
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </div>
    
    </div>
    </div>
  );
}