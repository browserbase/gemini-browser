import { type LogLine } from "@browserbasehq/stagehand";

type SendFn = (event: string, data: unknown) => void;

export function createStagehandUserLogger(send: SendFn) {
  let lastReasoningMessage: string | null = null;

  const logger = (logLine: LogLine) => {
    const category = logLine?.category ?? "";
    const msg = (logLine?.message ?? "").toString().toLowerCase();

    // Only forward agent logs - let frontend handle all parsing/filtering
    if (category !== "agent") return;

    // Skip extremely verbose logs (full system prompts, etc.)
    const isVerboseInit = msg.includes("creating v3 agent instance") && msg.includes("systemprompt");
    if (isVerboseInit) {
      console.log(`[SSE] skip verbose init log`);
      return;
    }

    // Capture reasoning for final message fallback
    if (msg.includes("reasoning:")) {
      lastReasoningMessage = logLine.message.replace(/^reasoning:\s*/i, "");
    }

    // Forward the full raw LogLine to frontend
    console.log(`[SSE] forward log`, JSON.stringify(logLine));
    send("log", logLine);
  };

  return Object.assign(logger, {
    getLastReasoning: () => lastReasoningMessage
  });
}
