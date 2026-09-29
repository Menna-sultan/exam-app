"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowDownWideNarrow,
  ArrowUp01,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";
import { cn } from "@/shared/lib/utils/tailwind-cn";

export type SortOption = {
  label: string;
  order: "asc" | "desc";
  kind: "text" | "number" | "date";
  /** Query params applied when this option is picked, e.g. { sortBy: "title", sortOrder: "asc" } */
  params: Record<string, string>;
};

const icons = {
  text: { asc: ArrowUpAZ, desc: ArrowDownAZ },
  number: { asc: ArrowUp01, desc: ArrowDown01 },
  date: { asc: CalendarArrowUp, desc: CalendarArrowDown },
};

export function SortMenu({
  options,
  className,
}: {
  options: SortOption[];
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hrefFor = (params: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("page");
    for (const [k, v] of Object.entries(params)) next.set(k, v);
    return `${pathname}?${next}`;
  };

  const isActive = (params: Record<string, string>) =>
    Object.entries(params).every(([k, v]) => searchParams.get(k) === v);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn("flex items-center gap-1 whitespace-nowrap", className)}
      >
        Sort <ArrowDownWideNarrow className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 w-72 border bg-white py-1 text-sm font-normal text-slate-900 shadow-lg"
        >
          {options.map((o) => {
            const Icon = icons[o.kind][o.order];
            return (
              <Link
                key={`${o.label}-${o.order}`}
                href={hrefFor(o.params)}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 hover:bg-gray-50",
                  isActive(o.params) && "bg-blue-50"
                )}
              >
                <Icon className="size-4 text-gray-500" />
                <span>
                  {o.label}{" "}
                  <span className="text-xs text-gray-500">
                    ({o.order === "asc" ? "ascending" : "descending"})
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
