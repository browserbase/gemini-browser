"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AnimatedButton from "./components/ui/AnimatedButton";
import posthog from "posthog-js";
import ChatFeed from "./components/ChatFeed";
import NavBar from "./components/NavBar";
import StagehandBanner from "./components/StagehandBanner";
import { Code, MessageCircle, Search, Grid3x3 } from "lucide-react";
import {
  DEFAULT_MODEL_ID,
  SUPPORTED_MODELS,
  type SupportedModelId,
  getSupportedModelById,
} from "@/constants/models";

const Tooltip = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 3, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 400,
              damping: 17,
            }}
            className="absolute w-auto px-3 py-2 min-w-max left-1/2 -translate-x-1/2 bg-[#2E191E] text-white text-xs font-ppsupply z-50 backdrop-blur-sm"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Home() {
  const [isChatVisible, setIsChatVisible] = useState(() => false);
  const [initialMessage, setInitialMessage] = useState<string | null>(
    () => null
  );
  const [selectedModelId, setSelectedModelId] = useState<SupportedModelId>(
    () => DEFAULT_MODEL_ID
  );
  const [chatModelId, setChatModelId] = useState<SupportedModelId>(
    () => DEFAULT_MODEL_ID
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const startChat = useCallback((finalMessage: string) => {
    setInitialMessage(finalMessage);
    setChatModelId(selectedModelId);
    setIsChatVisible(true);

    try {
      posthog.capture("google_cua_submit_message", {
        message: finalMessage,
        model: selectedModelId,
      });
    } catch (e) {
      console.error(e);
    }
  }, [selectedModelId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle CMD+Enter to submit the form when chat is not visible
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        const form = document.querySelector("form") as HTMLFormElement;
        if (form) {
          form.requestSubmit();
        }
      }

      // Handle CMD+K to focus input when chat is not visible
      if (!isChatVisible && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector(
          'input[name="message"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }

      // Handle ESC to close chat when visible
      if (isChatVisible && e.key === "Escape") {
        e.preventDefault();
        setIsChatVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatVisible]);

  return (
    <AnimatePresence>
      {!isChatVisible ? (
        <div className="min-h-screen bg-gray-50 flex flex-col relative">
          {/* Grid Background */}
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
          {/* Top Navigation */}
          <NavBar />

          {/* Stagehand Banner */}
          <StagehandBanner />

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-24 lg:pb-32 px-6 z-10">
            <div className="w-full max-w-[640px] md:max-w-[800px] lg:max-w-[960px] bg-white border border-[#CAC8C7] shadow-sm z-10">
              <div className="w-full h-12 md:h-16 bg-white border-b border-[#CAC8C7] flex items-center px-4 md:px-6">
                <div className="flex items-center gap-2">
                  <Tooltip text="why would you want to close this?">
                    <div className="w-3 h-3  bg-red-500 hover:scale-110 transition-transform" />
                  </Tooltip>
                  <Tooltip text="s/o to the 🅱️rowserbase devs">
                    <div className="w-3 h-3  bg-yellow-500 hover:scale-110 transition-transform" />
                  </Tooltip>
                  <Tooltip text="@kylejeong21 & @miguel_gonzf were here">
                    <div className="w-3 h-3  bg-green-500 hover:scale-110 transition-transform" />
                  </Tooltip>
                </div>
              </div>

              <div className="p-8 md:p-10 lg:p-12 flex flex-col items-center gap-8 md:gap-10">
                <div className="flex flex-col items-center gap-3 md:gap-5">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-ppneue text-gray-900 text-center">
                    Gemini Browser
                  </h1>
                  <p className="text-base md:text-lg font-ppsupply text-gray-500 text-center">
                    Choose a model and hit run to watch AI browse the web.
                  </p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const input = e.currentTarget.querySelector(
                      'input[name="message"]'
                    ) as HTMLInputElement;
                    const message = (formData.get("message") as string).trim();
                    const finalMessage = message || input.placeholder;
                    startChat(finalMessage);
                  }}
                  className="w-full max-w-[720px] md:max-w-[880px] lg:max-w-[1040px] flex flex-col items-center gap-3 md:gap-5"
                >
                  <div className="relative w-full">
                    <input
                      ref={inputRef}
                      name="message"
                      type="text"
                      placeholder="What's the price of NVIDIA stock?"
                      className="w-full px-4 py-3 sm:pr-[140px] pr-[100px] border border-[#CAC8C7] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-[#FF3B00] font-ppsupply text-sm md:text-base md:py-5 lg:py-6 transition-all duration-300 focus:pulse-glow-red focus:backdrop-blur-sm focus:bg-opacity-95 focus:bg-white"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        backdropFilter: "blur(8px)",
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AnimatedButton type="submit">Run</AnimatedButton>
                    </div>
                  </div>

                  <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <label className="flex items-center gap-2 text-xs md:text-sm font-ppsupply text-gray-500">
                      <span>Model</span>
                      <select
                        value={selectedModelId}
                        onChange={(e) =>
                          setSelectedModelId(e.target.value as SupportedModelId)
                        }
                        className="px-3 py-2 border border-[#CAC8C7] bg-white text-gray-900 font-ppsupply text-xs md:text-sm focus:outline-none focus:ring-0 focus:border-[#FF3B00] transition-colors rounded-none"
                      >
                        {SUPPORTED_MODELS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label} — {m.description}
                          </option>
                        ))}
                      </select>
                    </label>
                    <span className="text-xs font-ppsupply text-gray-400">
                      {getSupportedModelById(selectedModelId).id}
                    </span>
                  </div>
                </form>
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 w-full">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    onClick={() =>
                      startChat(
                        "Find the most recently opened non-draft PR on Github for Browserbase's Stagehand project and make sure the combination-evals in the PR validation passed."
                      )
                    }
                    className="p-3 md:p-5 lg:p-6 text-sm md:text-base lg:text-xl text-[#2E191E] border border-[#CAC8C7] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors font-ppsupply font-medium text-center overflow-hidden text-ellipsis break-words whitespace-normal md:min-h-[100px] lg:min-h-[120px] flex items-center justify-center backdrop-blur-sm bg-opacity-60 bg-[rgba(245,240,255,0.15)] hover:bg-[rgba(255,59,0,0.05)] rounded-none"
                  >
                    <div className="w-full h-full flex flex-row justify-between items-start px-3 py-2 md:px-4 md:py-3 space-y-3">
                      <span className="text-left">
                        Review a pull request
                        <br />
                        on Github
                      </span>
                      <Code className="" size={20} strokeWidth={1.5} />
                    </div>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    onClick={() =>
                      startChat(
                        "Go to Hacker News and find the most controversial post from today, then read the top 3 comments and summarize the debate."
                      )
                    }
                    className="p-3 md:p-5 lg:p-6 text-sm md:text-base lg:text-xl text-[#2E191E] border border-[#CAC8C7] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors font-ppsupply font-medium text-center overflow-hidden text-ellipsis break-words whitespace-normal md:min-h-[100px] lg:min-h-[120px] flex items-center justify-center backdrop-blur-sm bg-opacity-60 bg-[rgba(245,240,255,0.15)] hover:bg-[rgba(255,59,0,0.05)] rounded-none"
                  >
                    <div className="w-full h-full flex flex-row justify-between items-start px-3 py-2 md:px-4 md:py-3">
                      <span className="text-left">
                        Browse Hacker News
                        <br />
                        for trending debates
                      </span>
                      <MessageCircle
                        size={20}
                        strokeWidth={1.5}
                        className="rounded-none"
                      />
                    </div>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    onClick={() =>
                      startChat(
                        "Play a game of 2048 on https://www.2048.org/. Just try to win and I'll watch. Good luck!"
                      )
                    }
                    className="p-3 md:p-5 lg:p-6 text-sm md:text-base lg:text-xl text-[#2E191E] border border-[#CAC8C7] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors font-ppsupply font-medium text-center overflow-hidden text-ellipsis break-words whitespace-normal md:min-h-[100px] lg:min-h-[120px] flex items-center justify-center backdrop-blur-sm bg-opacity-60 bg-[rgba(245,240,255,0.15)] hover:bg-[rgba(255,59,0,0.05)] rounded-none"
                  >
                    <div className="w-full h-full flex flex-row justify-between items-start px-3 py-2 md:px-4 md:py-3 space-y-3">
                      <span className="text-left">
                        Play a game of
                        <br />
                        2048
                      </span>
                      <Grid3x3
                        size={20}
                        strokeWidth={1.5}
                        className="rounded-none"
                      />
                    </div>
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    onClick={() =>
                      startChat(
                        "Find the current price of Bitcoin and Ethereum."
                      )
                    }
                    className="p-3 md:p-5 lg:p-6 text-sm md:text-base lg:text-xl text-[#2E191E] border border-[#CAC8C7] hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors font-ppsupply font-medium text-center overflow-hidden text-ellipsis break-words whitespace-normal md:min-h-[100px] lg:min-h-[120px] flex items-center justify-center backdrop-blur-sm bg-opacity-60 bg-[rgba(245,240,255,0.15)] hover:bg-[rgba(255,59,0,0.05)] rounded-none"
                  >
                    <div className="w-full h-full flex flex-row justify-between items-start px-3 py-2 md:px-4 md:py-3 space-y-3">
                      <span className="text-left">
                        Get the latest crypto prices
                        <br />
                      </span>
                      <Search
                        size={20}
                        strokeWidth={1.5}
                        className="rounded-none"
                      />
                    </div>
                  </motion.button>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                  className="text-center text-xs text-gray-500"
                >
                  <p>Or type your own request</p>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: [0.25, 0.1, 0.25, 1.0],
                staggerChildren: 0.1,
              }}
              className="bg-[#28171B] p-4 md:p-6 lg:p-8 mt-8 md:mt-10 w-full max-w-[640px] md:max-w-[800px] lg:max-w-[960px] relative overflow-hidden backdrop-blur-sm bg-opacity-90"
            >
              {/* Tech animation background elements */}
              <motion.div
                className="absolute inset-0 opacity-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute top-0 right-0 sm:w-20 sm:h-20 w-16 h-16 bg-[#FF3B00] rounded-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-400 rounded-full blur-xl"></div>
              </motion.div>

              <motion.p
                className="text-base md:text-lg font-ppsupply text-center text-white relative z-10 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                Powered by{" "}
                <motion.a
                  href="https://browserbase.com"
                  className="text-[#FF3B00] hover:underline relative"
                  whileHover={{ scale: 1.05 }}
                >
                  Browserbase & Stagehand
                </motion.a>{" "}
              </motion.p>
            </motion.div>
          </main>
        </div>
      ) : (
        <ChatFeed
          key={`chat-feed-${initialMessage}-${chatModelId}`}
          initialMessage={initialMessage}
          modelId={chatModelId}
          onClose={() => setIsChatVisible(false)}
        />
      )}
    </AnimatePresence>
  );
}
