"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";

export function ExamRowActions({
  id,
  removeAction,
}: {
  id: string;
  removeAction: (id: string) => Promise<void>;
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
      await removeAction(id);
      setConfirmOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete exam");
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
          className="absolute -left-1 z-10 mt-1 w-28 border bg-white text-sm shadow"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href={`/dashboard/exams/${id}`}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
          >
            <Eye className="size-4 text-[#00BC7D]" />
            <span>View</span>
          </Link>
          <Link
            href={`/dashboard/exams/${id}/edit`}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
          >
            <Pencil className="size-4 text-[#155DFC]" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            disabled={removing}
            onClick={() => {
              setOpen(false);
              setConfirmOpen(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="size-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
      <DeleteConfirmationModal
        open={confirmOpen}
        onClose={() => !removing && setConfirmOpen(false)}
        onConfirm={() => void handleRemove()}
        title="Delete this exam?"
        description="This action is permanent and cannot be undone."
        confirming={removing}
        error={error}
      />
    </div>
  );
}
