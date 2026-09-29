import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { AuditLog } from "../../apis/audit-logs";
import { SortMenu, type SortOption } from "../sort-menu";
import { AuditLogRowActions } from "./audit-log-row-actions";
import { ActionBadge, RoleLabel } from "./audit-log-badges";
import { auditEntityHref, capitalize, formatAuditTimestamp } from "../../lib/audit-log-format";

const cols = "grid grid-cols-[130px_260px_1fr_190px_48px] items-center gap-3";


const sortOptions: SortOption[] = [
  { label: "Action", order: "desc", kind: "text", params: { sortBy: "action", sortOrder: "desc" } },
  { label: "Action", order: "asc", kind: "text", params: { sortBy: "action", sortOrder: "asc" } },
  { label: "User", order: "desc", kind: "text", params: { sortBy: "user", sortOrder: "desc" } },
  { label: "User", order: "asc", kind: "text", params: { sortBy: "user", sortOrder: "asc" } },
  { label: "Entity", order: "desc", kind: "text", params: { sortBy: "entity", sortOrder: "desc" } },
  { label: "Entity", order: "asc", kind: "text", params: { sortBy: "entity", sortOrder: "asc" } },
  { label: "Newest", order: "desc", kind: "date", params: { sortBy: "createdAt", sortOrder: "desc" } },
  { label: "Newest", order: "asc", kind: "date", params: { sortBy: "createdAt", sortOrder: "asc" } },
];

export function AuditLogTable({
  items,
  deleteAction,
}: {
  items: AuditLog[];
  deleteAction: (id: string) => Promise<void>;
}) {
  return (
    <div className="bg-white">
      <div className={`${cols} bg-blue-600 px-4 py-2.5 text-sm font-medium text-white`}>
        <span>Action</span>
        <span>User</span>
        <span>Entity</span>
        <span>Time</span>
        <div className="flex justify-end">
          <SortMenu options={sortOptions} />
        </div>
      </div>

      {items.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-gray-400">No audit log entries found.</p>
      )}

      {items.map((log) => {
        const { time, day } = formatAuditTimestamp(log.createdAt);
        const href = auditEntityHref(log.entityType, log.entityId);

        return (
          <div key={log.id} className={`${cols} border-b px-4 py-2.5 text-sm hover:bg-gray-50`}>
            <ActionBadge action={log.action} method={log.httpMethod} />

            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{log.actorUsername}</p>
              <p className="truncate text-xs text-gray-400">{log.actorEmail}</p>
              <RoleLabel role={log.actorRole} />
            </div>

            <div className="min-w-0 pr-4">
              <p className="font-medium text-slate-900">{capitalize(log.entityType)}</p>
              {href ? (
                <Link href={href} className="flex items-center gap-1 truncate text-xs text-blue-600">
                  <span className="truncate">{log.entityId}</span>
                  <ExternalLink className="size-3 shrink-0" />
                </Link>
              ) : (
                <span className="truncate text-xs text-gray-400">{log.entityId}</span>
              )}
            </div>

            <div>
              <p className="text-slate-900">{time}</p>
              <p className="text-xs text-gray-400">{day}</p>
            </div>

            <div className="flex justify-end">
              <div className="mr-6">
              <AuditLogRowActions id={log.id} deleteAction={deleteAction} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
