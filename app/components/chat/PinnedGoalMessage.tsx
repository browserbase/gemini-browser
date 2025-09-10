import { motion } from "framer-motion";

interface PinnedGoalMessageProps {
  initialMessage: string;
  isScrolled: boolean;
}

export default function PinnedGoalMessage({
  initialMessage,
}: PinnedGoalMessageProps) {
  return (
    <div className="relative -mx-4 md:-mx-6 mb-4">
      <motion.div
        className={`font-ppsupply sticky top-0 z-10 w-full`}
        style={{
          backgroundColor: "rgba(245, 240, 255, 0.75)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #CAC8C7",
          width: "100%",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(245, 240, 255, 0.85), rgba(245, 240, 255, 0))",
            opacity: 0.6,
            filter: "blur(2px)",
            width: "100%",
            height: "32px",
            left: "0",
            right: "0",
            bottom: "-24px",
            zIndex: 0,
          }}
        ></div>

        <p className="break-words overflow-hidden p-6 text-ellipsis max-w-full">
          {initialMessage}
        </p>
      </motion.div>
    </div>
  );
}
