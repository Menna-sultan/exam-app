import { cn } from "@/shared/lib/utils/tailwind-cn";

export function Progress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <div
      className={cn("h-1.5 w-full rounded-full bg-blue-100", className)}
    >
      <div
        className="h-full rounded-full bg-blue-600 transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
