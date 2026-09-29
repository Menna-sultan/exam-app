"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { IDiploma } from "@/shared/types/diploma";
import { DiplomaCard } from "./diploma-card";
import { cn } from "@/shared/lib/utils/tailwind-cn";

function collapsedVisibility(index: number) {
  return cn(
    index >= 2 ? "hidden" : "block",
    index >= 4 ? "sm:hidden" : "sm:block",
    index >= 8 ? "lg:hidden" : "lg:block"
  );
}

export function DiplomaGrid({ diplomas }: { diplomas: IDiploma[] }) {
  const [expanded, setExpanded] = useState(false);


  const hasMoreClass = cn(
    diplomas.length > 2 ? "flex" : "hidden",
    diplomas.length > 4 ? "sm:flex" : "sm:hidden",
    diplomas.length > 8 ? "lg:flex" : "lg:hidden"
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {diplomas.map((diploma, index) => (
          <div key={diploma.id} className={expanded ? "block" : collapsedVisibility(index)}>
            <DiplomaCard diploma={diploma} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={cn(
          "mx-auto mt-6 flex-col items-center gap-1 text-gray-400 transition-colors hover:text-gray-600",
          hasMoreClass
        )}
      >
        {expanded ? (
          <>
            <ChevronUp size={14} />
            <span className="text-center text-base">view less</span>
          </>
        ) : (
          <>
            <span className="text-center text-base">Scroll to view more</span>
            <ChevronDown size={14} />
          </>
        )}
      </button>

    </div>
  );
}