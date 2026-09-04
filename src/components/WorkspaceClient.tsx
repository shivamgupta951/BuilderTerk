"use client";

import WsC from "./WsC";
import type { WorkspaceData } from "@/types/workspace";

interface WorkspaceClientProps {
  initialPrompt: string | null;
  workspace: WorkspaceData | null;
  userCredits: number;
  userId: string;
  userPlan: string;
}

export function WorkspaceClient(props: WorkspaceClientProps) {
  return <WsC {...props} />;
}
