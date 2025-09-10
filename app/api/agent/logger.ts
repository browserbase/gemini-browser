import { type LogLine } from "@browserbasehq/stagehand";

type SendFn = (event: string, data: unknown) => void;

export function createStagehandUserLogger(
  send: SendFn,
  options?: { forwardStepEvents?: boolean }
) {
  const forwardSteps = options?.forwardStepEvents ?? false;

  return (logLine: LogLine) => {
    const msg = (logLine?.message ?? "").toString().toLowerCase();
    const category = logLine?.category ?? "";

    if (category !== "agent") return;

    const isNavigation = msg.includes("navigating to") || msg.includes("going to") || msg.includes("visiting");
    const isClick = msg.includes("clicking") && !msg.includes("tool_use");
    const isTyping = msg.includes("typing") || msg.includes("entering text");
    const isExtraction = msg.includes("extracting") || msg.includes("found") || msg.includes("retrieved");
    const isWaiting = msg.includes("waiting for") && !msg.includes("screenshot");

    const isStepProgress = /step\s+\d+/i.test(msg) && (msg.includes("starting") || msg.includes("executing step"));
    const isCompletion = msg.includes("completed") && !msg.includes("tool_use");

    const isKeyReasoning = msg.includes("reasoning:") && (
      msg.includes("need to") ||
      msg.includes("will") ||
      msg.includes("found") ||
      msg.includes("see") ||
      msg.includes("notice")
    );

    const isError = msg.includes("error") || msg.includes("failed") || msg.includes("unable");

    // Forward actual toolcall lines so the UI can parse actionName/actionArgs
    const isFunctionCall = /found\s+function\s+call:\s*[a-z0-9_]+\s+(?:with\s+args:)?/i.test(msg);

    const isTechnical =
      msg.includes("tool_use") ||
      msg.includes("function response") ||
      msg.includes("screenshot") ||
      msg.includes("converted to") ||
      msg.includes("added tool") ||
      msg.includes("created action from") ||
      msg.includes("computer action type") ||
      (msg.includes("processed") && msg.includes("items"));

    const shouldForward = !isTechnical && (
      isNavigation ||
      isClick ||
      isTyping ||
      isExtraction ||
      isWaiting ||
      isStepProgress ||
      isCompletion ||
      isKeyReasoning ||
      isError ||
      isFunctionCall
    );

    if (!shouldForward) {
      console.log(`[SSE] skip log`, { message: msg });
      return;
    }

    let cleanMessage = logLine.message;
    cleanMessage = cleanMessage.replace(/^agent\s+\d+\s+/i, "");
    cleanMessage = cleanMessage.replace(/^reasoning:\s*/i, "💭 ");
    cleanMessage = cleanMessage.replace(/^executing step\s+(\d+).*?:/i, "Step $1:");

    console.log(`[SSE] forward log`, { message: cleanMessage });
    send("log", { ...logLine, message: cleanMessage });

    if (forwardSteps) {
      const isActionStep = isNavigation || isClick || isTyping || isExtraction || isWaiting || isStepProgress;
      if (isActionStep) {
        const stepMatch = cleanMessage.match(/Step (\d+):/i);
        const stepIndex = stepMatch ? parseInt(stepMatch[1]) - 1 : 0;
        send("step", {
          stepIndex,
          message: cleanMessage,
          completed: isCompletion,
        });
      }
    }
  };
}


