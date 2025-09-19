"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Layers, X } from "lucide-react";

interface NavBarProps {
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  showGitHubButton?: boolean;
  className?: string;
}

export default function NavBar({
<<<<<<< HEAD
  title = "Google CUA Browser",
=======
  title = "Google Browser",
>>>>>>> 4115299 (small updates)
  showCloseButton = false,
  onClose,
  showGitHubButton = true,
  className = "",
}: NavBarProps) {
  return (
    <motion.nav
      className={`flex justify-between items-center px-4 py-3 sm:px-8 sm:py-4 bg-white border-b border-[#CAC8C7] shadow-sm relative z-10 ${className}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <div className="flex items-center gap-2">
        <a
          href="https://www.browserbase.com/cua/google"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200"
        >
          <Image
            src="/favicon.svg"
            alt="Google CUA Browser"
            className="w-8 h-8"
            width={32}
            height={32}
          />
          <span className="font-ppsupply text-xl font-bold text-[#100D0D]">
            {title}
          </span>
        </a>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="https://www.browserbase.com/cua/google"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="flex items-center justify-center px-3 py-2 bg-white gap-1 text-sm font-medium border border-[#F14A1C] transition-all duration-200 hover:bg-[#F14A1C] group h-full">
            <Layers
              size={20}
              className="sm:mr-2 text-[#F14A1C] group-hover:text-white transition-colors duration-200"
              strokeWidth={2}
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
            <span className="hidden sm:inline text-[#F14A1C] group-hover:text-white transition-colors duration-200">
              Deploy
            </span>
          </button>
        </a>
        {showGitHubButton && (
          <a
            href="https://github.com/browserbase/google-cua-browser"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="h-fit flex items-center justify-center px-3 py-2 bg-[#1b2128] hover:bg-[#1d232b] gap-1 text-sm font-medium text-white border border-[#CAC8C7] transition-colors duration-200">
              <Image
                src="/github.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="sm:mr-2"
              />
              <span className="hidden sm:inline">View GitHub</span>
            </button>
          </a>
        )}
        {showCloseButton && onClose && (
          <motion.button
            onClick={onClose}
            className="flex items-center justify-center px-3 py-2 bg-[#F6F5F5] gap-1 text-sm font-medium border border-[#CAC8C7] transition-all duration-200 hover:bg-gray-100 h-full"
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center text-[#10100D]">
              Close
              <X
                size={16}
                className="ml-2 text-[#10100D]"
                strokeWidth={2}
              />
            </span>
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}
