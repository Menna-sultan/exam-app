'use client'

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

interface Props {
  email: string;
  onBack: () => void;
  otp?: string;
  setOtp?: (val: string) => void;
  onVerify?: () => void;
  isLoading?: boolean;
  error?: string;
}

export function OtpStep({ email, onBack }: Props) {
  return (
    <div className="flex flex-col items-start w-full max-w-md mx-auto animate-in fade-in duration-500">
      
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        className="mb-8 h-10 w-10 border-gray-200"
      >
        <ArrowLeft className="h-5 w-5 text-gray-600" />
      </Button>

      <h2 className="text-3xl font-bold text-[#111827] leading-tight mb-6">
        Password Reset Sent
      </h2>

      <div className="space-y-6 text-[#4B5563] font-mono text-sm leading-relaxed">
        <p>
          We have sent a password reset link to:{" "}
          <span className="text-blue-600 break-all">{email || "user@example.com"}</span>.
        </p>

        <p>
          Please check your inbox and follow the instructions to reset your password.
        </p>

        <p className="text-gray-400">
          If you don’t see the email within a few minutes, check your spam or junk folder.
        </p>
      </div>

      <p className="mt-12 text-sm font-mono text-gray-500">
        Don’t have an account?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Create yours
        </Link>
      </p>

    </div>
  );
}