import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Ban, ImageIcon, Pencil } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";
import { ExamQuestionsTable } from "@/features/dashboard/components/questions/exam-questions-table";
import {
  deleteExam,
  getExam,
  getExamQuestions,
} from "@/features/main/apis/exam.api";
import { deleteQuestion } from "@/features/main/apis/question.api";
import { ExamDiplomaLink } from "@/features/dashboard/components/exams/exam-diploma-link";

export default async function ExamViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ qsort?: string }>;
}) {
  const { id } = await params;
  const { qsort } = await searchParams;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const [exam, examQuestions] = await Promise.all([
    getExam(session.token, id),
    getExamQuestions(session.token, id),
  ]);
  if (!exam) notFound();

  async function removeExam(id: string) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteExam(session.token, id);
    redirect("/dashboard/exams");
  }

  async function removeQuestion(questionId: string) {
    "use server";
    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteQuestion(session.token, questionId);
    revalidatePath(`/dashboard/exams/${id}`);
  }

  const dir = qsort === "asc" ? 1 : qsort === "desc" ? -1 : 0;
  const questions = [...examQuestions];
  if (dir) questions.sort((a, b) => a.text.localeCompare(b.text) * dir);

  return (
    <>
      <PageHeader
        crumbs={[{ label: "Exams", href: "/dashboard/exams" }, { label: exam.title }]}
        title={exam.title}
        subtitle={
          <>
            Diploma: <ExamDiplomaLink diploma={exam.diploma} className="underline" />
          </>
        }
      >
        <button disabled className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
          <Ban className="size-4" /> Immutable
        </button>
        <Link href={`/dashboard/exams/${id}/edit`} className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 text-sm text-white">
          <Pencil className="size-4" /> Edit
        </Link>
        <DeleteConfirmationModal
          action={removeExam}
          actionArgs={[id]}
          title="Delete this exam?"
          description="This action is permanent and cannot be undone."
        />
      </PageHeader>

      <div className="space-y-6 p-6">
        <dl className="space-y-4 bg-white p-4 text-sm">
          <div>
            <dt className="mb-1 text-gray-400">Image</dt>
            <dd>
              {exam.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={exam.image} alt="" className="size-75 object-cover" />
              ) : (
                <div className="flex size-75 items-center justify-center bg-gray-100">
                  <ImageIcon className="size-12 text-gray-300" />
                </div>
              )}
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Title</dt>
            <dd>{exam.title}</dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Description</dt>
            <dd className="leading-6">{exam.description}</dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Diploma</dt>
            <dd><ExamDiplomaLink diploma={exam.diploma} /></dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Duration</dt>
            <dd>{exam.duration} Minutes</dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">No. of Questions</dt>
            <dd>{exam.questionsCount}</dd>
          </div>
        </dl>

        <ExamQuestionsTable
          examId={id}
          questions={questions}
          addHref={`/dashboard/exams/${id}/questions/add`}
          removeAction={removeQuestion}
          sortable
        />
      </div>
    </>
  );
}