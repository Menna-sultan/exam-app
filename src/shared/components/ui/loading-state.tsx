import { LoaderCircle } from "lucide-react";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
      <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}