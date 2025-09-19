import { RefObject } from "react";
import { BrowserStep } from "../../types/ChatFeed";
import ChatMessage from "./ChatMessage";

interface ChatMessagesListProps {
  steps: BrowserStep[];
  chatContainerRef: RefObject<HTMLDivElement | null>;
  isMobile: boolean;
}

export default function ChatMessagesList({
  steps,
  chatContainerRef,
  isMobile,
}: ChatMessagesListProps) {
  // Check if we have a final answer
  const hasFinalAnswer = steps.some(step => step.tool === "MESSAGE" && step.instruction === "Final Answer");

  // Filter out empty first steps and final answer
  const filteredSteps = steps.filter((step, index) => {
    // Hide first step if it's empty or placeholder
    if (index === 0 && step.tool === "MESSAGE" && !step.text?.trim() && !step.reasoning?.trim()) {
      return false;
    }
    // Hide final answer (it will be shown outside the list)
    if (step.tool === "MESSAGE" && step.instruction === "Final Answer") {
      return false;
    }
    // If we have a final answer, also hide the last MESSAGE step before it (which often contains duplicate answer text)
    if (hasFinalAnswer && step.tool === "MESSAGE") {
      // Find if this is the last non-final-answer MESSAGE step
      const nonFinalMessages = steps.filter(s =>
        s.tool === "MESSAGE" && s.instruction !== "Final Answer"
      );
      const lastMessage = nonFinalMessages[nonFinalMessages.length - 1];
      if (lastMessage === step) {
        return false;
      }
    }
    return true;
  });

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 hide-scrollbar"
      style={{
        height: isMobile
          ? "calc(100vh - 400px)"
          : "calc(100% - 100px)",
        flex: "1 1 auto",
        position: "relative",
      }}
    >
      {filteredSteps.map((step, index) => (
        <ChatMessage
          key={step.stepNumber ?? index}
          step={step}
          index={index}
          previousSteps={filteredSteps.slice(0, index)}
        />
      ))}

    </div>
  );
}
