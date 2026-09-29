import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { GraduationCap } from "lucide-react";

import { authOptions } from "@/auth";
import { DiplomaGridShell } from "@/features/main/components/diplomas/diploma-grid-shell";
import {
  Breadcrumb,
  PageHeader,
} from "@/features/main/components/layout/page-header";

export default async function DiplomasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  return (
    <div>
      <Breadcrumb items={["Diplomas"]} />

      <PageHeader icon={GraduationCap} title="Diplomas" />

      <DiplomaGridShell token={session.token} />
    </div>
  );
}