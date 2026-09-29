import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BookOpenCheck } from "lucide-react";

import { authOptions } from "@/auth";
import {
  Breadcrumb,
  PageHeader,
} from "@/features/main/components/layout/page-header";
import { ExamList } from "@/features/main/components/exams/exam-list";
import { getExams } from "@/features/main/apis/exam.api";
import { getDiploma } from "@/features/main/apis/diploma.api";

export default async function DiplomaExamsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  const [examsResponse, diploma] = await Promise.all([
    getExams(session.token, { diplomaId: id }),
    getDiploma(session.token, id).catch(() => null),
  ]);

  const exams = Array.isArray(examsResponse?.data) ? examsResponse.data : [];

  return (
    <div>
      <Breadcrumb items={["Diplomas", diploma?.title ?? "..."]} />

      <PageHeader
        icon={BookOpenCheck}
        title={diploma?.title ?? "Exams"}
        backHref="/diplomas"
      />

      {exams.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          No exams found for this diploma.
        </p>
      ) : (
        <div className="mx-6">
          <ExamList exams={exams} />
        </div>
      )}
    </div>
  );
}