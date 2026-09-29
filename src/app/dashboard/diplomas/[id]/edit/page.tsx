import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Save, X } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { DiplomaForm } from "@/features/dashboard/components/diplomas/diploma-form";
import { getDiploma, updateDiploma as updateDiplomaRequest } from "@/features/main/apis/diploma.api";
import { uploadImage } from "@/features/main/apis/upload.api";

export default async function EditDiplomaPage({
  params,
}: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const diploma = await getDiploma(session.token, id);
  if (!diploma) notFound();

  async function updateDiploma(formData: FormData) {
  
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    const imageFile = formData.get("image");
    const image = imageFile instanceof File && imageFile.size > 0
      ? (await uploadImage(session.token, imageFile)).url
      : undefined;
    await updateDiplomaRequest(session.token, id, {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      ...(image ? { image } : {}),
    });
    redirect(`/dashboard/diplomas/${id}`);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Diplomas", href: "/dashboard/diplomas" },
          { label: diploma.title, href: `/dashboard/diplomas/${id}` },
          { label: "Edit" },
        ]}
      >
        <Link href={`/dashboard/diplomas/${id}`} className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
          <X className="size-4" /> Cancel
        </Link>
        <button form="diploma-form" className="flex items-center gap-2 bg-emerald-500 px-4 py-2.5 text-sm text-white">
          <Save className="size-4" /> Save
        </button>
      </PageHeader>
      <div className="p-6"><DiplomaForm diploma={diploma} action={updateDiploma} /></div>
    </>
  );
}