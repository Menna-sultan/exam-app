import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Ban, Pencil } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { getDiploma, deleteDiploma } from "@/features/main/apis/diploma.api";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";

export default async function DiplomaViewPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const diploma = await getDiploma(session.token, id);
  if (!diploma) notFound();

  async function removeDiploma(id: string) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteDiploma(session.token, id);
    redirect("/dashboard/diplomas");
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Diplomas", href: "/dashboard/diplomas" }, { label: diploma.title }]}
        title={diploma.title}
      >
        <button disabled className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
          <Ban className="size-4" /> Immutable
        </button>
        <Link href={`/dashboard/diplomas/${id}/edit`} className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 text-sm text-white">
          <Pencil className="size-4" /> Edit
        </Link>
        <DeleteConfirmationModal
          action={removeDiploma}
          actionArgs={[id]}
          title="Delete this diploma?"
          description="This action is permanent and cannot be undone."
        />
      </PageHeader>

      <div className="p-6">
        <dl className="space-y-4 bg-white p-4 text-sm">
          <div>
            <dt className="mb-1 text-gray-400">Image</dt>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <dd><img src={diploma.image ?? ""} alt="" className="size-75 object-cover" /></dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Title</dt>
            <dd>{diploma.title}</dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Description</dt>
            <dd className="leading-6">{diploma.description}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}