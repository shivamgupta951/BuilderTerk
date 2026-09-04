import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { CREDIT_COST_PER_GENERATION } from "@/lib/constants";
import type { FileData } from "@/types/workspace";

const SYSTEM_PROMPT = `You improve existing React applications.
Return only valid JSON with this shape:
{
  "summary": "short summary",
  "files": { "/App.js": { "code": "complete file contents" } }
}
Rules:
- Include every existing file, changed or unchanged.
- Use JavaScript and React only; do not use TypeScript.
- Preserve existing functionality unless the request asks to change it.
- Return complete file contents, never patches or markdown.`;

function sseEvent(type: string, payload: object): string {
  return `data: ${JSON.stringify({ type, ...payload })}\n\n`;
}

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    userId: string;
    workspaceId: string;
    userRequest: string;
    fileData: FileData;
  };

  if (!body.userId || !body.workspaceId || !body.userRequest || !body.fileData) {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }

  const user = await db.user.findUnique({
    where: { id: body.userId, clerkId },
    select: { id: true, credits: true, plan: true },
  });

  if (!user) return Response.json({ message: "User not found" }, { status: 404 });
  if (user.plan !== "pro") {
    return Response.json({ message: "Upgrade required" }, { status: 403 });
  }
  if (user.credits < CREDIT_COST_PER_GENERATION) {
    return Response.json({ message: "Insufficient credits" }, { status: 402 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (value: string) => controller.enqueue(encoder.encode(value));

      try {
        enqueue(sseEvent("status", { message: "Improving your app..." }));

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `User request:\n${body.userRequest}\n\nCurrent files:\n${JSON.stringify(body.fileData.files, null, 2)}`,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.5,
            responseMimeType: "application/json",
          },
        });

        const parsed = JSON.parse(response.text ?? "") as {
          summary?: string;
          files?: FileData["files"];
        };
        if (!parsed.files || typeof parsed.files !== "object") {
          throw new Error("AI response did not include valid files.");
        }

        const newFileData: FileData = {
          files: parsed.files,
          dependencies: body.fileData.dependencies,
          title: body.fileData.title,
        };

        await db.$transaction([
          db.workSpace.update({
            where: { id: body.workspaceId, userId: body.userId },
            data: { fileData: newFileData as never },
          }),
          db.user.update({
            where: { id: body.userId },
            data: { credits: { decrement: CREDIT_COST_PER_GENERATION } },
          }),
        ]);

        const updatedUser = await db.user.findUnique({
          where: { id: body.userId },
          select: { credits: true },
        });

        for (const [path, file] of Object.entries(newFileData.files)) {
          enqueue(sseEvent("file_patch", { path, code: file.code, reason: "AI improvement" }));
        }
        enqueue(
          sseEvent("done", {
            fileData: newFileData,
            summary: parsed.summary ?? "Your app was improved.",
            creditsRemaining: updatedUser?.credits ?? user.credits - CREDIT_COST_PER_GENERATION,
          })
        );
      } catch (error) {
        console.error("[improve] error:", error);
        enqueue(
          sseEvent("error", {
            message: error instanceof Error ? error.message : "Something went wrong.",
          })
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export const runtime = "nodejs";
export const maxDuration = 300;
