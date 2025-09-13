"use client";

import { motion } from "framer-motion";
import { BrowserStep } from "../../types/ChatFeed";

interface ChatMessageProps {
  step: BrowserStep;
}

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

export default function ChatMessage({ step }: ChatMessageProps) {
  const isUserInput = step.tool === "MESSAGE" && step.reasoning === "User input";
  const isCompletionMessage = step.tool === "MESSAGE" && step.reasoning === "Task execution completed";
  const isPreemptive = step.tool === "MESSAGE" && !isUserInput && !isCompletionMessage;

  if (isPreemptive && !step.reasoning?.length) return null;

  return (
    <motion.div
      className={`p-6 border border-[#E5E5E5] font-ppsupply space-y-3 ${
        isUserInput ? "bg-white shadow-sm" : "transition-colors"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs w-6 h-6 flex items-center justify-center font-semibold text-gray-600 border bg-gray-200">
            {step.stepNumber}
          </span>
          <span className="py-1 font-medium text-[#2E191E] text-sm">
            {toolNameMapping[step.tool] || step.tool}
          </span>
        </div>
      </div>

      <div className="text-sm leading-relaxed">
        <div className="space-y-2">
          {isCompletionMessage ? (
            step.text && <div>{step.text}</div>
          ) : (
            <>
              {step.reasoning && (
                <div className="text-[#2E191E]">{step.reasoning}</div>
              )}
              {step.text && <div>{step.text}</div>}
            </>
          )}

          {step.actionArgs !== undefined && (
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
                <div className="font-semibold text-gray-700">Arguments:</div>
                <pre className="p-3 bg-white overflow-x-auto border border-gray-200 text-xs font-mono text-gray-700">
                  {JSON.stringify(step.actionArgs, null, 2)}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </motion.div>
  );
}
