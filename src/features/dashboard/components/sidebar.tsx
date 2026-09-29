import { getServerSession } from "next-auth";
import { FolderCode, MoreVertical, User2 } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import Image from "next/image";
import { authOptions } from "@/auth";

export async function Sidebar() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const displayName = [user?.firstName ?? "", user?.lastName ?? ""].filter(Boolean).join(" ") || user?.username || "User";

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col bg-slate-800 p-8 text-white">
      <div className="mb-16">
      <div className="flex items-center">
          <Image
            src="/images/Final Logo2.png"
            alt="Elevate"
            width={100}
            height={32}
            className="w-40 h-8"
          />
        </div>
        <div className="mt-4 flex items-center gap-2 font-semibold">
          <FolderCode className="size-6" /> Exam App
        </div>
      </div>

      <SidebarNav />

      <div className="mt-auto flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-700 text-slate-300">
          {user?.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              alt={displayName}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          ) : (
            <User2 className="size-5" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1 text-sm">
          <p className="truncate font-semibold">{displayName}</p>
          <p className="truncate text-xs text-slate-400">{user?.email ?? ""}</p>
        </div>
        <MoreVertical className="size-4 text-slate-300" />
      </div>
    </aside>
  );
}