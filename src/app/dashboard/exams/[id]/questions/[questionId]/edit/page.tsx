import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { QuestionForm } from "@/features/dashboard/components/questions/question-form";
import {
  getExamOptions,
  getQuestion,
  updateQuestion,
  type QuestionDraftInput,
} from "@/features/main/apis/question.api";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string; questionId: string }>;
}) {
  const { id, questionId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const [question, examOptions] = await Promise.all([
    getQuestion(session.token, questionId),
    getExamOptions(session.token),
  ]);
  if (!question) notFound();

  async function saveQuestion(_examId: string, payloads: QuestionDraftInput[]) {
    "use server";
    // The API doesn't let an update move a question to a different exam,
    // so the exam picked in the form (_examId) is ignored here.
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await updateQuestion(session.token, questionId, payloads[0]);
    redirect(`/dashboard/exams/${id}/questions/${questionId}`);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Exams", href: "/dashboard/exams" },
          { label: question.exam?.title ?? "Exam", href: `/dashboard/exams/${id}` },
          { label: question.text, href: `/dashboard/exams/${id}/questions/${questionId}` },
          { label: "Edit" },
        ]}
      />
      <QuestionForm
        mode="edit"
        examId={id}
        examOptions={examOptions}
        question={question}
        cancelHref={`/dashboard/exams/${id}/questions/${questionId}`}
        action={saveQuestion}
      />
    </>
  );
}