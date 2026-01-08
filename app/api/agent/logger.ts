import { type LogLine } from "@browserbasehq/stagehand";

type SendFn = (event: string, data: unknown) => void;

export function createStagehandUserLogger(send: SendFn) {
  let lastReasoningMessage: string | null = null;

  const logger = (logLine: LogLine) => {
    const category = logLine?.category ?? "";
    const msg = (logLine?.message ?? "").toString().toLowerCase();

    if (category !== "agent") return;

    const isVerboseInit =
      msg.includes("creating v3 agent instance") &&
      msg.includes("systemprompt");
    if (isVerboseInit) return;

    if (msg.includes("reasoning:")) {
      lastReasoningMessage = logLine.message.replace(/^reasoning:\s*/i, "");
    }

    send("log", logLine);
  };

  return Object.assign(logger, {
    getLastReasoning: () => lastReasoningMessage,
  });
}
