"use client";


import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronsUpDown, Pencil } from "lucide-react";
import { cn } from "@/shared/lib/utils/tailwind-cn";
import { ChangeEmailModal } from "./change-email-modal";
import { DeleteAccountModal } from "./delete-account-modal";
import {
  dangerButton,
  inputBase,
  inputReadOnly,
  primaryButton,
} from "./account styles";
import { deleteAccount, getProfile, updateProfile } from "../../apis/users.api";
import type { IUserProfile } from "../../types/users";
import { Skeleton } from "@/shared/components/ui/skeleton";

const COUNTRY_CODE = "+20"; // adjust if you support more than one country

function splitPhone(phone: string) {
  return phone.startsWith(COUNTRY_CODE)
    ? phone.slice(COUNTRY_CODE.length)
    : phone;
}

function FlagEG() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden className="shrink-0">
      <rect width="20" height="4.67" fill="#ce1126" />
      <rect y="4.67" width="20" height="4.67" fill="#ffffff" />
      <rect y="9.33" width="20" height="4.67" fill="#000000" />
      <circle cx="10" cy="7" r="1.4" fill="#c09300" />
    </svg>
  );
}

const labelCls = "text-xs font-medium text-gray-800";

export function ProfileForm() {
  const { data: session, status } = useSession();
  const token = session?.token;

  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      if (status === "unauthenticated") {
        setLoadError("You must be signed in");
        setLoading(false);
      }
      return;
    }

    let cancelled = false;

    getProfile(token)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(splitPhone(data.phone));
        setEmail(data.email);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load profile"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token, status]);

  async function handleSave() {
    if (!token) {
      setSaveError("You must be signed in");
      return;
    }
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const updated = await updateProfile(token, {
        firstName,
        lastName,
        phone: `${COUNTRY_CODE}${phone}`,
      });
      setProfile(updated);
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!token) {
      setSaveError("You must be signed in");
      setShowDeleteModal(false);
      return;
    }
    try {
      await deleteAccount(token);
      window.location.href = "/login";
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to delete account"
      );
    } finally {
      setShowDeleteModal(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (loadError || !profile) {

  
    return (
      <div className="py-10 text-center text-xs text-red-600">
        {loadError || "Failed to load profile."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-first-name" className={labelCls}>
            First name
          </label>
          <input
            id="profile-first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputBase}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-last-name" className={labelCls}>
            Last name
          </label>
          <input
            id="profile-last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputBase}
          />
        </div>
      </div>

      {/* Username */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-username" className={labelCls}>
          Username
        </label>
        <input
          id="profile-username"
          value={profile.username}
          readOnly
          className={cn(inputBase, inputReadOnly)}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="profile-email" className={labelCls}>
            Email
          </label>
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-1 text-xs font-medium text-blue-600 transition-opacity hover:opacity-70"
          >
            <Pencil size={12} />
            Change
          </button>
        </div>
        <input
          id="profile-email"
          value={email}
          readOnly
          className={inputBase}
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-phone" className={labelCls}>
          Phone
        </label>
        <div className="flex h-10 items-center gap-2 border border-gray-200 bg-white px-2 transition-colors focus-within:border-blue-600">
          <FlagEG />
          <span className="flex shrink-0 items-center gap-0.5 text-xs text-gray-700">
            EG({COUNTRY_CODE})
            <ChevronsUpDown size={12} className="text-gray-500" />
          </span>
          <input
            id="profile-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-full min-w-0 flex-1 bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>
      </div>

      {saveError && <p className="text-xs text-red-600">{saveError}</p>}
      {saved && <p className="text-xs text-green-600">Changes saved.</p>}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          disabled={saving}
          className={dangerButton}
        >
          Delete My Account
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={primaryButton}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <ChangeEmailModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onDone={(newEmail) => setEmail(newEmail)}
      />
      <DeleteAccountModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}