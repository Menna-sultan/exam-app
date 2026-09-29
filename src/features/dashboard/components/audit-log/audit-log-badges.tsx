/** Adjust/extend if your backend emits other action or role values. */
const actionColors: Record<string, string> = {
  CREATE: "text-green-600",
  UPDATE: "text-amber-600",
  DELETE: "text-red-600",
  SET_IMMUTABLE: "text-purple-600",
  SEED_DATA: "text-blue-600",
};

export function actionColorClass(action: string) {
  return actionColors[action] ?? "text-gray-600";
}

export function ActionBadge({ action, method }: { action: string; method: string }) {
  return (
    <div>
      <p className={`text-sm font-semibold ${actionColorClass(action)}`}>{action}</p>
      <p className="text-xs text-gray-400">Method: {method}</p>
    </div>
  );
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: "text-red-600",
  ADMIN: "text-blue-600",
  USER: "text-gray-500",
};

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  USER: "User",
};

export function RoleLabel({ role }: { role: string }) {
  return (
    <span className={`text-xs font-medium ${roleColors[role] ?? "text-gray-500"}`}>
      {roleLabels[role] ?? role}
    </span>
  );
}
