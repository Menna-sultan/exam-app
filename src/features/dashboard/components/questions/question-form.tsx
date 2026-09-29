"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Check, ChevronDown, Copy, Plus, Save, Trash2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils/tailwind-cn";
import type { ExamOption, QuestionAnswer, QuestionDraftInput } from "@/features/main/apis/question.api";

type Draft = {
  key: string;
  headline: string;
  answers: QuestionAnswer[];
  newAnswerText: string;
};

const MAX_ANSWERS = 4;

let draftSeq = 0;
function newKey() {
  draftSeq += 1;
  return `draft-${draftSeq}`;
}

function emptyDraft(): Draft {
  return { key: newKey(), headline: "", answers: [], newAnswerText: "" };
}

const field =
  "w-full border bg-white px-3 py-3 text-sm outline-none focus:border-blue-600";
const label = "mb-2 block text-sm font-medium";

export function QuestionForm({
  mode,
  examId,
  examOptions,
  question,
  cancelHref,
  action,
}: {
  mode: "add" | "edit";
  /** Exam this page is nested under (used to preselect the Exam field). */
  examId: string;
  examOptions: ExamOption[];
  /** Present only in edit mode. */
  question?: {
    id: string;
    text: string;
    examId: string;
    answers: QuestionAnswer[];
  };
  cancelHref: string;
  /** examId is the single exam chosen in the form; payloads has no per-question examId. */
  action: (examId: string, payloads: QuestionDraftInput[]) => Promise<void>;
}) {
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(question?.examId || examId || "");
  const [drafts, setDrafts] = useState<Draft[]>([
    question
      ? { key: newKey(), headline: question.text, answers: question.answers, newAnswerText: "" }
      : emptyDraft(),
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const newAnswerRef = useRef<HTMLInputElement>(null);

  const active = drafts[activeTab] ?? drafts[0];

  function updateActiveDraft(patch: Partial<Draft>) {
    setDrafts((prev) => prev.map((d, i) => (i === activeTab ? { ...d, ...patch } : d)));
  }

  function addAnswer() {
    if (active.answers.length >= MAX_ANSWERS) return;
    const text = active.newAnswerText.trim();
    if (!text) {
      newAnswerRef.current?.focus();
      return;
    }
    updateActiveDraft({
      answers: [...active.answers, { text, isCorrect: active.answers.length === 0 }],
      newAnswerText: "",
    });
  }

  function removeAnswer(index: number) {
    const wasCorrect = active.answers[index]?.isCorrect;
    const remaining = active.answers.filter((_, i) => i !== index);
    // Keep the "exactly one correct answer" invariant: if we just removed the
    // correct one, promote the first remaining answer to correct.
    const answers =
      wasCorrect && remaining.length > 0
        ? remaining.map((a, i) => ({ ...a, isCorrect: i === 0 }))
        : remaining;
    updateActiveDraft({ answers });
  }

  function markCorrect(index: number) {
    updateActiveDraft({
      answers: active.answers.map((a, i) => ({ ...a, isCorrect: i === index })),
    });
  }

  function addTab() {
    setDrafts((prev) => [...prev, emptyDraft()]);
    setActiveTab(drafts.length);
  }

  function removeTab(index: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== index));
    setActiveTab((prev) => (index <= prev ? Math.max(0, prev - 1) : prev));
  }

  function toggleBulkMode() {
    setBulkMode((prev) => {
      const next = !prev;
      if (!next) {
        // Leaving bulk mode: keep only the question currently being edited.
        setDrafts((d) => [d[activeTab] ?? d[0]]);
        setActiveTab(0);
      }
      return next;
    });
  }

  const isDraftValid = (d: Draft) =>
    d.headline.trim().length > 0 &&
    d.answers.length >= 2 &&
    d.answers.some((a) => a.isCorrect);

  const canSave = Boolean(selectedExamId) && drafts.every(isDraftValid);

  async function handleSave() {
    if (!canSave) {
      setError("Pick an exam, and give every question a headline plus at least two answers with one marked correct.");
      return;
    }
    setError(null);
    const payloads: QuestionDraftInput[] = drafts.map((d) => ({
      text: d.headline.trim(),
      answers: d.answers.map((a) => ({ text: a.text, isCorrect: a.isCorrect })),
    }));

    setPending(true);
    try {
      await action(selectedExamId, payloads);
    } catch (err) {
      setPending(false);
      setError(err instanceof Error ? err.message : "Failed to save question");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          {mode === "add" && (
            <button
              type="button"
              onClick={toggleBulkMode}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm",
                bulkMode ? "bg-blue-600 text-white" : "bg-gray-200"
              )}
            >
              <Copy className="size-4" /> Bulk Add Mode
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link href={cancelHref} className="flex items-center gap-2 bg-gray-200 px-4 py-2.5 text-sm">
            <X className="size-4" /> Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex items-center gap-2 bg-emerald-500 px-4 py-2.5 text-sm text-white disabled:opacity-60"
          >
            <Save className="size-4" /> {pending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {error && (
          <p className="border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</p>
        )}

        {!bulkMode ? (
          <section className="bg-white">
            <h2 className="bg-blue-600 px-2.5 py-2.5 font-medium text-white">Question Information</h2>
            <div className="space-y-6 p-4">
              <ExamSelect
                value={selectedExamId}
                onChange={setSelectedExamId}
                options={examOptions}
              />
              <div>
                <label className={label}>Question Headline</label>
                <input
                  value={active.headline}
                  onChange={(e) => updateActiveDraft({ headline: e.target.value })}
                  className={field}
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white">
            <h2 className="bg-blue-600 px-2.5 py-2.5 font-medium text-white">Exam Info</h2>
            <div className="p-4">
              <ExamSelect
                value={selectedExamId}
                onChange={setSelectedExamId}
                options={examOptions}
              />
            </div>
          </section>
        )}

        {bulkMode && (
          <section className="bg-white">
            <h2 className="bg-blue-600 px-2.5 py-2.5 font-medium text-white">Questions</h2>

            <div className="flex flex-wrap items-stretch border-b bg-gray-50 text-sm">
              {drafts.map((d, i) => (
                <div
                  key={d.key}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "group relative flex cursor-pointer items-center justify-center border-r px-4 py-3",
                    i === activeTab
                      ? "border-t-2 border-t-blue-600 bg-white font-medium text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  Q{i + 1}
                  {drafts.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTab(i);
                      }}
                      aria-label={`Remove Q${i + 1}`}
                      className="absolute -top-2 right-1 flex size-4 items-center justify-center rounded-full bg-white text-red-500 shadow-sm ring-1 ring-red-200 hover:bg-red-50"
                    >
                      <X className="size-2.5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTab}
                aria-label="Add question"
                className="flex items-center justify-center px-4 text-gray-500 hover:bg-gray-100"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <div className="p-4">
              <label className={label}>Question Headline</label>
              <input
                value={active.headline}
                onChange={(e) => updateActiveDraft({ headline: e.target.value })}
                className={field}
              />
            </div>
          </section>
        )}

        <AnswersEditor
          answers={active.answers}
          newText={active.newAnswerText}
          onNewTextChange={(v) => updateActiveDraft({ newAnswerText: v })}
          onAdd={addAnswer}
          onRemove={removeAnswer}
          onMarkCorrect={markCorrect}
          inputRef={newAnswerRef}
          maxAnswers={MAX_ANSWERS}
        />
      </div>
    </div>
  );
}

function ExamSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (id: string) => void;
  options: ExamOption[];
}) {
  return (
    <div>
      <label className={label}>Exam</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} appearance-none pr-10`}
        >
          <option value="" disabled>
            Select exam
          </option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
}

function AnswersEditor({
  answers,
  newText,
  onNewTextChange,
  onAdd,
  onRemove,
  onMarkCorrect,
  inputRef,
  maxAnswers,
}: {
  answers: QuestionAnswer[];
  newText: string;
  onNewTextChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onMarkCorrect: (index: number) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  maxAnswers: number;
}) {
  const maxReached = answers.length >= maxAnswers;

  return (
    <section className="bg-white">
      <div className="flex items-center justify-between bg-blue-600 px-2.5 py-2.5 text-white">
        <h2 className="font-medium">Question Answers</h2>
      </div>

      <div className="flex items-center justify-between bg-gray-200 px-4 py-2.5 text-sm font-medium">
        <span>
          Body{" "}
          <span className="font-normal text-gray-500">
            ({answers.length}/{maxAnswers})
          </span>
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.focus()}
          disabled={maxReached}
          className="flex items-center gap-2 bg-emerald-500 px-3 py-1.5 text-xs text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
        >
          <Plus className="size-3.5" /> Add Answer
        </button>
      </div>

      {answers.map((a, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 border-b px-4 py-2.5 text-sm"
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label="Delete answer"
              className="shrink-0 text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
            <span className="truncate">{a.text}</span>
          </div>
          {a.isCorrect ? (
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-emerald-600">
              <Check className="size-3.5" /> Correct Answer
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onMarkCorrect(i)}
              className="flex shrink-0 items-center gap-1 bg-gray-200 px-3 py-1.5 text-xs"
            >
              <Check className="size-3.5" /> Mark Correct
            </button>
          )}
        </div>
      ))}

      {maxReached ? (
        <p className="border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          Maximum of {maxAnswers} answers reached. Delete one to add another.
        </p>
      ) : (
        <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 px-4 py-2.5">
          <button
            type="button"
            onClick={() => onNewTextChange("")}
            aria-label="Clear"
            className="flex size-6 shrink-0 items-center justify-center rounded-full border text-gray-400"
          >
            <X className="size-3.5" />
          </button>
          <input
            ref={inputRef}
            value={newText}
            onChange={(e) => onNewTextChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onAdd();
              }
            }}
            placeholder="Enter answer body"
            className="flex-1 border bg-white px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
          <button
            type="button"
            onClick={onAdd}
            className="flex shrink-0 items-center gap-2 bg-emerald-500 px-4 py-2 text-sm text-white"
          >
            <Plus className="size-4" /> Add
          </button>
        </div>
      )}
    </section>
  );
}