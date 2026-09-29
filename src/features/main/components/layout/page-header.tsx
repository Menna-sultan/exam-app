import { cn } from "@/shared/lib/utils/tailwind-cn";
import { ChevronLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div className="mb-3  bg-white px-4 py-4 shadow-sm ">
      <p className="text-sm text-gray-400">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-1">/</span>}
            <span
              className={cn(
                i === items.length - 1 && "font-medium text-blue-500 text-sm"
              )}
            >
              {item}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}

export function PageHeader({
  icon: Icon,
  title,
  backHref,
  right,
}: {
  icon: LucideIcon;
  title: string;
  backHref?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center gap-3 p-6">
      {backHref && (
        <Link
          href={backHref}
          className="flex h-19 w-10 shrink-0 items-center justify-center  border border-[#155DFC] text-[#155DFC] hover:bg-gray-50"
        >
          <ChevronLeft size={18} />
        </Link>
      )}
      <div className="flex h-19 flex-1 items-center gap-2.5 rounded-md bg-blue-600 px-4 text-white  font-semibold shadow-sm shadow-blue-600/20">
        <Icon size={32} />
        <h1 className="text-3xl font-semibold">{title}</h1>
      </div>
      {right}
    </div>
  );
}
