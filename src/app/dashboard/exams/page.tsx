import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Plus } from "lucide-react";
import { deleteExam, getDiplomaOptions, getExams } from "@/features/main/apis/exam.api";
import { Pagination } from "@/features/dashboard/components/pagination";
import { ExamsFilters } from "@/features/dashboard/components/exams/examsfilters";
import { ExamsTable } from "@/features/dashboard/components/exams/examtable";

const SORT_FIELDS = ["title", "questionsCount", "createdAt"] as const;

function sortExams<T extends { title: string; questionsCount: number; createdAt: string }>(
  items: T[],
  sortBy?: (typeof SORT_FIELDS)[number],
  sortOrder?: "asc" | "desc"
) {
  if (!sortBy || !sortOrder) return items;

  const direction = sortOrder === "asc" ? 1 : -1;
  return [...items].sort((first, second) => {
    const result =
      sortBy === "title"
        ? first.title.localeCompare(second.title)
        : sortBy === "questionsCount"
          ? first.questionsCount - second.questionsCount
          : new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();

    return result * direction;
  });
}

type SearchParams = {
  page?: string;
  q?: string;
  diplomaId?: string;
  immutable?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const sortBy = SORT_FIELDS.find((f) => f === sp.sortBy);
  const sortOrder =
    sp.sortOrder === "asc" || sp.sortOrder === "desc" ? sp.sortOrder : undefined;
  const immutable =
    sp.immutable === "true" ? true : sp.immutable === "false" ? false : undefined;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  async function removeExam(id: string) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteExam(session.token, id);
    revalidatePath("/dashboard/exams");
  }

  const examFilters = { search: sp.q, diplomaId: sp.diplomaId, immutable };
  const firstPage = await getExams(session.token, { page: sortBy ? 1 : page, ...examFilters });
  const fetchedItems =
    sortBy && firstPage.metadata.totalPages > 1
      ? (
          await Promise.all(
            Array.from({ length: firstPage.metadata.totalPages - 1 }, (_, index) =>
              getExams(session.token, { page: index + 2, ...examFilters })
            )
          )
        ).reduce((all, result) => all.concat(result.data), firstPage.data)
      : firstPage.data;
  const sortedItems = sortExams(fetchedItems, sortBy, sortOrder);
  const items = sortBy
    ? sortedItems.slice((page - 1) * 20, page * 20)
    : sortedItems;

  const [{ total, totalPages: pages }, diplomas] = await Promise.all([
    Promise.resolve(firstPage.metadata),
    getDiplomaOptions(session.token),
  ]);

  const defaults = {
    q: sp.q,
    diplomaId: sp.diplomaId,
    immutable: sp.immutable,
    sortBy,
    sortOrder,
  };
  // everything except `page`, so pagination keeps the filters and sort
  const query = Object.fromEntries(
    Object.entries(defaults).filter(([, v]) => v)
  ) as Record<string, string>;

  return (
    <>
      <div className="bg-white">
        <div className="border-b px-4 py-4 text-xs text-gray-400">Exams</div>
        <div className="flex items-center justify-between px-6 py-4">
          <Pagination
            page={page}
            pages={Math.max(pages, 1)}
            total={total}
            pageSize={20}
            query={query}
          />
          <Link
            href="/dashboard/exams/new"
            className="flex items-center gap-2 bg-emerald-500 px-6 py-3 text-sm font-medium text-white"
          >
            <Plus className="size-4" /> Create New Exam
          </Link>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <ExamsFilters diplomas={diplomas} defaults={defaults} />
        <ExamsTable items={items} removeAction={removeExam} />
      </div>
    </>
  );
}