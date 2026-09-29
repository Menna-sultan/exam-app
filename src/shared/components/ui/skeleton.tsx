import { cn } from "@/shared/lib/utils/tailwind-cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-gray-200", className)} />;
}