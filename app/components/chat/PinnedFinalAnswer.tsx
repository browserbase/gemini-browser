import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createMarkdownComponents } from "@/app/components/chat/markdown";

interface PinnedFinalAnswerProps {
  message: string;
}

export default function PinnedFinalAnswer({
  message,
}: PinnedFinalAnswerProps) {
  return (
    <div className="relative -mx-4 md:-mx-6 mt-4">
      <motion.div
        className="font-ppsupply sticky bottom-0 z-10 w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: "rgba(245, 240, 255, 0.75)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid #CAC8C7",
          width: "100%",
          position: "sticky",
          bottom: 0,
          zIndex: 10,
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(245, 240, 255, 0.85), rgba(245, 240, 255, 0))",
            opacity: 0.6,
            filter: "blur(2px)",
            width: "100%",
            height: "32px",
            left: "0",
            right: "0",
            top: "-24px",
            zIndex: 0,
          }}
        ></div>

        <div className="break-words overflow-hidden p-6 text-ellipsis max-w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={createMarkdownComponents("text-gray-700")}
          >
            {message}
          </ReactMarkdown>
        </div>
      </motion.div>
    </div>
  );
}