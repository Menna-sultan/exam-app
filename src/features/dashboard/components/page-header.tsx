import Link from "next/link";

type Crumb = { label: string; href?: string };

export function PageHeader({
  crumbs,
  title,
  subtitle,
  children,
}: {
  crumbs: Crumb[];
  title?: string;
  subtitle?: React.ReactNode; // small gray line under the title
  children?: React.ReactNode;
}) {
  return (
    <header className="bg-white">
      <nav className="border-b px-4 py-4 text-xs text-gray-400">
        {crumbs.map((c, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">/</span>}
            {c.href ? (
              <Link href={c.href}>{c.label}</Link>
            ) : (
              <span className="text-blue-600">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
      {(title || children) && (
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-semibold">{title}</h1>
            {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">{children}</div>
        </div>
      )}
    </header>
  );
}
