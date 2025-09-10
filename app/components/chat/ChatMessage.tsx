"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserStep } from "../../types/ChatFeed";

interface ChatMessageProps {
  step: BrowserStep;
  index: number;
  previousSteps?: BrowserStep[];
}

// Human-readable tool name mapping
const toolNameMapping: Record<string, string> = {
  "open_web_browser": "Open Browser",
  "type_text_at": "Type Text",
  "click_at": "Click",
  "scroll_document": "Scroll",
  "scroll_at": "Scroll",
  "MESSAGE": "Message",
  "take_screenshot": "Screenshot",
  "close_browser": "Close Browser",
  "wait": "Wait",
  "extract_text": "Extract Text",
  "navigate": "Navigate",
  "wait_5_seconds": "Wait 5 Seconds",
  "go_back": "Go Back",
  "go_forward": "Go Forward",
  "search": "Search",
  "key_combination": "Key Combination",
  "hover_at": "Hover",
};

export default function ChatMessage({
  step,
  index,
  previousSteps = [],
}: ChatMessageProps) {
  const isSystemMessage =
    step.tool === "MESSAGE" && step.reasoning === "Processing message";

  // Determine if this is a user input message
  const isUserInput =
    step.tool === "MESSAGE" && step.reasoning === "User input";

  const isCompletionMessage =
    step.tool === "MESSAGE" && step.reasoning === "Task execution completed";

  const isPreemptive =
    step.tool === "MESSAGE" &&
    !isUserInput &&
    !isSystemMessage &&
    !isCompletionMessage;

  if (isPreemptive && !(step.reasoning && step.reasoning.length > 0)) return null;

  return (
    <motion.div
      className={`p-6 ${
        isUserInput
          ? "bg-white shadow-sm"
          : isSystemMessage
          ? "bg-[#2E191E] text-white shadow-md"
          : "transition-colors"
      } border border-[#E5E5E5] font-ppsupply space-y-3`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          {/* Step number */}
          <span
            className={`text-xs w-6 h-6 flex items-center justify-center font-semibold text-gray-600 border bg-gray-200`}
          >
            {step.stepNumber}
          </span>
          {/* Human-readable tool name */}
          <span
            className={`py-1 font-medium ${
              isSystemMessage 
                ? "text-gray-200" 
                : "text-[#2E191E]"
            } text-sm`}
          >
            {toolNameMapping[step.tool] || step.tool}
          </span>
        </div>
      </div>
      <div className="text-sm leading-relaxed">
        {isSystemMessage && step.tool === "MESSAGE" ? (
          <SystemMessageContent step={step} previousSteps={previousSteps} index={index} />
        ) : (
          <div className="space-y-2">
            {isCompletionMessage ? (
              // For completion, show only the final message once
              step.text && <div>{step.text}</div>
            ) : (
              <>
                {/* Reasoning inline with streaming effect */}
                <ReasoningStream
                  key={step.stepNumber}
                  reasoning={step.reasoning || ""}
                  className={isSystemMessage ? "text-gray-200" : "text-[#2E191E]"}
                />

                {/* Keep the step text below reasoning if present */}
                {step.text && <div>{step.text}</div>}
              </>
            )}

            {/* Move action args into accordion */}
            {typeof step.actionArgs !== "undefined" && (
              <details className="mt-3 text-xs group">
                <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2">
                  <svg 
                    className="w-3 h-3 transition-transform group-open:rotate-90" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>ToolCall</span>
                  <span className="px-2 py-0.5 bg-gray-100 text-[#2E191E] border border-gray-300 font-mono">
                    {step.tool}
                  </span>
                </summary>
                <div className="mt-2 p-3 bg-gray-50 space-y-2 border border-gray-200">
                  {/* Arguments */}
                  <div className="font-semibold text-gray-700">Arguments:</div>
                  <pre className="p-3 bg-white overflow-x-auto border border-gray-200 text-xs font-mono text-gray-700">
                    {JSON.stringify(step.actionArgs, null, 2)}
                  </pre>
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SystemMessageContent({
  step,
}: {
  step: BrowserStep;
  previousSteps: BrowserStep[];
  index: number;
}) {
  return (
    <>
      {(() => {
        // Check if this is a message with a question
        if (step.text.includes("?")) {
          // Find all sentences that end with a question mark
          const sentences = step.text.match(/[^.!?]+[.!?]+/g) || [step.text];

          // Separate questions from non-questions
          const questions = sentences.filter((s) => s.trim().endsWith("?"));
          const nonQuestions = sentences.filter((s) => !s.trim().endsWith("?"));

          // Join non-questions as the answer
          const answerText = nonQuestions.join(" ").trim();

          // Join questions as the question
          const questionText = questions.join(" ").trim();

          // Extract answer content from the message or find it in previous steps
          let displayAnswerText = answerText;

          // If there's no answer content but there is a question
          if (!displayAnswerText && questionText) {
            // First, check if this step has a specific answer marker
            if (step.text.includes("ANSWER:")) {
              const answerParts = step.text.split("ANSWER:");
              if (answerParts.length > 1) {
                // Extract the text after "ANSWER:" and before any "QUESTION" marker
                let extractedAnswer = answerParts[1].trim();
                if (extractedAnswer.includes("QUESTION")) {
                  extractedAnswer = extractedAnswer.split("QUESTION")[0].trim();
                }
                if (extractedAnswer) {
                  displayAnswerText = extractedAnswer;
                }
              }
            }

          } else if (!displayAnswerText) {
            // For other cases with no answer content
            displayAnswerText = step.text;
          }

          // Only render the answer part in this message block
          return (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Answer
              </div>
              <div className="p-3 bg-gray-800/30 border border-gray-700">
                <span className="text-gray-100">{displayAnswerText}</span>
              </div>
            </div>
          );
        } else {
          // For regular messages without questions, format them as answers
          return (
            <div className="p-3 bg-gray-800/20 border border-gray-700">
              <span className="text-gray-100">{step.text}</span>
            </div>
          );
        }
      })()}
    </>
  );
}

function ReasoningStream({ reasoning, className }: { reasoning: string; className?: string }) {
  const [base, setBase] = useState(() => reasoning || "");
  const [chunk, setChunk] = useState("");
  const prevRef = useRef(reasoning || "");
  const targetRef = useRef(reasoning || "");

  useEffect(() => {
    const prev = prevRef.current || "";
    const next = reasoning || "";
    if (next === prev) return;
    targetRef.current = next;

    if (!next) {
      setBase("");
      setChunk("");
      prevRef.current = "";
      return;
    }

    if (next.startsWith(prev)) {
      // Pure append
      setBase(prev);
      setChunk(next.slice(prev.length));
      return;
    }

    // Longest common prefix diff
    let i = 0;
    const max = Math.min(prev.length, next.length);
    while (i < max && prev.charCodeAt(i) === next.charCodeAt(i)) i++;

    // If only a small tail changed, keep most of prev to reduce flicker
    const nearTailRewrite = i >= prev.length - 8;
    if (nearTailRewrite) {
      setBase(prev.substring(0, i));
      setChunk(next.substring(i));
    } else {
      setBase(next.substring(0, i));
      setChunk(next.substring(i));
    }
  }, [reasoning]);

  const onDone = () => {
    if (!chunk) return;
    const target = targetRef.current || "";
    setBase(target);
    prevRef.current = target;
    setChunk("");
  };

  if (!base && !chunk) return null;

  return (
    <div className={className}>
      <span>{base}</span>
      <AnimatePresence>
        {chunk && (
          <motion.span
            key={base.length}
            initial={{ opacity: 0.2, y: 1 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onAnimationComplete={onDone}
          >
            {chunk}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
