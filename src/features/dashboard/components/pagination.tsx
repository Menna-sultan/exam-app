import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page, pages, total, pageSize, query = {},
}: {
  page: number;
  pages: number;
  total: number;
  pageSize: number;
  /** Other query params (search, filters, sort) to keep when changing page. */
  query?: Record<string, string>;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const btn = "flex h-10 w-10 items-center justify-center bg-gray-200";

  const href = (p: number) => {
    const sp = new URLSearchParams(query);
    sp.set("page", String(p));
    return `?${sp}`;
  };

  return (
    <div className="flex items-center gap-6 text-sm">
      <span>{from} - {to} of {total}</span>
      <div className="flex">
        {page > 1 ? (
          <Link href={href(page - 1)} className={btn}><ChevronLeft className="size-4" /></Link>
        ) : (
          <span className={`${btn} opacity-50`}><ChevronLeft className="size-4" /></span>
        )}
        <span className="flex h-10 items-center bg-gray-100 px-4 text-gray-400">
          Page {page} of {pages}
        </span>
        {page < pages ? (
          <Link href={href(page + 1)} className={btn}><ChevronRight className="size-4" /></Link>
        ) : (
          <span className={`${btn} opacity-50`}><ChevronRight className="size-4" /></span>
        )}
      </div>
    </div>
  );
}
