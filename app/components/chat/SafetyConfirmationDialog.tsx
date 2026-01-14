"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { PendingSafetyConfirmation, SafetyCheck } from "@/app/types/Agent";

interface SafetyConfirmationDialogProps {
  confirmation: PendingSafetyConfirmation;
  onRespond: (acknowledged: boolean) => void;
}

interface ParsedMessage {
  explanation?: string;
  decision?: string;
  raw?: string;
}

function parseCheckMessage(message: string): ParsedMessage {
  try {
    const parsed = JSON.parse(message);
    if (typeof parsed === "object" && parsed !== null) {
      return {
        explanation: parsed.explanation,
        decision: parsed.decision,
      };
    }
  } catch {
    // Not JSON, return as raw text
  }
  return { raw: message };
}

function SafetyCheckItem({ check }: { check: SafetyCheck }) {
  const parsed = useMemo(
    () => parseCheckMessage(check.message),
    [check.message],
  );

  return (
    <div className="space-y-3">
      {parsed.explanation ? (
        <p className="text-[#2E191E] text-sm leading-relaxed">
          {parsed.explanation}
        </p>
      ) : parsed.raw ? (
        <p className="text-[#2E191E] text-sm leading-relaxed">{parsed.raw}</p>
      ) : null}
    </div>
  );
}

export default function SafetyConfirmationDialog({
  confirmation,
  onRespond,
}: SafetyConfirmationDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="font-ppsupply border border-[#CAC8C7] shadow-sm overflow-hidden"
      style={{
        backgroundColor: "rgba(245, 240, 255, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#CAC8C7] bg-white/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-[#FF3B00] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              strokeLinejoin="miter"
              className="w-4 h-4"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M3.262 17.633C2.462 18.943 3.413 20.5 4.914 20.5h14.172c1.501 0 2.452-1.557 1.652-2.867L13.652 4.367c-.8-1.31-2.504-1.31-3.304 0L3.262 17.633z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#2E191E] text-sm">
              Action Requires Approval
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Review this action before proceeding
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {confirmation.checks.map((check) => (
          <SafetyCheckItem key={check.id} check={check} />
        ))}
      </div>

      {/* Actions */}
      <div className="flex border-t border-[#CAC8C7]">
        <motion.button
          onClick={() => onRespond(false)}
          className="flex-1 px-4 py-3 bg-white/60 hover:bg-white text-[#2E191E] font-medium text-sm transition-colors border-r border-[#CAC8C7]"
          whileTap={{ scale: 0.98 }}
        >
          Deny
        </motion.button>
        <motion.button
          onClick={() => onRespond(true)}
          className="flex-1 px-4 py-3 bg-[#FF3B00] hover:bg-[#E63500] text-white font-medium text-sm transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          Allow
        </motion.button>
      </div>
    </motion.div>
  );
}
