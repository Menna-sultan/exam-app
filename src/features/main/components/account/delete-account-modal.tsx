"use client";


import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";

export function DeleteAccountModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <DeleteConfirmationModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Are you sure you want to delete your account?"
      description="This action is permanent and cannot be undone."
    />
  );
}
