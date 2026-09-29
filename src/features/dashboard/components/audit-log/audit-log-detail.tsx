import Link from "next/link";
import { ExternalLink } from "lucide-react";

import type { AuditLog } from "../../apis/audit-logs";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";
import { actionColorClass, RoleLabel } from "./audit-log-badges";
import { AuditLogMetadata } from "./audit-log-metadata";
import { auditEntityHref, auditLogTitle, capitalize, formatAuditTimestamp } from "../../lib/audit-log-format";

export function AuditLogDetail({
  log,
  deleteAction,
}: {
  log: AuditLog;
  deleteAction: (id: string) => Promise<void>;
}) {
  const { time, day } = formatAuditTimestamp(log.createdAt);
  const href = auditEntityHref(log.entityType, log.entityId);
  // Best-effort: for UPDATE entries the metadata payload is the set of changed
  // fields, so its keys double as an "Updated Fields" summary like the mockup.
  const updatedFields =
    log.action === "UPDATE" && log.metadata ? Object.keys(log.metadata).join(", ") : null;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="font-semibold text-slate-900">{auditLogTitle(log)}</h1>
          <p className="mt-1 text-xs text-gray-400">
            Entity:{" "}
            {href ? (
              <Link href={href} className="inline-flex items-center gap-1 text-blue-600">
                {capitalize(log.entityType)} [{log.entityId}] <ExternalLink className="size-3" />
              </Link>
            ) : (
              <span>
                {capitalize(log.entityType)} [{log.entityId}]
              </span>
            )}
          </p>
        </div>
        <DeleteConfirmationModal
          action={deleteAction}
          actionArgs={[log.id]}
          title="Delete this audit log entry?"
          description="This action is permanent and cannot be undone."
        />
      </div>

      <div className="space-y-5 border-t p-6 text-sm">
        <div>
          <p className="text-gray-400">Action</p>
          <p className={`font-semibold ${actionColorClass(log.action)}`}>{log.action}</p>
        </div>

        <div>
          <p className="text-gray-400">Method</p>
          <p className="text-slate-900">{log.httpMethod}</p>
        </div>

        <div>
          <p className="text-gray-400">User</p>
          <p className="font-semibold text-slate-900">{log.actorUsername}</p>
          <p className="text-slate-600">Email: {log.actorEmail}</p>
          <p className="text-slate-600">IP Address: {log.ipAddress}</p>
          <p>
            Role: <RoleLabel role={log.actorRole} />
          </p>
        </div>

        <div>
          <p className="text-gray-400">Entity</p>
          {href ? (
            <Link href={href} className="inline-flex items-center gap-1 text-slate-900">
              {capitalize(log.entityType)}: {log.entityId} <ExternalLink className="size-3.5" />
            </Link>
          ) : (
            <p className="text-slate-900">
              {capitalize(log.entityType)}: {log.entityId}
            </p>
          )}
        </div>

        <div>
          <p className="text-gray-400">Date &amp; Time</p>
          <p className="text-slate-900">
            {time} | {day}
          </p>
        </div>

        {updatedFields && (
          <div>
            <p className="text-gray-400">Updated Fields</p>
            <p className="text-slate-900">{updatedFields}</p>
          </div>
        )}

        {log.metadata && (
          <div>
            <p className="mb-2 text-gray-400">Metadata</p>
            <AuditLogMetadata metadata={log.metadata} />
          </div>
        )}
      </div>
    </div>
  );
}
