import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { Pagination } from "@/features/dashboard/components/pagination";
import { AuditLogFilters } from "@/features/dashboard/components/audit-log/audit-log-filters";
import { AuditLogTable } from "@/features/dashboard/components/audit-log/audit-log-table";
import { ClearAuditLogsButton } from "@/features/dashboard/components/audit-log/clear-audit-logs-button";
import {
  clearAuditLogs,
  deleteAuditLog,
  getAdminUsers,
  getAuditLogs,
  type AuditLogsParams,
} from "@/features/dashboard/apis/audit-logs";

type SearchParams = {
  page?: string;
  category?: string;
  action?: string;
  actorUserId?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  const params: AuditLogsParams = {
    page: Number(sp.page ?? 1),
    limit: 20,
    category: sp.category as AuditLogsParams["category"],
    action: sp.action as AuditLogsParams["action"],
    actorUserId: sp.actorUserId,
    sortBy: sp.sortBy as AuditLogsParams["sortBy"],
    sortOrder: sp.sortOrder as AuditLogsParams["sortOrder"],
  };

  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  const [logs, users] = await Promise.all([
    getAuditLogs(session.token, params),
    getAdminUsers(session.token, { limit: 100 }),
  ]);

  async function removeEntry(id: string) {
  
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteAuditLog(session.token, id);
    revalidatePath("/dashboard/audit-log");
  }

  async function clearAll() {
   
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await clearAuditLogs(session.token);
    revalidatePath("/dashboard/audit-log");
  }

  // Keep filters/sort in the URL when the pager changes page.
  const query: Record<string, string> = {};
  if (sp.category) query.category = sp.category;
  if (sp.action) query.action = sp.action;
  if (sp.actorUserId) query.actorUserId = sp.actorUserId;
  if (sp.sortBy) query.sortBy = sp.sortBy;
  if (sp.sortOrder) query.sortOrder = sp.sortOrder;

  return (
    <>
      <PageHeader crumbs={[{ label: "Audit Log" }]} />

      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <Pagination
            page={logs.metadata.page}
            pages={logs.metadata.totalPages}
            total={logs.metadata.total}
            pageSize={logs.metadata.limit}
            query={query}
          />
          <ClearAuditLogsButton action={clearAll} />
        </div>

        <AuditLogFilters
          users={users.data}
          defaults={{
            category: sp.category,
            action: sp.action,
            actorUserId: sp.actorUserId,
            sortBy: sp.sortBy,
            sortOrder: sp.sortOrder,
          }}
        />

        <AuditLogTable items={logs.data} deleteAction={removeEntry} />
      </div>
    </>
  );
}