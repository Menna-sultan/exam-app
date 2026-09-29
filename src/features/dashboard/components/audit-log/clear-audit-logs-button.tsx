"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";

export function ClearAuditLogsButton({ action }: { action: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleClear() {
    setClearing(true);
    setError("");
    try {
      await action();
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear audit logs");
    } finally {
      setClearing(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-red-600 px-4 py-2.5 text-sm text-white"
      >
        <Trash2 className="size-4" /> Clear All Logs
      </button>

      <DeleteConfirmationModal
        open={open}
        onClose={() => !clearing && setOpen(false)}
        onConfirm={() => void handleClear()}
        title="Are you sure you want to clear all logs?"
        description="This action is permanent and cannot be undone."
        confirmLabel="Yes, clear"
        confirmingLabel="Clearing..."
        confirming={clearing}
        error={error}
      />
    </>
  );
}
