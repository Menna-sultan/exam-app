import type { AuditLog } from "../apis/audit-logs";

/** "8:29:00 PM" + "Sat, April 11, 2025" — matches the Audit Log mockups. */
export function formatAuditTimestamp(iso: string) {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return { time, day };
}

export function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Best-effort link to the entity a log entry refers to.
 * Adjust/extend as your real routes require — "question" in particular
 * doesn't have a confirmed standalone route in the source project.
 */
export function auditEntityHref(entityType: string, entityId: string): string | null {
  switch (entityType.toLowerCase()) {
    case "diploma":
      return `/dashboard/diplomas/${entityId}`;
    case "exam":
      return `/dashboard/exams/${entityId}`;
    case "question":
      return `/dashboard/questions/${entityId}`;
    default:
      return null;
  }
}

/** "Diploma Update By Abdulrahman Muhammad" */
export function auditLogTitle(log: AuditLog) {
  return `${capitalize(log.entityType)} ${capitalize(log.action)} By ${log.actorUsername}`;
}
