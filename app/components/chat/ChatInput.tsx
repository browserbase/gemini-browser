import { RefObject } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  isWaitingForInput: boolean;
  isAgentFinished: boolean;
  userInput: string;
  setUserInput: (value: string) => void;
  onSubmit: (input: string) => Promise<void>;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function ChatInput({
  isWaitingForInput,
  isAgentFinished,
  userInput,
  setUserInput,
  onSubmit,
  inputRef,
}: ChatInputProps) {
  if (!isWaitingForInput || isAgentFinished) {
    return null;
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onAnimationComplete={() => {
        // Focus input when animation completes
        if (inputRef.current) {
          inputRef.current.focus();
          console.log("Animation complete, focusing input");
        }
      }}
      onSubmit={async (e) => {
        e.preventDefault();
        if (["quit", "exit", "bye"].includes(userInput.toLowerCase())) {
          // This should be handled by the parent component
          return;
        }
        await onSubmit(userInput);
      }}
      className="mt-4 flex gap-2 w-full"
    >
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 px-2 sm:px-4 py-2 border focus:outline-none focus:ring-1 focus:ring-[#FF3B00] focus:border-transparent font-ppsupply transition-all text-sm sm:text-base"
        style={{
          // backgroundColor: "rgba(245, 240, 255, 0.75)",
          backdropFilter: "blur(8px)",
          borderColor: "rgba(255, 59, 0, 0.5)",
          borderWidth: "2px",
        }}
      />
      <button
        type="submit"
        disabled={!userInput.trim()}
        className="px-2 sm:px-4 py-2 bg-[#FF3B00] text-white font-ppsupply disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E63500] transition-colors text-sm sm:text-base whitespace-nowrap"
      >
        Send
      </button>
    </motion.form>
  );
}
