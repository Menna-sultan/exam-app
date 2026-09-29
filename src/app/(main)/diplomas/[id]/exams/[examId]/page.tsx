import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { HelpCircle } from "lucide-react";

import { authOptions } from "@/auth";
import {
  Breadcrumb,
  PageHeader,
} from "@/features/main/components/layout/page-header";
import { QuizFlow } from "@/features/main/components/exams/quiz/quiz-flow";
import { getExam } from "@/features/main/apis/exam.api";
import { getQuestionsByExam } from "@/features/main/apis/question.api";
import { getDiploma } from "@/features/main/apis/diploma.api";
import type { IQuestion } from "@/shared/types/exam";

export default async function ExamQuizPage({
  params,
}: {
  params: Promise<{ id: string; examId: string }>;
}) {
  const { id, examId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  const [exam, questionsList, diploma] = await Promise.all([
    getExam(session.token, examId),
    getQuestionsByExam(session.token, examId),
    getDiploma(session.token, id).catch(() => null),
  ]);

  const questions = (questionsList ?? []).map(
    (question): IQuestion => ({
      id: question.id,
      prompt: question.text,
      options: question.answers.map((answer) => ({
        id: answer.id ?? `${question.id}-${answer.text}`,
        label: answer.text,
      })),
    })
  );

  return (
    <div>
      <Breadcrumb items={["Diplomas", diploma?.title ?? "Exams", exam.title]} />
      <PageHeader
        icon={HelpCircle}
        title={`${exam.title} Questions`}
        backHref={`/diplomas/${id}`}
      />

      {questions.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-400">
          This exam has no questions yet.
        </p>
      ) : (
        <div className="p-6">
          <QuizFlow
            exam={exam}
            questions={questions}
            diplomaTitle={diploma?.title}
          />
        </div>
      )}
    </div>
  );
}