"use client";

import { Mail } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { OtpModal } from "./otp-modal";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Modal } from "@/shared/components/ui/modal";
import { requestEmailChange } from "@/features/main/apis/users.api";

export function ChangeEmailModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: (email: string) => void;
}) {
  const { data: session } = useSession();
  const token = session?.token;
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function handleNext() {
    if (!token) {
      setError("You must be signed in");
      return;
    }
    setSending(true);
    setError("");
    try {
      await requestEmailChange(token, email);
      setShowOtp(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send verification code"
      );
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setEmail("");
    setError("");
    setShowOtp(false);
    onClose();
  }

  return (
    <>
      <Modal open={open && !showOtp} onClose={handleClose}>
        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Mail size={18} />
        </div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          Change Email
        </h3>
        <p className="mb-5 text-sm text-blue-500">Enter your new email</p>

        <Input
          label="Email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

        <Button
          className="mt-6 w-full"
          disabled={!email || sending}
          onClick={handleNext}
        >
          {sending ? "Sending code..." : "Next →"}
        </Button>
      </Modal>

      <OtpModal
        open={open && showOtp}
        email={email}
        onEdit={() => setShowOtp(false)}
        onClose={handleClose}
        onVerified={() => {
          setShowOtp(false);
          onDone(email);
        }}
      />
    </>
  );
}