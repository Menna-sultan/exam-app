"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { deleteDiploma } from "@/features/main/apis/diploma.api";

export async function removeDiploma(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  await deleteDiploma(session.token, id);
  revalidatePath("/dashboard/diplomas");
}

export async function removeDiplomaAndRedirect(id: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.token) redirect("/login");

  await deleteDiploma(session.token, id);
  redirect("/dashboard/diplomas");
}
