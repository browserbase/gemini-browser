"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment-timezone";
import { BrowserStep } from "@/app/types/ChatFeed";
import {
  AgentLog,
  UseAgentStreamProps,
  AgentStreamState,
  LogEvent,
} from "@/app/types/Agent";

// Global trackers to avoid duplicate session creation in React Strict Mode
// by sharing a single in-flight promise across mounts for the same goal.
const sessionCreationPromises = new Map<
  string,
  Promise<{
    sessionId: string;
    sessionUrl: string | null;
  }>
>();

export function useAgentStream({
  sessionId,
  goal,
  modelId,
  onStart,
  onDone,
  onError,
}: UseAgentStreamProps) {
  console.log(
    `[useAgentStream] Hook called with goal: "${goal?.substring(0, 50)}...", sessionId: ${sessionId}`
  );
  const [state, setState] = useState<AgentStreamState>({
    sessionId: sessionId,
    sessionUrl: null,
    steps: [],
    logs: [],
    isLoading: false,
    isFinished: false,
    error: null,
    invokedTools: [],
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const stepCounterRef = useRef(1);
  const stepOffsetRef = useRef(0);
  // Use refs for callbacks to avoid dependency issues
  const onStartRef = useRef(onStart);
  const onDoneRef = useRef(onDone);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onStartRef.current = onStart;
    onDoneRef.current = onDone;
    onErrorRef.current = onError;
  }, [onStart, onDone, onError]);

  // No need to reset session tracking anymore - using tracker system

  const stop = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isFinished: true,
    }));
  }, []);

  const parseLog = useCallback((raw: string): AgentLog | null => {
    if (raw.startsWith("💭 ")) {
      return { kind: "thought", text: raw.slice(2).trim() };
    }
    const execMatch = raw.match(/^Executing step\s+(\d+)/i);
    if (execMatch) {
      return { kind: "summary", step: parseInt(execMatch[1], 10), text: "" };
    }
    // Function call lines, optionally without args, and possibly multi-line JSON
    const fnMatch = raw.match(
      /^Found function call:\s*([A-Za-z0-9_]+)(?:\s+with args:\s*([\s\S]+))?$/i
    );
    if (fnMatch) {
      let args: unknown = {};
      const jsonText = (fnMatch[2] || "").trim();
      if (jsonText) {
        try {
          args = JSON.parse(jsonText);
        } catch {
          args = jsonText; // keep raw if not valid JSON
        }
      }
      return {
        kind: "action",
        step: stepCounterRef.current,
        tool: fnMatch[1],
        args,
      };
    }
    return null;
  }, []);

  const isPlainObject = useCallback(
    (v: unknown) => typeof v === "object" && v !== null && !Array.isArray(v),
    []
  );
  const isEmptyObject = useCallback(
    (v: unknown) =>
      isPlainObject(v) &&
      Object.keys(v as Record<string, unknown>).length === 0,
    [isPlainObject]
  );

  useEffect(() => {
    console.log(
      `[useAgentStream] useEffect triggered with goal: "${goal?.substring(0, 50)}..."`
    );
    if (!goal) {
      console.log(`[useAgentStream] No goal, returning`);
      return;
    }

    let cancelled = false;

    const initializeStream = async () => {
      let currentSessionId = sessionId;

      // If no sessionId provided, create or reuse a session via shared promise
      if (!currentSessionId) {
        try {
          setState((prev) => ({ ...prev, isLoading: true, error: null }));

          let promise = sessionCreationPromises.get(goal);
          if (!promise) {
            promise = (async () => {
              // Detect timezone using moment-timezone for cleaner abbreviations
              const getTimezoneAbbreviation = () => {
                try {
                  // Only detect timezone on the client side
                  if (typeof window === "undefined") {
                    return "PDT"; // Server-side fallback
                  }

                  const abbr = moment.tz(moment.tz.guess()).format("z");
                  return abbr;
                } catch {
                  return "PDT"; // Fallback
                }
              };

              const timezone = getTimezoneAbbreviation();

              const sessionResponse = await fetch("/api/session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  timezone: timezone,
                }),
              });

              const sessionData = await sessionResponse.json();
              if (!sessionData.success) {
                throw new Error(
                  sessionData.error || "Failed to create session"
                );
              }

              console.log(
                `[useAgentStream] Session created successfully: ${sessionData.sessionId}`
              );
              return {
                sessionId: sessionData.sessionId as string,
                sessionUrl: (sessionData.sessionUrl as string) ?? null,
              };
            })();
            sessionCreationPromises.set(goal, promise);
          }

          const result = await promise;
          if (cancelled) return;

          currentSessionId = result.sessionId;
          setState((prev) => ({
            ...prev,
            sessionId: result.sessionId,
            sessionUrl: result.sessionUrl,
          }));
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to create session";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isLoading: false,
          }));
          onErrorRef.current?.(errorMessage);
          // Allow retries by clearing promise on error
          sessionCreationPromises.delete(goal);
          return;
        }
      }

      if (cancelled || !currentSessionId) return;

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      // Create EventSource for SSE
      const params = new URLSearchParams({
        sessionId: currentSessionId!,
        goal,
        ...(modelId && { model: modelId }),
      });

      const es = new EventSource(`/api/agent/stream?${params.toString()}`);
      eventSourceRef.current = es;

      // Add event listeners
      es.addEventListener("start", (e) => {
        if (cancelled) return;
        try {
          const payload = JSON.parse((e as MessageEvent).data);
          setState((prev) => ({
            ...prev,
            sessionId: payload.sessionId,
            isLoading: false,
          }));
          onStartRef.current?.(payload);
        } catch (err) {
          console.error("Error parsing start event:", err);
        }
      });

      es.addEventListener("log", (e) => {
        if (cancelled) return;
        try {
          const payload = JSON.parse((e as MessageEvent).data) as LogEvent;
          const parsed = parseLog(payload.message);

          setState((prev) => {
            const newLogs = [...prev.logs, payload];
            if (!parsed) {
              return { ...prev, logs: newLogs };
            }

            if (parsed.kind === "summary") {
              // If the first visible step starts at >1 (because step 1 was hidden),
              // shift numbering so the first visible step is Step 1.
              if (
                stepOffsetRef.current === 0 &&
                prev.steps.length === 0 &&
                parsed.step > 1
              ) {
                stepOffsetRef.current = parsed.step - 1;
              }
              const displayStep = Math.max(
                1,
                parsed.step - stepOffsetRef.current
              );
              stepCounterRef.current = displayStep;

              const trimmedText = (parsed.text || "").trim();

              // Update existing step with matching number if present; else append
              const existingIndex = prev.steps.findIndex(
                (s) => s.stepNumber === displayStep
              );
              if (existingIndex >= 0) {
                const existing = prev.steps[existingIndex];
                const existingText = (existing.text || "").trim();
                // If text is identical, no change; otherwise update text/instruction
                if (trimmedText && trimmedText !== existingText) {
                  const updated: BrowserStep = {
                    ...existing,
                    // Keep whatever tool it currently has (may have been upgraded to an action)
                    text: parsed.text,
                    instruction: parsed.text,
                  };
                  const newSteps = [...prev.steps];
                  newSteps[existingIndex] = updated;
                  return { ...prev, logs: newLogs, steps: newSteps };
                }
                return { ...prev, logs: newLogs };
              }

              const newStep: BrowserStep = {
                stepNumber: displayStep,
                text: parsed.text,
                reasoning: "",
                tool: "MESSAGE",
                instruction: parsed.text,
              };
              return {
                ...prev,
                logs: newLogs,
                steps: [...prev.steps, newStep],
              };
            }

            if (parsed.kind === "thought") {
              if (prev.steps.length === 0) {
                // create a placeholder step 1 to hold the thought
                const placeholder: BrowserStep = {
                  stepNumber: stepCounterRef.current,
                  text: "",
                  reasoning: parsed.text,
                  tool: "MESSAGE",
                  instruction: "",
                };
                return {
                  ...prev,
                  logs: newLogs,
                  steps: [...prev.steps, placeholder],
                };
              }
              const updated = prev.steps.map((s, idx, arr) =>
                idx === arr.length - 1 ? { ...s, reasoning: parsed.text } : s
              );
              return { ...prev, logs: newLogs, steps: updated };
            }

            if (parsed.kind === "action") {
              const toolName = parsed.tool;
              const tool: BrowserStep["tool"] = toolName;

              // Track invoked tool names (dedupe)
              const nextInvoked = new Set(prev.invokedTools);
              nextInvoked.add(toolName);

              // Align action to adjusted step numbering
              if (
                stepOffsetRef.current === 0 &&
                prev.steps.length === 0 &&
                parsed.step > 1
              ) {
                stepOffsetRef.current = parsed.step - 1;
              }
              const displayStep = Math.max(
                1,
                parsed.step - stepOffsetRef.current
              );

              // Prefer updating the step with matching number; else update the last
              const updated = (prev.steps.length > 0 ? prev.steps : []).map(
                (s) => {
                  if (s.stepNumber !== displayStep) return s;
                  const sameTool = s.tool === tool;
                  const sameArgs =
                    JSON.stringify(s.actionArgs) ===
                    JSON.stringify(parsed.args);
                  if (sameTool && sameArgs) return s;
                  return { ...s, tool, actionArgs: parsed.args };
                }
              );
              // If there is no step to attach to, create one
              const hasTarget =
                updated.length > 0 &&
                updated.some((s) => s.stepNumber === displayStep);
              if (!hasTarget) {
                const newStep: BrowserStep = {
                  stepNumber: displayStep,
                  text: "",
                  reasoning: "",
                  tool,
                  instruction: "",
                  actionArgs: parsed.args,
                };
                return {
                  ...prev,
                  logs: newLogs,
                  invokedTools: Array.from(nextInvoked),
                  steps: [...prev.steps, newStep],
                };
              }
              return {
                ...prev,
                logs: newLogs,
                invokedTools: Array.from(nextInvoked),
                steps: updated,
              };
            }

            return { ...prev, logs: newLogs };
          });
        } catch (err) {
          console.error("Error parsing log event:", err);
          setState((prev) => ({
            ...prev,
            logs: [...prev.logs, { message: String((e as MessageEvent).data) }],
          }));
        }
      });

      // Disable SSE 'step' duplication: logs already carry summary/action
      es.addEventListener("step", () => {});

      es.addEventListener("done", (e) => {
        try {
          const payload = JSON.parse((e as MessageEvent).data);
          console.log("[useAgentStream] Done event received:", payload);

          // If there's a final message, add it as the last step
          if (payload.finalMessage) {
            console.log("[useAgentStream] Adding final message as step");
            setState((prev) => {
              const finalStep: BrowserStep = {
                stepNumber: prev.steps.length + 1,
                text: payload.finalMessage,
                reasoning: "",
                tool: "MESSAGE",
                instruction: "Final Answer",
              };
              console.log("[useAgentStream] Final step created:", finalStep);
              return {
                ...prev,
                steps: [...prev.steps, finalStep],
                isFinished: true,
              };
            });
          } else {
            setState((prev) => ({
              ...prev,
              isFinished: true,
            }));
          }

          onDoneRef.current?.(payload);
          // Clear the session promise for this goal to allow future runs
          sessionCreationPromises.delete(goal);
        } catch (err) {
          console.error("Error parsing done event:", err);
        }
        es.close();
        eventSourceRef.current = null;
      });

      es.addEventListener("error", (e) => {
        try {
          const payload = JSON.parse((e as MessageEvent).data);
          const errorMessage =
            payload.message || "Connection lost. Please try again.";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isFinished: true,
          }));
          onErrorRef.current?.(errorMessage);
        } catch {
          const errorMessage = "Connection lost. Please try again.";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            isFinished: true,
          }));
          onErrorRef.current?.(errorMessage);
        }
        // Clear the session promise for this goal to allow retries
        sessionCreationPromises.delete(goal);
        es.close();
        eventSourceRef.current = null;
      });

      // Store es in a variable for cleanup
      return () => {
        es.close();
      };
    };

    // Call the initialization function
    initializeStream();

    // Cleanup function for useEffect
    return () => {
      cancelled = true;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [sessionId, goal, modelId, parseLog, isEmptyObject]);

  return {
    ...state,
    stop,
  };
}
