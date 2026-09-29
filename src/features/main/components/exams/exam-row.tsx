"use client";

import { IExam } from "@/shared/types/exam";
import { ArrowRight, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/shared/lib/utils/tailwind-cn";
import { Button } from "@/shared/components/ui/button";

export function ExamRow({ exam }: { exam: IExam }) {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [exam.description]);

  const href = `/diplomas/${exam.diplomaId}/exams/${exam.id}`;

  return (
    <div className="group flex gap-4 rounded-2xl bg-[#EFF6FF] p-4 transition-colors hover:bg-[#E5F0FF]">
      <Link href={href} className="shrink-0">
        <div className="flex size-25 items-center justify-center overflow-hidden border border-[#8EC5FF] bg-[#DBEAFE]">
          {exam.image ? (
            <Image
              src={exam.image}
              alt={exam.title}
              width={48}
              height={48}
              className="size-19 object-contain"
            />
          ) : (
            <HelpCircle size={40} className="text-[#1b7af4]" aria-hidden="true" />
          )}
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link href={href}>
            <p className="text-lg font-semibold text-[#1b7af4] hover:underline">
              {exam.title}
            </p>
          </Link>

          <div className="flex shrink-0 items-center gap-2 text-xs text-gray-400">
            <span className="flex items-center gap-1 text-[#1F2937]">
              <HelpCircle size={14} />
              {exam.questionsCount} Questions
            </span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1 text-[#1F2937]">
              <Clock size={14} />
              {exam.duration} minutes
            </span>
          </div>
        </div>

        <p
          ref={textRef}
          className={cn(
            "mt-1.5 text-sm leading-relaxed text-[#6B7280]",
            !expanded && "line-clamp-3"
          )}
        >
          {exam.description}
        </p>

        <div className="mt-2 flex items-end justify-between gap-2">
          {isOverflowing ? (
            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="text-sm font-semibold text-gray-900 hover:underline"
            >
              {expanded ? "See Less" : "See More"}
            </button>
          ) : (
            <span />
          )}

          <Link
            href={href}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Button
              size="sm"
              className="gap-1.5 bg-[#155DFC] px-4 font-semibold hover:bg-[#1249d6]"
            >
              START <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}