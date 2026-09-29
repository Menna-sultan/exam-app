import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { Save, X } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { DiplomaForm } from "@/features/dashboard/components/diplomas/diploma-form";
import { createDiploma as createDiplomaRequest } from "@/features/main/apis/diploma.api";
import { uploadImage } from "@/features/main/apis/upload.api";

async function createDiploma(formData: FormData) {
 
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const imageFile = formData.get("image");
  const image = imageFile instanceof File && imageFile.size > 0
    ? (await uploadImage(session.token, imageFile)).url
    : undefined;
  await createDiplomaRequest(session.token, {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    ...(image ? { image } : {}),
  });
  redirect("/dashboard/diplomas");
}

export default function NewDiplomaPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Diplomas", href: "/diplomas" }, { label: "Add New Diploma" }]}>
        <Link href="/dashboard/diplomas" className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
          <X className="size-4" /> Cancel
        </Link>
        <button form="diploma-form" className="flex items-center gap-2 bg-emerald-500 px-4 py-2.5 text-sm text-white">
          <Save className="size-4" /> Save
        </button>
      </PageHeader>
      <div className="p-6"><DiplomaForm action={createDiploma} /></div>
    </>
  );
}