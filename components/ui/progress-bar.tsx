"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  isCompleted: boolean;
}

export function ProgressBar({ value, isCompleted }: ProgressBarProps) {
  return (
    <div className="space-y-1">
      <motion.div
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
        initial={false}
        animate={{
          backgroundColor: isCompleted ? "rgb(220, 252, 231)" : "var(--muted)",
        }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${value}%`,
            backgroundColor: isCompleted
              ? "rgb(34, 197, 94)"
              : "var(--primary)",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {value > 0 && value < 100 && (
          <motion.div
            className="absolute top-0 left-0 h-full w-20 bg-white opacity-20"
            animate={{
              left: ["0%", "100%"],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              filter: "blur(8px)",
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
