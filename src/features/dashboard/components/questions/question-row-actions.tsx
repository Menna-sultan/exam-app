"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";

export function QuestionRowActions({
  examId,
  questionId,
  removeAction,
}: {
  examId: string;
  questionId: string;
  removeAction: (questionId: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRemove() {
    setRemoving(true);
    setError("");
    try {
      await removeAction(questionId);
      setOpen(false);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to remove question");
    } finally {
      setRemoving(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Actions"
        className="bg-gray-200 p-1.5"
      >
        <MoreHorizontal className="size-4" />
      </button>
      {open && (
        <div
          className="absolute right-0 z-10 mt-1 w-44 border bg-white text-sm shadow"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href={`/dashboard/exams/${examId}/questions/${questionId}`}
            className="block px-3 py-2 hover:bg-gray-50"
          >
            View
          </Link>
          <button
            type="button"
            disabled={removing}
            onClick={() => setConfirmOpen(true)}
            className="block w-full px-3 py-2 text-left text-red-600 hover:bg-gray-50 disabled:opacity-50"
          >
            {removing ? "Removing..." : "Remove from exam"}
          </button>
          {error && <p className="px-3 py-2 text-xs text-red-600">{error}</p>}
        </div>
      )}

        <DeleteConfirmationModal
          open={confirmOpen}
          onClose={() => !removing && setConfirmOpen(false)}
          onConfirm={() => void handleRemove()}
          title="Remove question?"
          description="This will remove the question from this exam."
          confirmLabel="Remove"
          confirmingLabel="Removing..."
          confirming={removing}
          error={error}
        />
    </div>
  );
}
