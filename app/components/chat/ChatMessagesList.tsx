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
  // Filter out empty first steps
  const filteredSteps = steps.filter((step, index) => {
    // Hide first step if it's empty or placeholder
    if (index === 0 && step.tool === "MESSAGE" && !step.text?.trim() && !step.reasoning?.trim()) {
      return false;
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
        />
      ))}

    </div>
  );
}
