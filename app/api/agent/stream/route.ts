import { Stagehand } from "@browserbasehq/stagehand";
import { createStagehandUserLogger } from "../../agent/logger";
import { AGENT_INSTRUCTIONS } from "@/constants/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 600;

function sseEncode(event: string, data: unknown): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(`event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`);
}

function sseComment(comment: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(`:${comment}\n\n`);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const [sessionId, goal, fromChat] = [
    searchParams.get("sessionId"),
    searchParams.get("goal"),
    searchParams.get("fromChat") === "true"
  ];

  if (!sessionId || !goal) {
    return new Response(
      JSON.stringify({ error: "Missing required params: sessionId and goal" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  let stagehandRef: Stagehand | undefined;
  const stream = new ReadableStream<Uint8Array>({
    start: async (controller) => {
      let keepAliveTimer: ReturnType<typeof setInterval> | undefined;
      keepAliveTimer = setInterval(() => {
        safeEnqueue(sseComment("keepalive"));
      }, 15000);

      let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
      timeoutTimer = setTimeout(async () => {
        console.log(`[SSE] Timeout reached for session ${sessionId}`);
        send("error", { message: "Agent run timed out after 10 minutes" });
        await cleanup();
      }, 10 * 60 * 1000);

      let closed = false;

      const safeEnqueue = (chunk: Uint8Array) => {
        if (closed) return;
        try {
          controller.enqueue(chunk);
        } catch (err) {
          console.error(`[SSE] enqueue error`, err instanceof Error ? err.message : String(err));
        }
      };

      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          safeEnqueue(sseEncode(event, data));
        } catch (err) {
          console.error(`[SSE] send error`, err instanceof Error ? err.message : String(err));
        }
      };

      let viewportLockInterval: ReturnType<typeof setInterval> | undefined;

      const cleanup = async (stagehand?: Stagehand) => {
        if (closed) return;
        closed = true;
        if (keepAliveTimer) clearInterval(keepAliveTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        if (viewportLockInterval) clearInterval(viewportLockInterval);
        try {
          if (stagehand && !stagehand.isClosed) {
            await stagehand.close();
          }
        } catch {
          console.error(`[SSE] error closing stagehand`, stagehand);
        }
        controller.close();
      };

      // Keep the connection alive for proxies
      keepAliveTimer = setInterval(() => {
        safeEnqueue(sseComment("keepalive"));
      }, 15000);

      // Hard timeout at 10 minutes
      timeoutTimer = setTimeout(async () => {
        console.log(`[SSE] Timeout reached for session ${sessionId}`);
        send("error", { message: "Agent run timed out after 10 minutes" });
        await cleanup();
      }, 10 * 60 * 1000);

      console.log(`[SSE] Starting Stagehand agent run`, {
        sessionId,
        goal,
        hasInstructions: true,
      });

      const logger = createStagehandUserLogger(send, { forwardStepEvents: false });

      const stagehand = new Stagehand({
        env: "BROWSERBASE",
        browserbaseSessionID: sessionId,
        modelName: "openai/gpt-4o",
        modelClientOptions: {
          apiKey: process.env.OPENAI_API_KEY,
        },
        browserbaseSessionCreateParams: {
          projectId: process.env.BROWSERBASE_PROJECT_ID!,
          proxies: true,
          browserSettings: {
            viewport: {
              width: 1288,
              height: 711,
            },
          },
        },
        useAPI: false,
        verbose: 2,
        disablePino: true,
        logger: logger,
      });
      stagehandRef = stagehand;

      try {
        const init = await stagehand.init();
        console.log(`[SSE] Stagehand initialized`, init);

        send("start", {
          sessionId,
          goal,
          model: "computer-use-preview-10-2025",
          init,
          startedAt: new Date().toISOString(),
        });

        const agent = stagehand.agent({
          provider: "google", 
          model: "computer-use-preview-10-2025",
          options: {
            apiKey: process.env.GOOGLE_API_KEY,
          },
          instructions: AGENT_INSTRUCTIONS,
        });

        const result = await agent.execute({
            instruction: goal,
            autoScreenshot: true,
            waitBetweenActions: 200,
            maxSteps: 100,
        });

        try {
        console.log(`[SSE] metrics snapshot`, stagehand.metrics);
        send("metrics", stagehand.metrics);
        } catch {}

          const finalMessage = logger.getLastReasoning();
          console.log(`[SSE] done`, {
            success: result.success,
            completed: result.completed,
            finalMessage: finalMessage
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
      try {
        if (stagehandRef && !stagehandRef.isClosed) {
          await stagehandRef.close();
        }
      } catch {
        // no-op
      }
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
