import Link from "next/link";
import { ChevronsDownUp, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import type { AdminUser } from "../../apis/audit-logs";

type Defaults = {
  category?: string;
  action?: string;
  actorUserId?: string;
  sortBy?: string;
  sortOrder?: string;
};

/** Keep these in sync with AuditLogsParams["category"] in apis/audit-logs.ts */
const CATEGORIES = ["DIPLOMA", "EXAM", "QUESTION", "USERS", "SYSTEM"];
/** Keep these in sync with AuditLogsParams["action"] in apis/audit-logs.ts */
const ACTIONS = ["CREATE", "UPDATE", "DELETE", "SET_IMMUTABLE", "SEED_DATA"];

export function AuditLogFilters({
  users,
  defaults,
}: {
  users: AdminUser[];
  defaults: Defaults;
}) {
  const select =
    "w-full appearance-none border bg-white px-3 py-3 text-sm text-gray-500 outline-none focus:border-blue-600";

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

      {/* key: resets the uncontrolled selects when the URL changes (e.g. Clear) */}
      <form key={JSON.stringify(defaults)} action="/dashboard/audit-log" className="space-y-3 p-4">
        {defaults.sortBy && <input type="hidden" name="sortBy" value={defaults.sortBy} />}
        {defaults.sortOrder && <input type="hidden" name="sortOrder" value={defaults.sortOrder} />}

        <div className="flex flex-wrap gap-2.5">
          <div className="relative w-80 max-w-full">
            <select name="category" defaultValue={defaults.category ?? ""} className={select}>
              <option value="">Category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
          </div>

          <div className="relative w-80 max-w-full">
            <select name="action" defaultValue={defaults.action ?? ""} className={select}>
              <option value="">Action</option>
              {ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
          </div>

          <div className="relative w-80 max-w-full">
            <select name="actorUserId" defaultValue={defaults.actorUserId ?? ""} className={select}>
              <option value="">User</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </option>
              ))}
            </select>
            <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-6">
          <Link href="/dashboard/audit-log" className="text-sm">
            Clear
          </Link>
          <button className="bg-gray-200 px-6 py-2.5 text-sm">Apply</button>
        </div>
      </form>
    </details>
  );
}
