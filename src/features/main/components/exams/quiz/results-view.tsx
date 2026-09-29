"use client";

import { IExam, IQuestion } from "@/shared/types/exam";
import { FolderOpen, RotateCcw } from "lucide-react";
import { ResultsDonut } from "./results-donut";
import { Button } from "@/shared/components/ui/button";
import type {
  Submission,
  SubmissionAnalytics,
} from "@/features/main/apis/submissions.api";

export function ResultsView({
  exam,
  questions,
  answers,
  submission,
  analytics,
  diplomaTitle,
  onRestart,
}: {
  exam: IExam;
  questions: IQuestion[];
  answers: Record<string, string>;
  submission: Submission;
  analytics: SubmissionAnalytics[];
  diplomaTitle?: string;
  onRestart: () => void;
}) {
  const currentSubmission = submission ?? {
    id: "",
    examId: exam?.id ?? "",
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  };
  const totalQuestions = Number(
    currentSubmission.totalQuestions ?? questions.length ?? 0
  );
  const correctCount = Number(currentSubmission.correctAnswers ?? 0);
  const incorrectCount = Number(currentSubmission.wrongAnswers ?? 0);
  const examTitle =
    typeof exam?.title === "string" && exam.title ? exam.title : "Exam";

  // questionId -> id of the correct answer, as graded by the server.
  const correctByQuestion = new Map(
    Array.isArray(analytics)
      ? analytics.map((a) => {
          const correctAnswer = a.correctAnswer as { id?: string } | null | undefined;
          return [a.questionId, correctAnswer?.id];
        })
      : []
  );

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 font-mono shadow-sm">
      {/* Header: title + question counter */}
      <div className="mb-3 flex items-center justify-between text-sm text-gray-700">
        <span>
          {diplomaTitle ?? "Diploma"} - {examTitle.replace(" Exam", " Quiz")}
        </span>
        <span className="text-gray-500">
          Question{" "}
          <span className="font-semibold text-blue-600">{questions.length}</span>{" "}
          of {questions.length}
        </span>
      </div>

      {/* Full progress bar */}
      <div className="mb-8 h-2 overflow-hidden rounded-full bg-gray-100">
        <div className="h-full w-full rounded-full bg-blue-600" />
      </div>

      <h2 className="mb-4 text-xl font-bold text-blue-600">Results:</h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2.5fr]">
        {/* Left: donut + legend */}
        <div className="flex min-h-65 flex-col items-center justify-center gap-6 border border-blue-100 bg-blue-50 p-5">
          <ResultsDonut correct={correctCount} total={totalQuestions} />
          <div className="flex flex-col gap-2 text-xs text-gray-700">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 bg-emerald-500" />
              Correct: {correctCount}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 bg-red-500" />
              Incorrect: {incorrectCount}
            </span>
          </div>
        </div>

        {/* Right: recap (only the chosen answer + the correct answer) */}
        <div className="max-h-105 space-y-5 overflow-y-auto border border-dashed border-gray-200 p-3">
          {questions.map((q) => {
            const chosen = answers[q.id];
            const correctId = correctByQuestion.get(q.id);

            return (
              <div key={q.id}>
                <p className="mb-2 text-sm font-bold text-blue-600">
                  {q.prompt ?? "Question"}
                </p>
                <div className="space-y-2">
                  {(q.options ?? [])
                    .filter((opt) => opt.id === chosen || opt.id === correctId)
                    .map((opt) => {
                      const isChosen = opt.id === chosen;
                      const isAnswer = opt.id === correctId;

                      return (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-3 px-4 py-3 text-xs text-gray-700 ${
                            isAnswer ? "bg-emerald-50" : "bg-red-50"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                              isAnswer ? "border-emerald-500" : "border-red-500"
                            }`}
                          >
                            {isChosen && (
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isAnswer ? "bg-emerald-500" : "bg-red-500"
                                }`}
                              />
                            )}
                          </span>
                          {opt.label ?? "Option"}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onRestart}
          className="flex-1 gap-2 rounded-none border-none bg-gray-200 font-mono text-gray-700 hover:bg-gray-300"
        >
          <RotateCcw size={14} /> Restart
        </Button>
        <Button className="flex-1 gap-2 rounded-none bg-blue-600 font-mono hover:bg-blue-700">
          <FolderOpen size={14} /> Explore
        </Button>
      </div>
    </div>
  );
}