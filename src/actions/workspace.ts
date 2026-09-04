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
  return db.workSpace.findFirst({
    where: { id, userId },
  });
}