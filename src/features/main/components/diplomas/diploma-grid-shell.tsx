"use client";

import { useEffect, useState } from "react";

import { getDiplomas } from "@/features/main/apis/diploma.api";
import type { IDiploma } from "@/shared/types/diploma";
import { DiplomaGrid } from "@/features/main/components/diplomas/diploma-grid";
import { DiplomaPageSkeleton } from "@/features/main/components/diplomas/skeleton/diploma-page-skeleton";

export function DiplomaGridShell({ token }: { token: string }) {
  const [diplomas, setDiplomas] = useState<IDiploma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await getDiplomas(token);
        if (!cancelled) {
          setDiplomas(result.data ?? []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return <DiplomaPageSkeleton />;
  }

  return <DiplomaGrid diplomas={diplomas} />;
}
