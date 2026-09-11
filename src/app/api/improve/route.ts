import { auth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { NextRequest } from "next/server";
import { db } from "@/lib/prisma";
import { CREDIT_COST_PER_GENERATION } from "@/lib/constants";
import { aj } from "@/lib/arcjet";
import type { FileData } from "@/types/workspace";

const MAX_REQUEST_LENGTH = 12_000;
const MAX_FILE_DATA_LENGTH = 500_000;

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

function parseJsonObject<T>(text: string): T {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(withoutFence) as T;
  } catch {
    const start = withoutFence.indexOf("{");
    const end = withoutFence.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("Invalid JSON object");
    return JSON.parse(withoutFence.slice(start, end + 1)) as T;
  }
}

function sseEvent(type: string, payload: object): string {
  return `data: ${JSON.stringify({ type, ...payload })}\n\n`;
}

export async function POST(request: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }

  const candidate = body as Partial<{
    userId: string;
    workspaceId: string;
    userRequest: string;
    fileData: FileData;
  }>;
  if (
    typeof candidate.userId !== "string" ||
    typeof candidate.workspaceId !== "string" ||
    typeof candidate.userRequest !== "string" ||
    candidate.userRequest.trim().length === 0 ||
    candidate.userRequest.length > MAX_REQUEST_LENGTH ||
    !candidate.fileData ||
    typeof candidate.fileData !== "object" ||
    !candidate.fileData.files ||
    typeof candidate.fileData.files !== "object" ||
    !candidate.fileData.dependencies ||
    typeof candidate.fileData.dependencies !== "object" ||
    JSON.stringify(candidate.fileData).length > MAX_FILE_DATA_LENGTH
  ) {
    return Response.json({ message: "Invalid request or request too large" }, { status: 400 });
  }

  const { userId, workspaceId, userRequest, fileData } = candidate;

  if (process.env.ARCJET_KEY) {
    const arcjetReq = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: JSON.stringify(body),
    });
    const decision = await aj.protect(arcjetReq, {
      requested: 1,
      userId: clerkId,
      detectPromptInjectionMessage: userRequest,
    });

    if (decision.isDenied()) {
      return Response.json(
        { message: decision.reason?.type ?? "Request blocked" },
        { status: 429 }
      );
    }
  }

  const user = await db.user.findUnique({
    where: { id: userId, clerkId },
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
          model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
          contents: `User request:\n${userRequest}\n\nCurrent files:\n${JSON.stringify(fileData.files, null, 2)}`,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.5,
            responseMimeType: "application/json",
          },
        });

        const parsed = parseJsonObject<{
          summary?: string;
          files?: FileData["files"];
        }>(response.text ?? "");
        if (!parsed.files || typeof parsed.files !== "object") {
          throw new Error("AI response did not include valid files.");
        }

        const newFileData: FileData = {
          files: parsed.files,
          dependencies: fileData.dependencies,
          title: fileData.title,
        };

        const [, creditUpdate] = await db.$transaction([
          db.workSpace.update({
            where: { id: workspaceId, userId: user.id },
            data: { fileData: newFileData as never },
          }),
          db.user.updateMany({
            where: { id: user.id, credits: { gte: CREDIT_COST_PER_GENERATION } },
            data: { credits: { decrement: CREDIT_COST_PER_GENERATION } },
          }),
        ]);

        // Keep the expensive AI work outside the transaction, but make the
        // final balance check atomic so concurrent improvements cannot overspend.
        if (creditUpdate.count !== 1) {
          throw new Error("Insufficient credits");
        }

        const updatedUser = await db.user.findUnique({
          where: { id: user.id },
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
