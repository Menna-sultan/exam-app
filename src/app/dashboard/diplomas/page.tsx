import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Plus } from "lucide-react";
import { deleteDiploma, getDiplomas } from "@/features/main/apis/diploma.api";
import { Pagination } from "@/features/dashboard/components/pagination";
import { DiplomasFilters } from "@/features/dashboard/components/diplomas/diplomas-filters";
import { DiplomasTable } from "@/features/dashboard/components/diplomas/diplomas-table";
import type { Diploma } from "@/features/main/apis/diploma.api";

const SORT_FIELDS = ["title", "createdAt"] as const;

function sortDiplomas(
  items: Diploma[],
  sortBy?: (typeof SORT_FIELDS)[number],
  sortOrder?: "asc" | "desc"
) {
  if (!sortBy || !sortOrder) return items;

  const direction = sortOrder === "asc" ? 1 : -1;
  return [...items].sort((first, second) => {
    const result =
      sortBy === "title"
        ? first.title.localeCompare(second.title)
        : new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime();

    return result * direction;
  });
}

export default async function DiplomasPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    immutable?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const {
    page = "1",
    q = "",
    immutable: immutableParam,
    sortBy: sortByParam,
    sortOrder: sortOrderParam,
  } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);
  const sortBy = SORT_FIELDS.find((field) => field === sortByParam);
  const sortOrder =
    sortOrderParam === "asc" || sortOrderParam === "desc" ? sortOrderParam : undefined;
  const immutable =
    immutableParam === "true" ? true : immutableParam === "false" ? false : undefined;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  async function removeDiploma(id: string) {
  
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteDiploma(session.token, id);
    revalidatePath("/dashboard/diplomas");
  }

  const diplomaFilters = { search: q, immutable, limit: 20 };
  const firstPage = await getDiplomas(session.token, { page: sortBy ? 1 : currentPage, ...diplomaFilters });
  const fetchedItems =
    sortBy && firstPage.metadata.totalPages > 1
      ? (
          await Promise.all(
            Array.from({ length: firstPage.metadata.totalPages - 1 }, (_, index) =>
              getDiplomas(session.token, { page: index + 2, ...diplomaFilters })
            )
          )
        ).reduce((all, result) => all.concat(result.data), firstPage.data)
      : firstPage.data;
  const sortedItems = sortDiplomas(fetchedItems, sortBy, sortOrder);
  const items = sortBy
    ? sortedItems.slice((currentPage - 1) * 20, currentPage * 20)
    : sortedItems;
  const { total, totalPages: pages } = firstPage.metadata;
  const query: Record<string, string> = {};
  if (q) query.q = q;
  if (immutableParam) query.immutable = immutableParam;
  if (sortBy) query.sortBy = sortBy;
  if (sortOrder) query.sortOrder = sortOrder;

  return (
    <>
      <div className="bg-white">
        <div className="border-b px-4 py-4 text-xs text-gray-400">Diplomas</div>
        <div className="flex items-center justify-between px-6 py-4">
          <Pagination page={currentPage} pages={pages} total={total} pageSize={20} query={query} />
          <Link
            href="/dashboard/diplomas/new"
            className="flex items-center gap-2 bg-emerald-500 px-6 py-3 text-sm font-medium text-white"
          >
            <Plus className="size-4" /> Add New Diploma
          </Link>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <DiplomasFilters defaults={{ q, immutable: immutableParam, sortBy, sortOrder }} />
        <DiplomasTable items={items} removeAction={removeDiploma} />
      </div>
    </>
  );
}