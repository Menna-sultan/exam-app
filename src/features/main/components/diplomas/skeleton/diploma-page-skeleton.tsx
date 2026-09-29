import { Skeleton } from "@/shared/components/ui/skeleton";

export function DiplomaPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="group relative flex h-112 w-full flex-col justify-end overflow-hidden border border-[#dfeaf7] bg-white shadow-sm"
        >
          <Skeleton className="absolute inset-0 w-full" />

          {/* <div className="relative mx-3 mb-3 h-28 space-y-2 overflow-hidden bg-[#1b7af4]/90 p-4 font-mono">
            <Skeleton className="h-5 w-3/4 rounded-md bg-white/30" />
            <Skeleton className="h-3 w-full rounded-md bg-white/25" />
            <Skeleton className="h-3 w-2/3 rounded-md bg-white/25" />
          </div> */}
        </div>
      ))}
    </div>
  );
}
