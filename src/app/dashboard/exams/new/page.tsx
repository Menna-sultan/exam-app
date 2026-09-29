import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { Save, X } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components/page-header";

import {
  createExam as createExamRequest,
  examInputFromForm,
  getDiplomaOptions,
} from "@/features/main/apis/exam.api";
import { ExamForm } from "@/features/dashboard/components/exams/examform";

async function createExam(formData: FormData) {
 const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  await createExamRequest(session.token, await examInputFromForm(session.token, formData));
  redirect("/dashboard/exams");
}

export default async function NewExamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const diplomas = await getDiplomaOptions(session.token);

  return (
    <>
      <PageHeader crumbs={[{ label: "Exams", href: "/dashboard/exams" }, { label: "Add New Exam" }]}> 
        <Link href="/dashboard/exams" className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
          <X className="size-4" /> Cancel
        </Link>
        <button form="exam-form" className="flex items-center gap-2 bg-emerald-500 px-4 py-2.5 text-sm text-white">
          <Save className="size-4" /> Save
        </button>
      </PageHeader>
      <div className="p-6">
        <ExamForm diplomas={diplomas} action={createExam} />
      </div>
    </>
  );
}