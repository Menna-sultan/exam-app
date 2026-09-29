"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import {
  clearAuditLogs,
  deleteAuditLog,
} from "@/features/dashboard/apis/audit-logs";

export async function removeAuditLog(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  await deleteAuditLog(session.token, id);
  revalidatePath("/dashboard/audit-log");
}

export async function clearAllAuditLogs(): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  await clearAuditLogs(session.token);
  revalidatePath("/dashboard/audit-log");
}

export async function removeAuditLogAndRedirect(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  await deleteAuditLog(session.token, id);
  redirect("/dashboard/audit-log");
}
