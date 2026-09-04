"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatPanel } from "./ChatPanal";
import { CodePanel } from "./CodePanal";
import type { FileData, Message, StatusStep, WorkspaceData } from "@/types/workspace";

interface WorkspaceClientProps {
  initialPrompt: string | null;
  workspace: WorkspaceData | null;
  userCredits: number;
  userId: string;
  userPlan: string;
}

function parseWorkspaceData(value: unknown): FileData | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<FileData>;
  if (!data.files || typeof data.files !== "object") return null;
  return {
    files: data.files,
    dependencies: data.dependencies ?? {},
    title: data.title,
  };
}

function parseMessages(value: unknown): Message[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (message): message is Message =>
      typeof message === "object" &&
      message !== null &&
      "role" in message &&
      (message.role === "user" || message.role === "assistant") &&
      "content" in message &&
      typeof message.content === "string"
  );
}

const WorkspaceClient = ({
  initialPrompt,
  workspace,
  userCredits,
  userId,
  userPlan,
}: WorkspaceClientProps) => {
    const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(
    parseMessages(workspace?.messages)
  );
  const [fileData, setFileData] = useState<FileData | null>(
    parseWorkspaceData(workspace?.fileData)
  );
  const [workspaceId, setWorkspaceId] = useState<string | null>(workspace?.id ?? null);
  const [credits, setCredits] = useState(userCredits);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [statusLog, setStatusLog] = useState<StatusStep[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const readEvents = async (
    response: Response,
    onEvent: (event: { type: string; [key: string]: unknown }) => void
  ) => {
    if (!response.ok) {
      const error = (await response.json().catch(() => null)) as { message?: string } | null;
      throw new Error(error?.message ?? "Request failed");
    }
    if (!response.body) throw new Error("The server returned an empty response");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";
      for (const event of events) {
        const line = event.split("\n").find((entry) => entry.startsWith("data: "));
        if (!line) continue;
        onEvent(JSON.parse(line.slice(6)) as { type: string; [key: string]: unknown });
      }
      if (done) break;
    }
  };

  const runGeneration = async (prompt: string, imageUrl?: string) => {
    const nextMessage: Message = { role: "user", content: prompt, imageUrl };
    setMessages((current) => [...current, nextMessage]);
    setIsGenerating(true);
    setStatusLog([{ label: "Starting generation...", status: "running" }]);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      await readEvents(
        await fetch("/api/gen-ai-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspaceId,
            userId,
            messages: [...messages, nextMessage],
            fileData,
          }),
          signal: controller.signal,
        }),
        (event) => {
          if (event.type === "status" && typeof event.message === "string") {
            setStatusLog((current) => [
              ...current.map((step) => ({ ...step, status: "done" as const })),
              { label: event.message as string, status: "running" },
            ]);
          }
          if (event.type === "done") {
            if (typeof event.workspaceId === "string") setWorkspaceId(event.workspaceId);
            if (event.fileData) setFileData(event.fileData as FileData);
            if (typeof event.creditsRemaining === "number") setCredits(event.creditsRemaining);
            if (typeof event.assistantMessage === "string") {
              setMessages((current) => [
                ...current,
                { role: "assistant", content: event.assistantMessage as string },
              ]);
            }
            setStatusLog((current) => current.map((step) => ({ ...step, status: "done" })));
            router.refresh();
          }
          if (event.type === "error") throw new Error(String(event.message ?? "Generation failed"));
        }
      );
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setMessages((current) => [
          ...current,
          { role: "assistant", content: error instanceof Error ? error.message : "Generation failed." },
        ]);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const runImprove = async (userRequest: string) => {
    if (!fileData || !workspaceId) return;
    setIsImproving(true);
    try {
      await readEvents(
        await fetch("/api/improve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, workspaceId, userRequest, fileData }),
        }),
        (event) => {
          if (event.type === "file_patch" && typeof event.path === "string" && typeof event.code === "string") {
            setFileData((current) =>
              current
                ? { ...current, files: { ...current.files, [event.path as string]: { code: event.code as string } } }
                : current
            );
          }
          if (event.type === "done") {
            if (event.fileData) setFileData(event.fileData as FileData);
            if (typeof event.creditsRemaining === "number") setCredits(event.creditsRemaining);
          }
          if (event.type === "error") throw new Error(String(event.message ?? "Improvement failed"));
        }
      );
    } catch (error) {
      console.error("Improve failed", error);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#0a0a0a]">
      <ChatPanel
        messages={messages}
        isGenerating={isGenerating}
        isImproving={isImproving}
        statusLog={statusLog}
        credits={credits}
        initialPrompt={initialPrompt}
        onGenerate={runGeneration}
        onStop={() => abortControllerRef.current?.abort()}
        userId={userId}
        workspaceId={workspaceId}
        appTitle={fileData?.title ?? workspace?.title ?? null}
      />
      <CodePanel
        fileData={fileData}
        isGenerating={isGenerating}
        statusLog={statusLog}
        onImprove={runImprove}
        onFixError={(error) => runGeneration(`Fix this preview error in the app: ${error}`)}
        appTitle={fileData?.title ?? workspace?.title ?? null}
        isImproving={isImproving}
        isProUser={userPlan === "pro"}
      />
    </div>
  );
};

export default WorkspaceClient;