import Link from "next/link";
import { Plus } from "lucide-react";

import type { ExamQuestion } from "@/features/main/apis/exam.api";
import { QuestionRowActions } from "./question-row-actions";
import { SortMenu, type SortOption } from "../sort-menu";

const sortOptions: SortOption[] = [
  { label: "Title", order: "desc", kind: "text", params: { qsort: "desc" } },
  { label: "Title", order: "asc", kind: "text", params: { qsort: "asc" } },
];

export function ExamQuestionsTable({
  questions,
  addHref,
  removeAction,
  sortable = false,
}: {
  questions: ExamQuestion[];
  addHref: string;
  removeAction: (questionId: string) => Promise<void>;
 
  sortable?: boolean;
}) {
  return (
    <section className="bg-white">
      <div className="flex items-center justify-between bg-blue-600 px-2.5 py-2.5 text-white">
        <h2 className="font-medium">Exam Questions</h2>
        <Link href={addHref} className="flex items-center gap-2 text-sm font-medium">
          <Plus className="size-4" /> Add Questions
        </Link>
      </div>

      <div className="flex items-center justify-between bg-gray-200 px-4 py-2.5 text-sm font-medium">
        <span>Title</span>
        {sortable && <SortMenu options={sortOptions} />}
      </div>

      {questions.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-gray-400">
          This exam has no questions yet.
        </p>
      )}

      {questions.map((q) => (
        <div
          key={q.id}
          className="flex items-center justify-between gap-4 border-b px-4 py-2.5 text-sm hover:bg-gray-50"
        >
          <span className="min-w-0 truncate">{q.title}</span>
          <QuestionRowActions questionId={q.id} removeAction={removeAction} />
        </div>
      ))}
    </section>
  );
}
