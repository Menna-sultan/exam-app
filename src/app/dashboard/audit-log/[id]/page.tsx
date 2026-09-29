import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AuditLogDetail } from "@/features/dashboard/components/audit-log/audit-log-detail";
import { getAuditLog } from "@/features/dashboard/apis/audit-logs";
import { auditLogTitle } from "@/features/dashboard/lib/audit-log-format";
import { removeAuditLogAndRedirect } from "@/features/dashboard/actions/audit-log.actions";

export default async function AuditLogViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const log = await getAuditLog(session.token, id);
  if (!log) notFound();

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Audit Log", href: "/dashboard/audit-log" },
          { label: auditLogTitle(log) },
        ]}
      />
      <div className="p-6">
        <AuditLogDetail log={log} deleteAction={removeAuditLogAndRedirect} />
      </div>
    </>
  );
}