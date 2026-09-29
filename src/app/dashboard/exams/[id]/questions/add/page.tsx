import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { QuestionForm } from "@/features/dashboard/components/questions/question-form";
import { getExam } from "@/features/main/apis/exam.api";
import {
  createQuestionsBulk,
  getExamOptions,
  type QuestionDraftInput,
} from "@/features/main/apis/question.api";

export default async function AddQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const [exam, examOptions] = await Promise.all([
    getExam(session.token, id),
    getExamOptions(session.token),
  ]);
  if (!exam) notFound();

  async function saveQuestions(selectedExamId: string, payloads: QuestionDraftInput[]) {

    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await createQuestionsBulk(session.token, selectedExamId, payloads);
    redirect(`/dashboard/exams/${selectedExamId}`);
  }

  return (
    <>
      <PageHeader crumbs={[{ label: "Exams", href: "/dashboard/exams" }, { label: "Create New Question" }]} />
      <QuestionForm
        mode="add"
        examId={id}
        examOptions={examOptions}
        cancelHref={`/dashboard/exams/${id}`}
        action={saveQuestions}
      />
    </>
  );
}