"use client";

import { cn } from "@/shared/lib/utils/tailwind-cn";
import { CircleUser, Lock, LogOut } from "lucide-react";
import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";
import { useState } from "react";
import { signOut } from "next-auth/react";

const tabs = [
  { id: "profile", label: "Profile", icon: CircleUser },
  { id: "password", label: "Change Password", icon: Lock },
] as const;

export function AccountTabs() {
  const [active, setActive] =
    useState<(typeof tabs)[number]["id"]>("profile");

  async function handleLogout() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <div className="flex min-h-0 flex-1 gap-5 overflow-auto px-6 pb-6 font-mono">
      {/* Left panel: tabs + logout */}
      <aside className="flex w-60 shrink-0 flex-col gap-1.5 bg-white p-5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-none px-3 text-left text-sm font-medium transition-colors",
              active === id
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex h-10 items-center gap-2.5 rounded-none bg-red-50 px-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          {/* mirrored so the arrow points left, as in the design */}
          <LogOut size={20} className="-scale-x-100" />
          Logout
        </button>
      </aside>

      {/* Right panel: active form */}
      <div className="min-w-0 h-150 flex-1 bg-white p-5">
        {active === "profile" ? <ProfileForm /> : <ChangePasswordForm />}
      </div>
    </div>
  );
}