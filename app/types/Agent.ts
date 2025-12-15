import { BrowserStep } from "./ChatFeed";
import type { SupportedModelId } from "@/constants/models";

type AgentThoughtLog = {
  kind: "thought";
  text: string;
};

type AgentSummaryLog = {
  kind: "summary";
  step: number;
  text: string;
};

type AgentActionLog = {
  kind: "action";
  step: number;
  tool: string;
  args: unknown;
};

// Gemini 3 Flash (v3 agent) step finished event - doesn't reset step counter
type AgentV3StepFinishedLog = {
  kind: "v3_step_finished";
  step: number;
  text: string;
};

export type AgentLog = AgentThoughtLog | AgentSummaryLog | AgentActionLog | AgentV3StepFinishedLog;

export interface LogEvent {
  timestamp?: string;
  level?: number;
  category?: string;
  message: string;
}

export interface AgentStreamState {
  sessionId: string | null;
  sessionUrl: string | null;
  steps: BrowserStep[];
  logs: LogEvent[];
  isLoading: boolean;
  isFinished: boolean;
  error: string | null;
  invokedTools: string[];
}

export interface StartEventData {
  sessionId: string;
  goal?: string;
  model?: string;
  init?: unknown;
  startedAt?: string;
}

export interface DoneEventData {
  message?: string;
  success?: boolean;
  completed?: boolean;
  finalMessage?: string;
}

export interface UseAgentStreamProps {
  sessionId: string | null;
  goal: string | null;
  modelId?: SupportedModelId;
  onStart?: (data: StartEventData) => void;
  onDone?: (data?: DoneEventData) => void;
  onError?: (error: string) => void;
}