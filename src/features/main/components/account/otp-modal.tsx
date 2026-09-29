"use client";

import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import {
  confirmEmailChange,
  requestEmailChange,
} from "@/features/main/apis/users.api";

export function OtpModal({
  open,
  email,
  onEdit,
  onClose,
  onVerified,
}: {
  open: boolean;
  email: string;
  onEdit: () => void;
  onClose: () => void;
  onVerified: () => void;
}) {
  const { data: session } = useSession();
  const token = session?.token;
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [seconds, setSeconds] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    setSeconds(60);
    setDigits(Array(6).fill(""));
    setError("");
    const t = setInterval(
      () => setSeconds((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(t);
  }, [open]);

  function handleChange(i: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[i] = value;
    setDigits(next);
    if (value && i < 5) refs.current[i + 1]?.focus();
  }

  async function handleVerify() {
    if (!token) {
      setError("You must be signed in");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      await confirmEmailChange(token, digits.join(""));
      onVerified();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid or expired code"
      );
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (!token) {
      setError("You must be signed in");
      return;
    }
    setResending(true);
    setError("");
    try {
      await requestEmailChange(token, email);
      setSeconds(60);
      setDigits(Array(6).fill(""));
      refs.current[0]?.focus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to resend code"
      );
    } finally {
      setResending(false);
    }
  }

  const complete = digits.every((d) => d !== "");

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <ShieldCheck size={18} />
      </div>
      <h3 className="mb-1 text-base font-semibold text-gray-900">
        Change Email
      </h3>
      <p className="mb-1 text-sm text-blue-500">Verify OTP</p>
      <p className="mb-5 text-xs text-gray-400">
        Please enter the 6-digits code we have sent to:{" "}
        <span className="text-gray-600">{email || "user@example.com"}</span>{" "}
        <button onClick={onEdit} className="text-blue-500 hover:underline">
          Edit
        </button>
      </p>

      <div className="mb-5 flex justify-between gap-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            onChange={(e) => handleChange(i, e.target.value)}
            disabled={verifying}
            maxLength={1}
            className="h-11 w-10 rounded-lg border border-gray-200 text-center text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        ))}
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      <p className="mb-5 text-xs text-gray-400">
        {seconds > 0 ? (
          <>
            You can request another code in:{" "}
            <span className="font-medium text-gray-600">{seconds}s</span>
          </>
        ) : (
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-blue-500 hover:underline disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        )}
      </p>

      <Button
        className="w-full"
        disabled={!complete || verifying}
        onClick={handleVerify}
      >
        {verifying ? "Verifying..." : "Verify Code"}
      </Button>
    </Modal>
  );
}