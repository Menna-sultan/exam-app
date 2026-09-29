import { ChevronDown } from "lucide-react";
import { ExamImageField } from "./exam-image-field";
import type { DiplomaOption, Exam } from "@/features/main/apis/exam.api";

export function ExamForm({
  exam,
  diplomas,
  action,
}: {
  exam?: Exam;
  diplomas: DiplomaOption[];
  action: (formData: FormData) => Promise<void>;
}) {
  const field =
    "w-full border bg-white px-3 py-3 text-sm outline-none focus:border-blue-600";
  const label = "mb-2 block text-sm font-medium";

  return (
    <form id="exam-form" action={action} className="bg-white">
      <h2 className="bg-blue-600 px-2.5 py-2.5 font-medium text-white">Exam Information</h2>

      <div className="grid gap-x-4 gap-y-6 p-4 md:grid-cols-2">
        <div>
          <label htmlFor="title" className={label}>Title</label>
          <input id="title" name="title" defaultValue={exam?.title} required className={field} />
        </div>

        <div>
          <label htmlFor="diplomaId" className={label}>Diploma</label>
          <div className="relative">
            <select
              id="diplomaId"
              name="diplomaId"
              required
              defaultValue={exam?.diploma?.id ?? exam?.diplomaId ?? ""}
              className={`${field} appearance-none pr-10`}
            >
              <option value="" disabled>Select a diploma</option>
              {diplomas.map((d) => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div>
          <span className={label}>Image</span>
          <ExamImageField name="image" defaultUrl={exam?.image} />
        </div>

        <div>
          <label htmlFor="description" className={label}>Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={exam?.description}
            className={`${field} h-24.5 resize-none`}
          />
        </div>

        <div>
          <label htmlFor="duration" className={label}>Duration (min)</label>
          <input
            id="duration"
            name="duration"
            type="number"
            min={1}
            required
            defaultValue={exam?.duration}
            className={field}
          />
        </div>
      </div>
    </form>
  );
}