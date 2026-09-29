"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "register-otp-resend-end-time";
const RESEND_DELAY_SECONDS = 60;

function getRemainingSeconds() {
  if (typeof window === "undefined") return 0;

  const endTime = Number(window.localStorage.getItem(STORAGE_KEY));
  if (!endTime) return 0;

  return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
}

export function OtpResendTimer({
  onResend,
}: {
  onResend: () => Promise<boolean>;
}) {
  const [secondsLeft, setSecondsLeft] = useState(getRemainingSeconds);
  const canResend = secondsLeft === 0;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft(getRemainingSeconds());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  async function handleResend() {
    if (!canResend) return;

    const success = await onResend();
    if (!success) return;

    const endTime = Date.now() + RESEND_DELAY_SECONDS * 1000;
    window.localStorage.setItem(STORAGE_KEY, endTime.toString());
    setSecondsLeft(RESEND_DELAY_SECONDS);
  }

  return (
    <div className="mb-4 flex items-center justify-center gap-1 text-sm text-slate-600">
      <span>Didn&apos;t receive the code?</span>
      <button
        type="button"
        onClick={() => void handleResend()}
        disabled={!canResend}
        className="font-semibold text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline"
      >
        {canResend ? "Resend" : `Resend in ${secondsLeft}s`}
      </button>
    </div>
  );
}
