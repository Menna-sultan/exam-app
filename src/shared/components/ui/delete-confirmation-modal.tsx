"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";

type CommonProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  confirmingLabel?: string;
};

type ControlledProps = CommonProps & {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirming?: boolean;
  error?: string;
};

type ActionProps<TArgs extends unknown[]> = CommonProps & {
  action: (...args: TArgs) => Promise<void>;
  actionArgs: TArgs;
  triggerLabel?: string;
  triggerClassName?: string;
};

export function DeleteConfirmationModal<TArgs extends unknown[] = []>(
  props: ControlledProps | ActionProps<TArgs>,
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalConfirming, setInternalConfirming] = useState(false);
  const [internalError, setInternalError] = useState("");
  const isActionMode = "action" in props;
  const open = isActionMode ? internalOpen : props.open;
  const confirming = isActionMode ? internalConfirming : props.confirming ?? false;
  const error = isActionMode ? internalError : props.error;
  const close = isActionMode ? () => setInternalOpen(false) : props.onClose;

  async function handleConfirm() {
    if (!isActionMode) {
      props.onConfirm();
      return;
    }

    setInternalConfirming(true);
    setInternalError("");
    try {
      await props.action(...props.actionArgs);
      setInternalOpen(false);
    } catch (err) {
      setInternalError(err instanceof Error ? err.message : "Failed to delete item");
    } finally {
      setInternalConfirming(false);
    }
  }

  return (
    <>
      {isActionMode && (
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className={props.triggerClassName ?? "flex items-center gap-2 bg-red-600 px-4 py-2.5 text-sm text-white"}
        >
          <Trash2 className="size-4" /> {props.triggerLabel ?? "Delete"}
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="relative w-full max-w-md bg-white p-8 text-center shadow-xl">
            <button
              type="button"
              onClick={close}
              disabled={confirming}
              aria-label="Close"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="size-5" />
            </button>

            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="size-8 text-red-600" />
            </div>

            <h2 className="text-base font-semibold text-slate-900">{props.title}</h2>
            <p className="mt-1 text-sm text-gray-400">{props.description}</p>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                disabled={confirming}
                onClick={close}
                className="border px-6 py-2.5 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirming}
                onClick={() => void handleConfirm()}
                className="bg-red-600 px-6 py-2.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {confirming ? props.confirmingLabel ?? "Deleting..." : props.confirmLabel ?? "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}