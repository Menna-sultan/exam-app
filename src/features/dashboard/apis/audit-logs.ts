import { ApiSuccess, ListParams, Paginated } from "../types/types";

const BASE = process.env.NEXT_PUBLIC_API!;


export type AuditLog = {
  id: string;
  createdAt: string;
  actorUserId: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: "USER" | "ADMIN" | "SUPER_ADMIN";
  category: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  httpMethod: string;
  path: string;
};

export type AuditLogsParams = ListParams & {
  category?: "DIPLOMA" | "EXAM" | "QUESTION" | "USERS" | "SYSTEM";
  action?: "CREATE" | "UPDATE" | "DELETE" | "SET_IMMUTABLE" | "SEED_DATA";
  actorUserId?: string;
  sortBy?: "user" | "entity" | "createdAt";
};


export type AdminUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhoto: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  immutable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminUsersParams = ListParams & {
  role?: string;
  immutable?: boolean;
};


function getHeaders(token: string) {
  return {
    accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getJsonHeaders(token: string) {
  return {
    ...getHeaders(token),
    "Content-Type": "application/json",
  };
}

async function parseResponse<T>(res: Response, fallbackMessage: string) {
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message ?? fallbackMessage);
  return json as T;
}

function buildSearchParams(params: Record<string, unknown>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  return sp;
}



export async function getAuditLogs(token: string, params: AuditLogsParams = {}) {
  const sp = buildSearchParams(params);

  const res = await fetch(`${BASE}/admin/audit-logs?${sp}`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  return (await parseResponse<ApiSuccess<Paginated<AuditLog>>>(
    res,
    "Failed to load audit logs"
  )).payload;
}

export async function getAuditLog(token: string, id: string) {
  const res = await fetch(`${BASE}/admin/audit-logs/${id}`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  if (res.status === 404) return null;

  return (await parseResponse<ApiSuccess<{ auditLog: AuditLog }>>(
    res,
    "Failed to load audit log"
  )).payload.auditLog;
}

export async function deleteAuditLog(token: string, id: string) {
  const res = await fetch(`${BASE}/admin/audit-logs/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
    cache: "no-store",
  });

  return parseResponse<{ status: true; code: number; message: string }>(
    res,
    "Failed to delete audit log"
  );
}

export async function clearAuditLogs(token: string) {
  const res = await fetch(`${BASE}/admin/audit-logs`, {
    method: "DELETE",
    headers: getHeaders(token),
    cache: "no-store",
  });

  return (await parseResponse<ApiSuccess<{ deletedCount: number }>>(
    res,
    "Failed to clear audit logs"
  )).payload;
}


export async function getAdminUsers(token: string, params: AdminUsersParams = {}) {
  const sp = buildSearchParams({ page: 1, limit: 12, ...params });

  const res = await fetch(`${BASE}/admin/users?${sp}`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  return (await parseResponse<ApiSuccess<Paginated<AdminUser>>>(
    res,
    "Failed to load users"
  )).payload;
}


export async function seedDashboardData(token: string) {
  const res = await fetch(`${BASE}/admin/seed`, {
    method: "POST",
    headers: getJsonHeaders(token),
    cache: "no-store",
  });

  return parseResponse<{ message: string }>(res, "Failed to seed dashboard data");
}