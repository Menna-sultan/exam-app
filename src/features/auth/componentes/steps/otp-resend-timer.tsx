"use client";

import { IExam, IQuestion } from "@/shared/types/exam";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import { Progress } from "@/shared/components/ui/progress";
import { Button } from "@/shared/components/ui/button";
import {
  submitExam,
  type Submission,
  type SubmissionAnalytics,
} from "@/features/main/apis/submissions.api";
import { ResultsView } from "@/features/main/components/exams/quiz/results-view";

// Fallback duration (in minutes) if the exam object doesn't provide one.
const DEFAULT_DURATION_MINUTES = 30;

function timerKey(examId: string) {
  return `exam-${examId}-end-time`;
}

export function QuizFlow({
  exam,
  questions,
}: {
  exam: IExam;
  questions: IQuestion[];
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

  // ---- Timer ----
  const durationSeconds =
    (typeof exam?.duration === "number" ? exam.duration * 60 : null) ??
    DEFAULT_DURATION_MINUTES * 60;

  const finishedRef = useRef(false); // guards against double-submit
  const submittingRef = useRef(false);

  // Reads/creates the end-time in localStorage so the countdown survives
  // refreshes and isn't affected by tab throttling.
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

  // The API doesn't reveal the correct answers to a normal user, so the quiz
  // can't be graded in the browser: send the answers up and show what comes back.
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
      finishedRef.current = false; // allow retry on failure
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  // Ticks every second, but the actual remaining time is always derived
  // from the fixed end-time, not from decrementing a counter.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div>
      <div className="mb-5 flex items-center justify-between text-xs text-gray-400">
        <span>
          Frontend Development ·{" "}
          <span className="text-gray-600">{examTitle.replace(" Exam", " Quiz")}</span>
        </span>
        <span>
          Question <span className="font-semibold text-gray-700">{index + 1}</span> of{" "}
          {questions.length}
        </span>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Progress value={progress} className="flex-1" />
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold ${
            timeLow
              ? "border-red-500 text-red-600 animate-pulse"
              : "border-blue-500 text-blue-600"
          }`}
        >
          {String(minutesDisplay).padStart(2, "0")}:
          {String(secondsDisplay).padStart(2, "0")}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {question.prompt}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => {
          const selected = answers[question.id] === option.id;
          return (
            <button
              key={option.id}
              onClick={() => selectOption(option.id)}
              disabled={submitting}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors ${
                selected
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-100 bg-gray-50/60 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  selected ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {selected && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
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

      <div className="mt-8 flex items-center justify-between">
        <Button
          variant="outline"
          disabled={index === 0 || submitting}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          Previous
        </Button>
        <Button disabled={!answers[question.id] || submitting} onClick={goNext}>
          {submitting
            ? "Submitting..."
            : `${index === questions.length - 1 ? "Finish" : "Next"} →`}
        </Button>
      </div>
    </div>
  );
}