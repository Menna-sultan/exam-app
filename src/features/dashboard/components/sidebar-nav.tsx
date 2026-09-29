"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, BookOpenCheck, User, Logs } from "lucide-react";
import { cn } from "@/shared/lib/utils/tailwind-cn";

const items = [
  { href: "/dashboard/diplomas", label: "Diplomas", icon: GraduationCap },
  { href: "/dashboard/exams", label: "Exams", icon: BookOpenCheck },
  { href: "/dashboard/account", label: "Account Settings", icon: User },
  { href: "/dashboard/audit-log", label: "Audit Log", icon: Logs },
];

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-2">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 border border-transparent px-4 py-4 text-sm transition-colors",
              active && "border-slate-500 bg-slate-700"
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
