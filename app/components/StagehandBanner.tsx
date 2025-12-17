"use client";

import { motion } from "framer-motion";
import { ExternalLink, Terminal } from "lucide-react";

export default function StagehandBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full bg-gradient-to-r from-[#FF3B00] to-[#F14A1C] text-white py-3 px-4 sm:px-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="flex-shrink-0" />
          <span className="text-sm sm:text-base font-medium">
            Try it out in{" "}
            <a
              href="https://www.stagehand.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline font-semibold transition-all duration-200 hover:text-yellow-200"
            >
              Stagehand
            </a>
            !
          </span>
        </div>

        <div className="hidden sm:block text-white/80">•</div>

        <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
          <span className="text-white/90">Get started with the</span>
          <a
            href="https://www.browserbase.com/templates/gemini-3-flash"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:no-underline font-semibold transition-all duration-200 hover:text-yellow-200"
            >
              Gemini 3 Flash template
          </a>
        </div>

        <a
          href="https://www.stagehand.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden sm:flex items-center gap-1 text-xs hover:text-yellow-200 transition-colors duration-200"
        >
          <span>Learn more</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
}
