"use client";

import { Toast } from "@/shared/components/ui/toast";
import { cn } from "@/shared/lib/utils/tailwind-cn";
import { CircleX, Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { useSession } from "next-auth/react";
import { changePassword } from "@/features/main/apis/users.api";
import { inputBase, primaryButton } from "./account styles";

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  // each field has its own eye toggle, as in the design
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputBase, "pr-9")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
        >
          {/* crossed eye = password is hidden */}
          {visible ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>
    </div>
  );
}

export function ChangePasswordForm() {
  const { data: session } = useSession();
  const token = session?.token;

  const [error, setError] = useState("");
  const [toast, setToast] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  async function handleSubmit() {
    if (!token) {
      setError("You must be signed in");
      return;
    }

    // client-side validation first (cheap checks, no need to hit the API)
    if (!values.current) {
      setError("Please enter your current password");
      return;
    }
    if (values.next.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }
    if (values.next !== values.confirm) {
      setError("New password and confirmation do not match");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await changePassword(token, {
        currentPassword: values.current,
        newPassword: values.next,
        confirmPassword: values.confirm,
      });

      setToast(true);
      setTimeout(() => setToast(false), 2500);
      setValues({ current: "", next: "", confirm: "" });
    } catch (err) {
      // this is where a wrong "current password" from the server surfaces
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Current password, separated from the new-password fields by a divider */}
      <div className="border-b border-gray-100 pb-5">
        <PasswordField
          label="Current Password"
          value={values.current}
          onChange={(v) => setValues((s) => ({ ...s, current: v }))}
        />
      </div>

      <PasswordField
        label="New Password"
        value={values.next}
        onChange={(v) => setValues((s) => ({ ...s, next: v }))}
      />
      <PasswordField
        label="Confirm New Password"
        value={values.confirm}
        onChange={(v) => setValues((s) => ({ ...s, confirm: v }))}
      />

      {error && (
        <div
          role="alert"
          className="relative mt-4 border border-red-500 bg-red-50 px-3 py-2 text-center text-xs font-medium text-red-600"
        >
          {/* icon sits centered on the top border */}
          <span className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 rounded-full bg-white text-red-500">
            <CircleX size={16} />
          </span>
          {error}
        </div>
      )}

      <button
        type="button"
        className={cn(primaryButton, "mt-2")}
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Updating..." : "Update Password"}
      </button>

      <Toast message="Your password has been updated." show={toast} />
    </div>
  );
}