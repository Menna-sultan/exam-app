"use client";

import { IExam, IQuestion } from "@/shared/types/exam";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ResultsView } from "./results-view";
import { Button } from "@/shared/components/ui/button";
import {
  submitExam,
  type Submission,
  type SubmissionAnalytics,
} from "@/features/main/apis/submissions.api";

const DEFAULT_DURATION_MINUTES = 30;
const TIMER_RADIUS = 17;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * TIMER_RADIUS;

function timerKey(examId: string) {
  return `exam-${examId}-end-time`;
}

export function QuizFlow({
  exam,
  questions,
  diplomaTitle,
}: {
  exam: IExam;
  questions: IQuestion[];
  diplomaTitle?: string;
}) {
  const { data: session } = useSession();
  const token = session?.token;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{
    submission: Submission;
    analytics: SubmissionAnalytics[];
  } | null>(null);

  const durationSeconds =
    (typeof exam?.duration === "number" ? exam.duration * 60 : null) ??
    DEFAULT_DURATION_MINUTES * 60;

  const finishedRef = useRef(false);
  const submittingRef = useRef(false);

  const getOrCreateEndTime = useCallback(() => {
    if (typeof window === "undefined") return Date.now() + durationSeconds * 1000;
    const key = timerKey(exam.id);
    const stored = window.localStorage.getItem(key);
    if (stored) return Number(stored);

    const endTime = Date.now() + durationSeconds * 1000;
    window.localStorage.setItem(key, endTime.toString());
    return endTime;
  }, [exam.id, durationSeconds]);

  const calculateRemaining = useCallback(() => {
    if (typeof window === "undefined") return durationSeconds;
    const endTime = getOrCreateEndTime();
    return Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
  }, [getOrCreateEndTime, durationSeconds]);

  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  const question = questions[index];
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;
  const examTitle = typeof exam?.title === "string" && exam.title ? exam.title : "Exam";

  function selectOption(optionId: string) {
    if (!question || finishedRef.current) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  async function finish() {
    if (finishedRef.current || submittingRef.current) return;
    if (!token) {
      setSubmitError("You must be signed in to submit the exam");
      return;
    }
    finishedRef.current = true;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = await submitExam(token, {
        examId: exam.id,
        answers: questions
          .filter((q) => answers[q.id])
          .map((q) => ({ questionId: q.id, answerId: answers[q.id] })),
        startedAt,
      });
      window.localStorage.removeItem(timerKey(exam.id));
      setResult(payload);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit exam"
      );
      finishedRef.current = false;
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (result) return;

    setSecondsLeft(calculateRemaining());

    const id = window.setInterval(() => {
      const remaining = calculateRemaining();
      setSecondsLeft(remaining);
      if (remaining <= 0) {
        window.clearInterval(id);
        void finish();
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [result, calculateRemaining]);

  function goNext() {
    if (index === questions.length - 1) {
      void finish();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function restart() {
    window.localStorage.removeItem(timerKey(exam.id));
    setAnswers({});
    setIndex(0);
    setResult(null);
    setSubmitError("");
    setStartedAt(new Date().toISOString());
    finishedRef.current = false;
    setSecondsLeft(durationSeconds);
  }

  if (result) {
    return (
      <ResultsView
        exam={exam}
        questions={questions}
        answers={answers}
        submission={result.submission}
        analytics={result.analytics}
        onRestart={restart}
      />
    );
  }

  if (!question) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        No questions available for this exam.
      </div>
    );
  }

  const minutesDisplay = Math.floor(secondsLeft / 60);
  const secondsDisplay = secondsLeft % 60;
  const timeLow = secondsLeft <= 60;
  const timeFraction = durationSeconds > 0 ? secondsLeft / durationSeconds : 0;
  const dashOffset = TIMER_CIRCUMFERENCE * (1 - timeFraction);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 font-mono shadow-sm">
    <div className="mb-3 flex items-center justify-between text-sm text-gray-700">
  <span>
    {diplomaTitle ?? "Diploma"} - {examTitle.replace(" Exam", " Quiz")}
  </span>
  <span className="text-gray-500">
    Question <span className="font-semibold text-blue-600">{index + 1}</span> of{" "}
    {questions.length}
  </span>
</div>

<div className="mb-8 flex items-center gap-4">
  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
    <div
      className="h-full rounded-full bg-blue-600 transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>

  <div className="h-8 w-px shrink-0 bg-gray-200" />

  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
    <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
      <circle
        cx="20"
        cy="20"
        r={TIMER_RADIUS}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r={TIMER_RADIUS}
        fill="none"
        stroke={timeLow ? "#EF4444" : "#155DFC"}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={TIMER_CIRCUMFERENCE}
        strokeDashoffset={dashOffset}
        className="transition-[stroke-dashoffset] duration-1000 ease-linear"
      />
    </svg>
    <span
      className={`text-xs font-semibold ${
        timeLow ? "animate-pulse text-red-600" : "text-blue-600"
      }`}
    >
      {String(minutesDisplay).padStart(2, "0")}:
      {String(secondsDisplay).padStart(2, "0")}
    </span>
  </div>
</div>

      <h2 className="mb-4 text-xl font-bold text-blue-600">
        {question.prompt}
      </h2>

      <div className="space-y-4 ">
        {question.options.map((option) => {
          const selected = answers[question.id] === option.id;
          return (
            <button
              key={option.id}
              onClick={() => selectOption(option.id)}
              disabled={submitting}
              className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                selected
                  ? "border-blue-200 bg-blue-50 text-gray-900"
                  : "border-transparent bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? "border-blue-600" : "border-gray-300"
                }`}
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>

      {submitError && (
        <p className="mt-4 text-sm text-red-500">{submitError}</p>
      )}

      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          disabled={index === 0 || submitting}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="flex-1 gap-1 rounded-lg border-none bg-gray-100 font-mono text-gray-400 hover:bg-gray-200 disabled:opacity-100"
        >
          ‹ Previous
        </Button>
        <Button
          disabled={!answers[question.id] || submitting}
          onClick={goNext}
          className="flex-1 gap-1 rounded-lg bg-blue-600 font-mono hover:bg-blue-700"
        >
          {submitting
            ? "Submitting..."
            : `${index === questions.length - 1 ? "Finish" : "Next"} ›`}
        </Button>
      </div>
    </div>
  );
}