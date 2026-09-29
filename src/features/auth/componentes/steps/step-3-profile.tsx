'use client'

import React from "react"
import type { RegisterFormData } from "@/features/auth/types/register"
import { Input } from "@/shared/components/ui/input"
import { PhoneInput } from "@/shared/components/ui/phone-input";
import { Button } from "@/shared/components/ui/button";



type StepErrors = Partial<Record<keyof RegisterFormData, string>>;


type Props = {
  values: RegisterFormData;
  errors: StepErrors;
  onChange: (patch: Partial<RegisterFormData>) => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
};

export default function StepProfile({
  values,
  errors,
  onChange,
  loading,
  onNext,
}: Props) {
  return (
    <div className="max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 mt-5">Create Account</h2>

      <div style={{ opacity: 1, transform: "none" }}>
        <div className="mt-2">
          <span className="font-sans text-blue-600 font-bold block text-lg mb-4">Tell us more about you</span>

          <form className="space-y-4 mt-10 " onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-medium text-gray-800 mb-1.5">
                  First name
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Ahmed"
                  className="w-full px-3 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-sm font-sans"
                  type="text"
                  value={values.firstName}
                  onChange={(e) => onChange({ firstName: e.target.value })}
                  disabled={loading}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-600 font-mono">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-gray-800 mb-1.5">
                  Last name
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  placeholder="Abdullah"
                  className="w-full px-3 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-sm font-sans"
                  type="text"
                  value={values.lastName}
                  onChange={(e) => onChange({ lastName: e.target.value })}
                  disabled={loading}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-600 font-mono">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-800 mb-1.5">
                Username
                <span className="text-red-500">*</span>
              </label>
              <Input
                required
                placeholder="user123"
                className="w-full px-3 py-3 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 text-sm font-sans"
                type="text"
                value={values.username}
                onChange={(e) => onChange({ username: e.target.value })}
                disabled={loading}
              />

              {errors.username && <p className="mt-1 text-xs text-red-600 font-mono">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-gray-800 mb-1.5">
                Phone
              </label>

              <div className="relative flex">
                <PhoneInput
                 defaultCountry="EG"
                  placeholder="1012345678"
                className="w-full " 
                  value={values.phone}
                  onChange={(value) => onChange({ phone: value || "" })}
                  disabled={loading}
                />
              </div>

              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 font-mono">{errors.phone}</p>
              )}
            </div>

              

            {loading && <div className="mt-1 h-10 w-full rounded-xl bg-gray-100 animate-pulse" />}
          </form>

          <div className="flex items-center mt-10 pt-2">
            <Button
              type="button"
              onClick={() => onNext()}
              disabled={loading}
              className="flex-1 bg-blue-50 text-grey-800 border border-blue-600 font-medium hover:opacity-90 transition-all  h-12"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}