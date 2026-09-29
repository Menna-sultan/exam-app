import Link from "next/link";
import { ExternalLink } from "lucide-react";

export function ExamDiplomaLink({
  diploma,
  className,
}: {
  diploma: { id: string; title: string };
  className?: string;
}) {
  return (
    <Link
      href={`/dashboard/diplomas/${diploma.id}`}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 ${className ?? ""}`}
    >
      {diploma.title}
      <ExternalLink className="size-3.5" />
    </Link>
  );
}
