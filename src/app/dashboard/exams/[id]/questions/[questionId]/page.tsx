import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Ban, ExternalLink, Pencil } from "lucide-react";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { DeleteConfirmationModal } from "@/shared/components/ui/delete-confirmation-modal";
import { deleteQuestion, getQuestion } from "@/features/main/apis/question.api";

export default async function QuestionViewPage({
  params,
}: {
  params: Promise<{ id: string; questionId: string }>;
}) {
  const { id, questionId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");
  const question = await getQuestion(session.token, questionId);
  if (!question) notFound();

  const examTitle = question.exam?.title ?? "Exam";

  async function removeQuestion() {

    const session = await getServerSession(authOptions);
    if (!session?.token) redirect("/login");
    await deleteQuestion(session.token, questionId);
    redirect(`/dashboard/exams/${id}`);
  }

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Exams", href: "/dashboard/exams" },
          { label: examTitle, href: `/dashboard/exams/${id}` },
          { label: "Questions", href: `/dashboard/exams/${id}` },
          { label: question.text },
        ]}
        title={question.text}
        subtitle={
          <>
            Exam:{" "}
            <Link
              href={`/dashboard/exams/${id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 underline"
            >
              {examTitle} <ExternalLink className="size-3.5" />
            </Link>
          </>
        }
      >
        {question.immutable ? (
          <button disabled className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
            <Ban className="size-4" /> Immutable
          </button>
        ) : (
          <>
            <Link
              href={`/dashboard/exams/${id}/questions/${questionId}/edit`}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2.5 text-sm text-white"
            >
              <Pencil className="size-4" /> Edit
            </Link>
            <DeleteConfirmationModal
              action={removeQuestion}
              actionArgs={[]}
              title="Delete this question?"
              description="This action is permanent and cannot be undone."
            />
          </>
        )}
      </PageHeader>

      <div className="p-6">
        <dl className="space-y-4 bg-white p-4 text-sm">
          <div>
            <dt className="mb-1 text-gray-400">Headline</dt>
            <dd>{question.text}</dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Exam</dt>
            <dd>
              <Link
                href={`/dashboard/exams/${id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 underline"
              >
                {examTitle} <ExternalLink className="size-3.5" />
              </Link>
            </dd>
          </div>
          <div>
            <dt className="mb-1 text-gray-400">Answers</dt>
            <dd>{question.answers.length}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}