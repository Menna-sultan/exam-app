export function AuditLogMetadata({ metadata }: { metadata: Record<string, unknown> }) {
  const entries = Object.entries(metadata);
  if (entries.length === 0) return null;

  return (
    <div className="bg-gray-100 p-4 font-mono text-sm">
      {entries.map(([key, value]) => (
        <p key={key} className="text-slate-700">
          <span className="text-slate-500">&quot;{key}&quot;</span>
          {": "}
          <span>{JSON.stringify(value)}</span>,
        </p>
      ))}
    </div>
  );
}
