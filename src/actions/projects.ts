"use server";

import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/prisma";

export interface ProjectSummary {
  id: string;
  title: string | null;
  updatedAt: Date;
  messageCount: number;
  firstPrompt: string | null;
}

export async function getUserProjects(): Promise<ProjectSummary[]> {
  const user = await checkUser();
  if (!user) return [];

  const workspaces = await db.workSpace.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, updatedAt: true, messages: true },
  });

  return workspaces.map((workspace) => {
    const messages = Array.isArray(workspace.messages)
      ? workspace.messages
      : [];
    const firstUserMessage = messages.find(
      (message) =>
        typeof message === "object" &&
        message !== null &&
        "role" in message &&
        message.role === "user" &&
        "content" in message &&
        typeof message.content === "string"
    );

    return {
      id: workspace.id,
      title: workspace.title,
      updatedAt: workspace.updatedAt,
      messageCount: messages.length,
      firstPrompt:
        firstUserMessage &&
        typeof firstUserMessage === "object" &&
        "content" in firstUserMessage &&
        typeof firstUserMessage.content === "string"
          ? firstUserMessage.content
          : null,
    };
  });
}

export async function deleteProject(id: string) {
  const user = await checkUser();
  if (!user) throw new Error("Unauthorized");

  return db.workSpace.deleteMany({ where: { id, userId: user.id } });
}
