"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface DayCardIndicatorProps {
  completed: boolean;
  total: number;
  completedCount: number;
  isToday: boolean;
}

export function DayCardIndicator({
  completed,
  total,
  isToday,
}: DayCardIndicatorProps) {
  if (total === 0 || !completed) return null;

  return (
    <motion.div
      className="absolute top-2 right-2 z-10"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: 0.2,
      }}
    >
      <div
        className={`rounded-full p-2 ${
          isToday ? "bg-primary text-primary-foreground" : "bg-green-100"
        }`}
      >
        <CheckCircle2
          className={`h-5 w-5 ${isToday ? "text-white" : "text-green-600"}`}
        />
      </div>
      <motion.div
        className="absolute -inset-1 rounded-full"
        initial={{ opacity: 0.8, scale: 1 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
          ease: "easeOut",
        }}
        style={{
          background: `radial-gradient(circle, ${
            isToday ? "rgba(59, 130, 246, 0.4)" : "rgba(34, 197, 94, 0.4)"
          } 0%, transparent 70%)`,
        }}
      />
    </motion.div>
  );
}
