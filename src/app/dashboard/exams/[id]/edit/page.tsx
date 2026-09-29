import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Save, X } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components/page-header";

import { ExamQuestionsTable } from "@/features/dashboard/components/questions/exam-questions-table";
import {
  examInputFromForm,
  getDiplomaOptions,
  getExam,
  getExamQuestions,
  updateExam as updateExamRequest,
} from "@/features/main/apis/exam.api";
import { deleteQuestion } from "@/features/main/apis/question.api";
import { ExamForm } from "@/features/dashboard/components/exams/examform";
import { ExamDiplomaLink } from "@/features/dashboard/components/exams/exam-diploma-link";

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const [exam, diplomas, questions] = await Promise.all([
    getExam(session.token, id),
    getDiplomaOptions(session.token),
    getExamQuestions(session.token, id),
  ]);
  if (!exam) notFound();

  async function updateExam(formData: FormData) {
   
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await updateExamRequest(session.token, id, await examInputFromForm(session.token, formData));
    redirect(`/dashboard/exams/${id}`);
  }

  async function removeQuestion(questionId: string) {

    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteQuestion(session.token, questionId);
    revalidatePath(`/dashboard/exams/${id}/edit`);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Exams", href: "/dashboard/exams" },
          { label: exam.title, href: `/dashboard/exams/${id}` },
          { label: "Edit" },
        ]}
        title={exam.title}
        subtitle={
          <>
            Diploma: <ExamDiplomaLink diploma={exam.diploma} className="underline" />
          </>
        }
      >
        <Link href={`/dashboard/exams/${id}`} className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
          <X className="size-4" /> Cancel
        </Link>
        <button form="exam-form" className="flex items-center gap-2 bg-emerald-500 px-4 py-2.5 text-sm text-white">
          <Save className="size-4" /> Save
        </button>
      </PageHeader>

      <div className="space-y-6 p-6">
        <ExamForm exam={exam} diplomas={diplomas} action={updateExam} />
        <ExamQuestionsTable
          examId={id}
          questions={questions}
          addHref={`/dashboard/exams/${id}/questions/add`}
          removeAction={removeQuestion}
        />
      </div>
    </>
  );
}