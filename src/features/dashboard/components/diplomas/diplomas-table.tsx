import Link from "next/link";

import { RowActions } from "./row-actions";
import type { Diploma } from "@/features/main/apis/diploma.api";
import { SortMenu, type SortOption } from "../sort-menu";


const cols = "grid grid-cols-[100px_200px_1fr_80px] items-center";

const sortOptions: SortOption[] = [
  { label: "Newest", order: "desc", kind: "date", params: { sortBy: "createdAt", sortOrder: "desc" } },
  { label: "Newest", order: "asc", kind: "date", params: { sortBy: "createdAt", sortOrder: "asc" } },
  { label: "Title", order: "desc", kind: "text", params: { sortBy: "title", sortOrder: "desc" } },
  { label: "Title", order: "asc", kind: "text", params: { sortBy: "title", sortOrder: "asc" } },
];

export function DiplomasTable({
  items,
  removeAction,
}: {
  items: Diploma[];
  removeAction: (id: string) => Promise<void>;
}) {
  return (
    <div className="bg-white">
      <div className={`${cols} bg-blue-600 px-4 py-2.5 text-sm font-medium text-white`}>
        <span>Image</span>
        <span>Title</span>
        <span>Description</span>
        <div className="flex justify-end">
          <SortMenu options={sortOptions} />
        </div>
      </div>

      {items.map((d) => (
        <div key={d.id} className={`${cols} border-b px-4 py-2.5 text-sm hover:bg-gray-50`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.image ?? ""} alt={d.title} className="size-17.5 object-cover" />

          <div className="group relative pr-4">
            <Link href={`/dashboard/diplomas/${d.id}`} className="block truncate">
              {d.title}
            </Link>
            {/* tooltip */}
            <span className="pointer-events-none absolute -top-10 left-0 hidden whitespace-nowrap bg-slate-800 px-2 py-1.5 text-xs text-white group-hover:block">
              {d.title}
            </span>
          </div>

          <p className="line-clamp-4 pr-8 text-gray-600">{d.description}</p>

          <div className="flex justify-end">
              <div className="mr-6">
            <RowActions id={d.id} removeAction={removeAction} />
          </div>
            </div>
        </div>
      ))}
    </div>
  );
}