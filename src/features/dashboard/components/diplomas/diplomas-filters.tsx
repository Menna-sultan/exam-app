import Link from "next/link";
import { ChevronsUpDown, Search, SlidersHorizontal, ChevronsDownUp } from "lucide-react";

export function DiplomasFilters({
  defaults = {},
}: {
  defaults?: { q?: string; immutable?: string; sortBy?: string; sortOrder?: string };
}) {
  return (
    <details open className="group bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between bg-blue-600 px-2.5 py-2.5 text-white [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2 font-medium">
          <SlidersHorizontal className="size-4" /> Search &amp; Filters
        </span>
        <span className="flex items-center gap-1 text-sm">
          <ChevronsDownUp className="size-3.5" />
          <span className="group-open:hidden">Show</span>
          <span className="hidden group-open:inline">Hide</span>
        </span>
      </summary>

      <form action="/dashboard/diplomas" className="space-y-3 p-4">
        {defaults.sortBy && <input type="hidden" name="sortBy" value={defaults.sortBy} />}
        {defaults.sortOrder && <input type="hidden" name="sortOrder" value={defaults.sortOrder} />}
        <div className="relative">
          <input
            name="q"
            defaultValue={defaults.q}
            placeholder="Search by title"
            className="w-full border px-3 py-3 text-sm outline-none focus:border-blue-600"
          />
          <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-300" />
        </div>

        <div className="relative w-80">
          <select
            name="immutable"
            defaultValue={defaults.immutable ?? ""}
            className="w-full appearance-none border px-3 py-3 text-sm text-gray-500"
          >
            <option value="">Immutability</option>
            <option value="true">Immutable</option>
            <option value="false">Mutable</option>
          </select>
          <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
        </div>

        <div className="flex items-center justify-end gap-6">
          <Link href="/dashboard/diplomas" className="text-sm">Clear</Link>
          <button className="bg-gray-200 px-6 py-2.5 text-sm">Apply</button>
        </div>
      </form>
    </details>
  );
}