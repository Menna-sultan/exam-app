import { IExam } from "@/shared/types/exam";
import { ExamRow } from "./exam-row";

export function ExamList({ exams }: { exams: IExam[] }) {
  return (
    <div>
      <div className="flex flex-col gap-3">
        {exams.map((exam) => (
          <ExamRow key={exam.id} exam={exam} />
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-gray-400">
        End of list
      </p>
    </div>
  );
}