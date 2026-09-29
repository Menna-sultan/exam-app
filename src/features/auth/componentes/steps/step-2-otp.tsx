'use client'

import { Button } from "@/shared/components/ui/button";
import type { RegisterFormData } from "@/features/auth/types/register.types";
import { OtpResendTimer } from "./otp-resend-control";

type StepErrors = Partial<Record<keyof RegisterFormData, string>>;



type Props = {
  values: RegisterFormData;
  errors: StepErrors;
  onChange: (patch: Partial<RegisterFormData>) => void;
  loading: boolean;
  onNext: () => void;
  onBack: () => void;
  onEditEmail: () => void;
  onResendOtp: () => Promise<boolean>;
};

export default function StepOtp({ values, errors, onChange, loading, onNext, onEditEmail, onResendOtp }: Props) {
  return (
    <div className="max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1 mt-5">Create Account</h2>

      <div className="" style={{ opacity: 1, transform: "none" }}>
        <div className="mt-2">
          <span className="font-sans text-blue-600 font-bold block text-lg mb-2">Verify OTP</span>

          <p className="text-md text-slate-600 mb-6 font-sans leading-relaxed">
            Please enter the 6-digits code we have sent to:{" "}
            <span className="text-slate-900 font-semibold">{values.email || "user@example.com"}</span>{" "}
            -{" "}
            <button
            className="text-blue-600 font-mono font-bold underline hover:no-underline"
            type="button"
            onClick={onEditEmail}
          >
            Edit
          </button>
          </p>

          <div className="flex space-x-2.5 my-6 justify-between">
            {Array.from({ length: 6 }).map((_, idx) => {
              const otp = values.otp || "";
              const firstEmpty = otp.length < 6 ? otp.length : -1;
              const activeIndex = firstEmpty === -1 ? 5 : firstEmpty;

              const digit = otp[idx] || "";
              const isActive = idx === activeIndex;

              return (
                <input
                  key={idx}
                  maxLength={1}
                  pattern="[0-9]*"
                  className={
                    "w-12 h-12 text-center mt-8 text-lg font-bold border-2 rounded-xs transition-all text-slate-900 bg-white focus:outline-none " +
                    (isActive ? "border-blue-600" : "border-gray-200")
                  }
                  type="text"
                  value={digit}
                  inputMode="numeric"
                  aria-invalid={!!errors.otp}
                  onChange={(e) => {
                    const v = e.target.value.slice(-1);
                    const next = (values.otp || "").split("");
                    next[idx] = v;
                    const cleaned = next.join("").replace(/\D/g, "").slice(0, 6);
                    onChange({ otp: cleaned });

                    // Auto-advance focus to next input
                    const nextEl = (e.target as HTMLInputElement).nextElementSibling as
                      | HTMLInputElement
                      | null;
                    nextEl?.focus?.();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !digit) {
                      const prevEl = e.currentTarget.previousElementSibling as
                        | HTMLInputElement
                        | null;
                      prevEl?.focus?.();
                    }
                  }}
                />
              );
            })}
          </div>





          <OtpResendTimer onResend={onResendOtp} />

          <Button
            type="button"
            onClick={() => onNext()}
            disabled={loading || (values.otp || "").length < 6}
            className="w-full py-4 px-4 bg-blue-50 text-grey-800 border border-blue-600 font-medium hover:opacity-90 transition-all hover:text-white"
          >
            {loading ? "Verifying…" : "Verify Code"}
          </Button>

          {errors.otp && <p className="mt-3 text-xs text-red-600 font-mono">{errors.otp}</p>}

          {loading && <div className="mt-4 h-10 w-full rounded-xl bg-gray-100" />}
        </div>
      </div>
    </div>
  );
}