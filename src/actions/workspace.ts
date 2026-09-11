"use server";

import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";

export async function getWorkspaceUser() {
  const user = await checkUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function getWorkspaceById(id: string, userId: string) {
  // Never trust an ID supplied by the page. Server actions can be invoked
  // directly, so ownership must be checked against the authenticated user.
  const user = await checkUser();
  if (!user || user.id !== userId) return null;

  return db.workSpace.findFirst({
    where: { id, userId: user.id },
  });
}