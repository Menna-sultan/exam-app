"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";

export function AuditLogRowActions({
  id,
  deleteAction,
}: {
  id: string;
  deleteAction: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await deleteAction(id);
      setConfirmOpen(false);
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete entry");
    } finally {
      setDeleting(false);
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
          className="absolute -left-1 z-10 mt-1 w-36 border bg-white text-sm shadow"
          onMouseLeave={() => setOpen(false)}
        >
          <Link
            href={`/dashboard/audit-log/${id}`}
            className="flex items-center gap-2 px-3 py-2 text-green-600 hover:bg-gray-50"
          >
            <Eye className="size-4" /> View
          </Link>
          <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirmOpen(true)}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-gray-50 disabled:opacity-50"
          >
            <Trash2 className="size-4" /> Delete
          </button>
        </div>
      )}

        <DeleteConfirmationModal
          open={confirmOpen}
          onClose={() => !deleting && setConfirmOpen(false)}
          onConfirm={() => void handleDelete()}
          title="Delete this entry?"
          description="This will permanently remove this audit log entry. This action cannot be undone."
          confirmLabel="Delete"
          confirming={deleting}
          error={error}
        />
    </div>
  );
}
