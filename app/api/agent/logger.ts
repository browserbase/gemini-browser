import { type LogLine } from "@browserbasehq/stagehand";

type SendFn = (event: string, data: unknown) => void;

export function createStagehandUserLogger(
  send: SendFn,
  options?: { forwardStepEvents?: boolean }
) {
  const forwardSteps = options?.forwardStepEvents ?? false;
  let lastReasoningMessage: string | null = null;

  const logger = (logLine: LogLine) => {
    const msg = (logLine?.message ?? "").toString().toLowerCase();
    const category = logLine?.category ?? "";

    if (category !== "agent") return;

    // ======== Gemini 2.5 CUA patterns ========
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

    // ======== Gemini 3 Flash (v3 agent / non-CUA) patterns ========
    // Tool call pattern: "agent calling tool: act", "agent calling tool: ariatree", etc.
    const isV3ToolCall = /agent\s+calling\s+tool:\s*\w+/i.test(msg);
    // Step finished pattern: "step finished: tool-calls", "step finished: done", etc.
    const isV3StepFinished = /step\s+finished:\s*\w+/i.test(msg);
    // Agent creation: "creating v3 agent instance"
    const isV3AgentInit = msg.includes("creating v3 agent instance");
    // V3 agent action events (navigate, act, extract, observe, etc.)
    const isV3Action = /agent\s+(navigated|acted|extracted|observed|scrolled)/i.test(msg);

    const isTechnical =
      msg.includes("tool_use") ||
      msg.includes("function response") ||
      msg.includes("screenshot") ||
      msg.includes("converted to") ||
      msg.includes("added tool") ||
      msg.includes("created action from") ||
      msg.includes("computer action type") ||
      (msg.includes("processed") && msg.includes("items")) ||
      // Skip verbose v3 agent option logs (contains full system prompt)
      (isV3AgentInit && msg.includes("systemprompt"));

    // Always capture reasoning messages for final output
    if (msg.includes("reasoning:")) {
      const reasoningText = logLine.message.replace(/^reasoning:\s*/i, "");
      lastReasoningMessage = reasoningText;
      console.log(`[SSE] captured reasoning`, { message: reasoningText });
    }

    const shouldForward = !isTechnical && (
      // Gemini 2.5 CUA patterns
      isNavigation ||
      isClick ||
      isTyping ||
      isExtraction ||
      isWaiting ||
      isStepProgress ||
      isCompletion ||
      isKeyReasoning ||
      isError ||
      isFunctionCall ||
      // Gemini 3 Flash (v3) patterns
      isV3ToolCall ||
      isV3StepFinished ||
      isV3Action
    );

    if (!shouldForward) {
      console.log(`[SSE] skip log`, { message: msg });
      return;
    }

    let cleanMessage = logLine.message;
    // Gemini 2.5 CUA message cleanup
    cleanMessage = cleanMessage.replace(/^agent\s+\d+\s+/i, "");
    cleanMessage = cleanMessage.replace(/^reasoning:\s*/i, "💭 ");
    cleanMessage = cleanMessage.replace(/^executing step\s+(\d+).*?:/i, "Step $1:");
    
    // Gemini 3 Flash (v3) message cleanup - make messages more user-friendly
    cleanMessage = cleanMessage.replace(/^agent\s+calling\s+tool:\s*/i, "🔧 Using tool: ");
    cleanMessage = cleanMessage.replace(/^step\s+finished:\s*/i, "✓ Step finished: ");

    console.log(`[SSE] forward log`, { message: cleanMessage });
    send("log", { ...logLine, message: cleanMessage });

    if (forwardSteps) {
      const isActionStep = isNavigation || isClick || isTyping || isExtraction || isWaiting || isStepProgress || isV3ToolCall || isV3Action;
      if (isActionStep) {
        const stepMatch = cleanMessage.match(/Step (\d+):/i);
        const stepIndex = stepMatch ? parseInt(stepMatch[1]) - 1 : 0;
        send("step", {
          stepIndex,
          message: cleanMessage,
          completed: isCompletion || isV3StepFinished,
        });
      }
    }
  };

  return Object.assign(logger, {
    getLastReasoning: () => lastReasoningMessage
  });
}
