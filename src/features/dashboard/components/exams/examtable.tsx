import Link from "next/link";
import { ImageIcon } from "lucide-react";

import { ExamRowActions } from "./exam-row-actions";
import { SortMenu, type SortOption } from "../sort-menu";
import type { Exam } from "@/features/main/apis/exam.api";

const cols = "grid grid-cols-[100px_1fr_220px_160px_80px] items-center";

const sortOptions: SortOption[] = [
  { label: "Title", order: "desc", kind: "text", params: { sortBy: "title", sortOrder: "desc" } },
  { label: "Title", order: "asc", kind: "text", params: { sortBy: "title", sortOrder: "asc" } },
  { label: "Questions No.", order: "desc", kind: "number", params: { sortBy: "questionsCount", sortOrder: "desc" } },
  { label: "Questions No.", order: "asc", kind: "number", params: { sortBy: "questionsCount", sortOrder: "asc" } },
  { label: "Newest", order: "desc", kind: "date", params: { sortBy: "createdAt", sortOrder: "desc" } },
  { label: "Newest", order: "asc", kind: "date", params: { sortBy: "createdAt", sortOrder: "asc" } },
];

export function ExamsTable({
  items,
  removeAction,
}: {
  items: Exam[];
  removeAction: (id: string) => Promise<void>;
}) {
  return (
    <div className="bg-white">
      <div className={`${cols} bg-blue-600 px-4 py-2.5 text-sm font-medium text-white`}>
        <span>Image</span>
        <span>Title</span>
        <span>Diploma</span>
        <span>No. of Questions</span>
        <div className="flex justify-end">
          <SortMenu options={sortOptions} />
        </div>
      </div>

      {items.length === 0 && (
        <p className="px-4 py-10 text-center text-sm text-gray-400">No exams found.</p>
      )}

      {items.map((exam) => (
        <div key={exam.id} className={`${cols} border-b px-4 py-2.5 text-sm hover:bg-gray-50`}>
          {exam.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={exam.image} alt={exam.title} className="h-20 w-17.5 object-cover" />
          ) : (
            <div className="flex h-20 w-17.5 items-center justify-center bg-gray-100">
              <ImageIcon className="size-6 text-gray-300" />
            </div>
          )}

          <Link href={`/dashboard/exams/${exam.id}`} title={exam.title} className="truncate pr-4">
            {exam.title}
          </Link>

          <span title={exam.diploma?.title} className="truncate pr-4">
            {exam.diploma?.title}
          </span>

          <span>{exam.questionsCount}</span>

          <div className="flex justify-end">
            <div className="mr-6">
            <ExamRowActions id={exam.id} removeAction={removeAction} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}