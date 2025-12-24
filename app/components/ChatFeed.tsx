"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { useWindowSize } from "usehooks-ts";
import posthog from "posthog-js";

import { SessionControls } from "@/app/components/SessionControls";
import BrowserSessionContainer from "@/app/components/BrowserSessionContainer";
import { SessionLiveURLs } from "@browserbasehq/sdk/resources/index.mjs";
import BrowserTabs from "@/app/components/ui/BrowserTabs";
import NavBar from "@/app/components/NavBar";
import PinnedGoalMessage from "@/app/components/chat/PinnedGoalMessage";
import PinnedFinalAnswer from "@/app/components/chat/PinnedFinalAnswer";
import ChatMessagesList from "@/app/components/chat/ChatMessagesList";
import ChatInput from "@/app/components/chat/ChatInput";
import SafetyConfirmationDialog from "@/app/components/chat/SafetyConfirmationDialog";
import { useAgentStream } from "@/app/hooks/useAgentStream";
import { ChatFeedProps, AgentState, BrowserStep } from "@/app/types/ChatFeed";
import { DEFAULT_MODEL_ID, getSupportedModelById } from "@/constants/models";

export default function ChatFeed({
  initialMessage,
  onClose,
  modelId,
}: ChatFeedProps) {
  const renderCount = useRef(0);
  renderCount.current++;
  console.log(`[ChatFeed] Component rendered #${renderCount.current} with initialMessage: "${initialMessage?.substring(0, 50)}..."`);
  const [activePage, setActivePage] = useState<SessionLiveURLs.Page | null>(
    null
  );
  const [sessionTime, setSessionTime] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const agentStateRef = useRef<AgentState>({
    sessionId: null,
    sessionUrl: null,
    steps: [],
    isLoading: false,
  });

  const [uiState, setUiState] = useState<{
    sessionId: string | null;
    sessionUrl: string | null;
    steps: BrowserStep[];
  }>({
    sessionId: null,
    sessionUrl: null,
    steps: [],
  });

  const activePageUrl = activePage?.debuggerFullscreenUrl ?? activePage?.debuggerUrl ?? null;

  const [userInput, setUserInput] = useState("");
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input field when waiting for input
  useEffect(() => {
    if (isWaitingForInput && inputRef.current) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [isWaitingForInput]);

  // Track scroll position to apply conditional margin
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        setIsScrolled(chatContainerRef.current.scrollTop > 10);
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    let timer: number | undefined;

    if (uiState.sessionId) {
      // Reset timer when a new session starts
      setSessionTime(0);

      // Start the timer
      timer = window.setInterval(() => {
        setSessionTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (timer) window.clearInterval(timer);
    };
  }, [uiState.sessionId]);

  // Update the handleUserInput function
  const handleUserInput = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      // Add user message to chat
      const userStep: BrowserStep = {
        text: input,
        reasoning: "User input",
        tool: "MESSAGE",
        instruction: "",
        stepNumber: agentStateRef.current.steps.length + 1,
      };

      agentStateRef.current = {
        ...agentStateRef.current,
        steps: [...agentStateRef.current.steps, userStep],
      };

      setUiState((prev) => ({
        ...prev,
        steps: agentStateRef.current.steps,
      }));

      setIsWaitingForInput(false);
      setUserInput("");

      try {
        console.log("User input received:", input);
      } catch (error) {
        console.error("Error handling user input:", error);

        // Add error message to chat
        const errorStep: BrowserStep = {
          text: "Sorry, there was an error processing your request. Please try again.",
          reasoning: "Error handling user input",
          tool: "MESSAGE",
          instruction: "",
          stepNumber: agentStateRef.current.steps.length + 1,
        };

        agentStateRef.current = {
          ...agentStateRef.current,
          steps: [...agentStateRef.current.steps, errorStep],
        };

        setUiState((prev) => ({
          ...prev,
          steps: agentStateRef.current.steps,
        }));

        setIsWaitingForInput(true);
      }
    },
    []
  );

  const handleStart = useCallback((data: { sessionId: string; goal?: string; model?: string; init?: unknown; startedAt?: string }) => {
    posthog.capture("google_cua_start", {
      goal: initialMessage,
      sessionId: data.sessionId,
      model: data.model ?? modelId ?? DEFAULT_MODEL_ID,
    });
    setHasEnded(false);
    setUiState((prev) => ({
      ...prev,
      sessionId: data.sessionId,
    }));
  }, [initialMessage, modelId]);

  const handleDone = useCallback((payload?: unknown) => {
    console.log("Agent completed with payload:", payload);
    setHasEnded(true);
    // Terminate session
    if (uiState.sessionId) {
      fetch("/api/session", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: uiState.sessionId }),
      }).catch((error) => {
        console.log("Error during session termination (can be ignored):", error);
      });
    }
  }, [uiState.sessionId]);

  const handleError = useCallback((errorMessage: string) => {
    console.error("Agent stream error:", errorMessage);
    setHasEnded(true);
  }, []);

  // Use the SSE hook for agent communication
  const {
    sessionId,
    sessionUrl,
    steps,
    isFinished,
    pendingSafetyConfirmation,
    respondToSafetyConfirmation,
  } = useAgentStream({
    sessionId: null,
    goal: initialMessage,
    modelId: modelId ?? DEFAULT_MODEL_ID,
    onStart: handleStart,
    onDone: handleDone,
    onError: handleError,
  });
  const agentFinished = isFinished || hasEnded;

  // Update UI state when hook state changes
  useEffect(() => {
    setUiState((prev) => ({
      ...prev,
      sessionId: sessionId || prev.sessionId,
      sessionUrl: sessionUrl || prev.sessionUrl,
      steps,
    }));
  }, [sessionId, sessionUrl, steps]);
  

  // Spring configuration for smoother animations
  const springConfig = {
    type: "spring",
    stiffness: 350,
    damping: 30,
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        ...springConfig,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  };



  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <NavBar
        title="Gemini Browser"
        showCloseButton={true}
        onClose={onClose}
        showGitHubButton={false}
      />
      <main
        className="flex-1 flex flex-col items-center sm:p-4 md:p-6 relative overflow-hidden"
        style={{ backgroundColor: "#FCFCFC" }}
      >
        <div
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{
            backgroundImage: "url(/grid.svg)",
            backgroundSize: "25%",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            opacity: 0.8,
            position: "fixed",
          }}
        ></div>
        <motion.div
          className="w-full max-w-[1600px] bg-white md:border border-[#CAC8C7] shadow-sm overflow-hidden mx-auto relative z-10"
          style={{ height: isMobile ? "calc(100vh - 56px)" : "auto" }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row h-full overflow-hidden">
            {/* Main browser area */}
            <div className="w-full md:flex-[2] gap-y-2 p-4 md:p-6 md:border-l border-[#CAC8C7] order-first md:order-last flex flex-col items-center justify-center sticky top-0 z-20 bg-white">
              {/* Tabs */}
              {!agentFinished && uiState.sessionId && (
                <BrowserTabs
                  sessionId={uiState.sessionId}
                  activePage={activePage}
                  setActivePage={setActivePage}
                />
              )}

              <BrowserSessionContainer
                sessionUrl={activePageUrl}
                isVisible={true}
                isCompleted={agentFinished}
                initialMessage={initialMessage || undefined}
                sessionTime={sessionTime}
                onStop={handleDone}
                onRestart={onClose}
                modelId={modelId ?? undefined}
              />

              {!agentFinished && (
                <div className="mt-4 md:hidden flex items-center text-sm text-[#2E191E]">
                  <div className="flex-1" />
                  <SessionControls
                    sessionTime={sessionTime}
                    onStop={handleDone}
                  />
                  <div className="flex-1 flex justify-end">
                    {modelId && (
                      <span
                        className="text-sm text-gray-400 font-ppsupply max-w-[120px] truncate cursor-default"
                        title={modelId}
                      >
                        {getSupportedModelById(modelId).label}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Chat sidebar */}
            <div
              className={`w-full md:w-[450px] min-w-0 md:min-w-[360px] px-4 md:px-6 ${
                uiState.steps.find(step => step.tool === "MESSAGE" && step.instruction === "Final Answer")
                  ? ""
                  : "pb-4 md:pb-6"
              } flex flex-col flex-1 overflow-hidden`}
              style={{
                height: isMobile
                  ? "calc(100vh - 300px)"
                  : "calc(100vh - 12rem)",
                position: "relative",
              }}
            >
              {/* Pinned Goal Message */}
              {initialMessage && (
                <PinnedGoalMessage
                  initialMessage={initialMessage}
                  isScrolled={isScrolled}
                />
              )}

              <ChatMessagesList
                steps={uiState.steps}
                chatContainerRef={chatContainerRef}
                isMobile={isMobile}
              />

              {pendingSafetyConfirmation && (
                <div className="py-2">
                  <SafetyConfirmationDialog
                    confirmation={pendingSafetyConfirmation}
                    onRespond={respondToSafetyConfirmation}
                  />
                </div>
              )}

              {/* Final Answer - displayed outside the list with same padding as PinnedGoalMessage */}
              {(() => {
                const finalAnswer = uiState.steps.find(
                  step => step.tool === "MESSAGE" && step.instruction === "Final Answer"
                );
                return finalAnswer ? (
                  <PinnedFinalAnswer message={finalAnswer.text || ""} />
                ) : null;
              })()}

              {/* Chat Input */}
              <ChatInput
                isWaitingForInput={isWaitingForInput}
                isAgentFinished={agentFinished}
                userInput={userInput}
                setUserInput={setUserInput}
                onSubmit={async (input: string) => {
                  if (["quit", "exit", "bye"].includes(input.toLowerCase())) {
                    handleDone();
                    return;
                  }
                  await handleUserInput(input);
                }}
                inputRef={inputRef}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </motion.div>
  );
}