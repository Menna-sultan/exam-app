"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils/tailwind-cn";
import { CodeXml, Folder, GraduationCap, LogOut, MoreVertical, User, User2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getProfile } from "../../apis/users.api";
import type { IUserProfile } from "../../types/users";

const navItems = [
  { href: "/diplomas", label: "Diplomas", icon: GraduationCap },
  { href: "/account", label: "Account Settings", icon: User2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.token;

  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sessionUser = session?.user;

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    getProfile(token)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const resolvedUser = profile ?? sessionUser ?? null;
  const isProfileLoading = !resolvedUser && !!token;
  const displayName = resolvedUser
    ? `${resolvedUser.firstName ?? ""} ${resolvedUser.lastName ?? ""}`.trim() || resolvedUser.username || ""
    : "";

  return (
<aside className="flex h-full w-72 shrink-0 flex-col border-r border-[#e7edf9] bg-[#EFF6FF] px-4 py-5">      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center">
          <Image
            src="/images/FinalLogo1.png"
            alt="Elevate"
            width={100}
            height={32}
            className="w-40 h-8"
          />
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <div className="relative flex items-center justify-center">
            <Folder size={18} className="fill-[#1b7af4] text-[#1b7af4]" />
            <CodeXml
              size={8}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
            />
          </div>
          <span className="text-base font-semibold text-[#1b7af4]">Exam App</span>
        </div>
      </div>

      <nav className="flex flex-col gap-4 mt-10 ">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#DBEAFE] border border-[#155DFC] text-[#155DFC] shadow-sm"
                  : "text-slate-500 hover:bg-[#edf5ff] hover:text-[#1d4b86]"
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div
        ref={menuRef}
        className="group/profile relative flex items-center gap-2.5 rounded-xl bg-white px-2 py-2 shadow-sm ring-1 ring-[#edf2f9]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#dfeeff] text-sm font-semibold text-[#1b7af4]">
          {resolvedUser?.profilePhoto ? (
            <Image
              src={resolvedUser.profilePhoto}
              alt={displayName || "User profile"}
              width={36}
              height={36}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <User size={18} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold text-[#1d4b86]">
            {isProfileLoading ? "" : displayName || "User"}
          </p>
          <p className="truncate text-xs text-slate-400">
            {isProfileLoading ? "" : resolvedUser?.email ?? ""}
          </p>
        </div>
        <button
          type="button"
          aria-label="Account menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <MoreVertical size={16} />
        </button>

        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-lg bg-white py-1 shadow-lg ring-1 ring-[#edf2f9]">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={15} />
              Log out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}