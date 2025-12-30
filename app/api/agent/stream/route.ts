import { Stagehand, SafetyCheck } from "@browserbasehq/stagehand";
import { createStagehandUserLogger } from "../../agent/logger";
import { AGENT_INSTRUCTIONS } from "@/constants/prompt";
import {
  DEFAULT_MODEL_ID,
  getSupportedModelById,
  isSupportedModelId,
  SUPPORTED_MODELS,
} from "@/constants/models";
import { createSafetyConfirmationPromise } from "../safety-response/state";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 600;

function sseEncode(event: string, data: unknown): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(
    `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`,
  );
}

function sseComment(comment: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(`:${comment}\n\n`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const [sessionId, goal, modelParam] = [
    searchParams.get("sessionId"),
    searchParams.get("goal"),
    searchParams.get("model"),
  ];

  if (!sessionId || !goal) {
    return new Response(
      JSON.stringify({ error: "Missing required params: sessionId and goal" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  let stagehandRef: Stagehand | undefined;
  let closed = false;
  let keepAliveTimer: ReturnType<typeof setInterval> | undefined;
  let timeoutTimer: ReturnType<typeof setTimeout> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try {
          controller.enqueue(chunk);
        } catch {
          closed = true;
        }
      };

      const send = (event: string, data: unknown) => {
        if (closed) return;
        safeEnqueue(sseEncode(event, data));
      };

      keepAliveTimer = setInterval(() => {
        safeEnqueue(sseComment("keepalive"));
      }, 15000);

      timeoutTimer = setTimeout(
        async () => {
          console.log(`[SSE] Timeout reached for session ${sessionId}`);
          send("error", { message: "Agent run timed out after 10 minutes" });
          await cleanup();
        },
        10 * 60 * 1000,
      );

      let viewportLockInterval: ReturnType<typeof setInterval> | undefined;

      const cleanup = async (stagehand?: Stagehand) => {
        if (closed) return;
        closed = true;
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        if (viewportLockInterval) clearInterval(viewportLockInterval);
        try {
          if (stagehand) await stagehand.close();
        } catch {}
        try {
          controller.close();
        } catch {}
      };

      const resolvedModelId = (() => {
        if (!modelParam) return DEFAULT_MODEL_ID;
        if (isSupportedModelId(modelParam)) return modelParam;
        // Back-compat: older clients may send the raw model name without provider prefix.
        if (modelParam === "gemini-2.5-computer-use-preview-10-2025") {
          return DEFAULT_MODEL_ID;
        }
        if (modelParam === "gemini-3-flash-preview") {
          return "google/gemini-3-flash-preview";
        }
        return null;
      })();

      if (!resolvedModelId) {
        send("error", {
          message: `Unsupported model: ${modelParam}. Supported: ${SUPPORTED_MODELS.map(
            (m) => m.id,
          ).join(", ")}`,
        });
        await cleanup();
        return;
      }

      const selectedModel = getSupportedModelById(resolvedModelId);

      console.log(`[SSE] Starting Stagehand agent run`, {
        sessionId,
        goal,
        modelId: selectedModel.id,
        hasInstructions: true,
      });
      const logger = createStagehandUserLogger(send);

      const stagehand = new Stagehand({
        model: {
          modelName: selectedModel.id,
          apiKey: process.env.GOOGLE_API_KEY,
        },
        env: "BROWSERBASE",
        browserbaseSessionID: sessionId,
        browserbaseSessionCreateParams: {
          projectId: process.env.BROWSERBASE_PROJECT_ID!,
          proxies: true,
          browserSettings: {
            advancedStealth: true,
            viewport: {
              width: 1288,
              height: 711,
            },
          },
        },
        verbose: 2,
        disablePino: true,
        logger: logger,
        disableAPI: true,
      });
      stagehandRef = stagehand;

      try {
        await stagehand.init();
        console.log(`[SSE] Stagehand initialized`, {
          sessionId: stagehand.browserbaseSessionID,
          debugUrl: stagehand.browserbaseDebugURL,
        });

        const page = stagehand.context.pages()[0];

        await page.goto("https://www.google.com/", {
          waitUntil: "domcontentloaded",
        });

        send("start", {
          sessionId,
          goal,
          model: selectedModel.id,
          debugUrl: stagehand.browserbaseDebugURL,
          startedAt: new Date().toISOString(),
        });

        const safetyConfirmationHandler = async (
          safetyChecks: SafetyCheck[],
        ) => {
          const confirmationId = crypto.randomUUID();

          send("safety_confirmation", {
            confirmationId,
            sessionId,
            checks: safetyChecks,
          });

          const acknowledged = await createSafetyConfirmationPromise(
            sessionId,
            confirmationId,
          );

          return { acknowledged };
        };

        const agent = stagehand.agent({
          ...(selectedModel.cua ? { cua: true } : {}),
          model: {
            modelName: selectedModel.id,
            apiKey: process.env.GOOGLE_API_KEY,
          },
          systemPrompt: `${AGENT_INSTRUCTIONS}\n\nYou are currently on: ${page.url()}`,
        });

        const result = await agent.execute({
          instruction: goal,
          maxSteps: 100,
          callbacks: {
            onSafetyConfirmation: safetyConfirmationHandler,
          },
        });

        try {
          const metrics = await stagehand.metrics;
          console.log(`[SSE] metrics snapshot`, metrics);
          send("metrics", metrics);
        } catch {}

        const loggerReasoning = logger.getLastReasoning();
        const resultMessage =
          (result as { message?: string; output?: string }).message ||
          (result as { message?: string; output?: string }).output ||
          null;
        const finalMessage = loggerReasoning || resultMessage;

        console.log(`[SSE] done`, {
          success: result.success,
          completed: result.completed,
          finalMessage,
        });
        send("done", { ...result, finalMessage });

        await cleanup(stagehand);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[SSE] error`, message);
        send("error", { message });
        await cleanup(stagehand);
      }
    },
    cancel: async () => {
      closed = true;
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      if (timeoutTimer) clearTimeout(timeoutTimer);
      try {
        if (stagehandRef) await stagehandRef.close();
      } catch {}
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
