'use client'

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // تأكدي من تثبيت lucide-react
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/components/ui/field";

interface Props {
  values: any;
  setValues: any;
  onReset: () => void;
  errors: any;
  isLoading: boolean;
}

export function ResetPasswordStep({ values, setValues, onReset, errors, isLoading }: Props) {
  // حالة إظهار وإخفاء كلمة السر
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="bg-white animate-in fade-in duration-500">
      {/* العناوين كما في المثال الذي أرفقته */}
     <h3 className="font-mono text-gray-500 text-sm mb-10">
     Create a new strong password for your account.
      </h3>
      <div className="mt-2">
     

        <FieldGroup className="mt-10">
          {/* الحقل الأول: كلمة السر الجديدة */}
          <Field data-invalid={!!errors.newPassword}>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={values.newPassword}
                onChange={(e) => setValues({ ...values, newPassword: e.target.value })}
                disabled={isLoading}
                className="pr-10 w-full px-3 py-3 border border-slate-200 rounded-lg"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <FieldError errors={[{ message: errors.newPassword }]} />
            )}
          </Field>

          {/* الحقل الثاني: تأكيد كلمة السر */}
          <Field data-invalid={!!errors.confirmPassword} className="mt-8">
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={values.confirmPassword}
                onChange={(e) => setValues({ ...values, confirmPassword: e.target.value })}
                disabled={isLoading}
                className="pr-10 w-full px-3 py-3 border border-red-800 rounded-lg"
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

        {/* عرض خطأ عام من السيرفر إذا وجد */}
        {errors.form && (
          <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs font-mono">
            {errors.form}
          </div>
        )}

        {/* الزر كما في التصميم المطلوب */}
        <div className="flex items-center mt-12 pt-2">
          <Button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="flex-1 mt-10 bg-blue-600 text-white border border-blue-600 font-medium hover:opacity-90 transition-all"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}