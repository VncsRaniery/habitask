"use client";

import PomodoroTimer from "@/components/estudos/pomodoro/pomodoro-timer";
import AnalyticsCard from "@/components/estudos/pomodoro/analytics-card";
import { motion } from "framer-motion";
import { AnalyticsProvider } from "@/contexts/analytics-context";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="min-h-screen flex flex-col">
        <div className="container mx-auto px-4 py-2 sm:px-6 flex flex-col">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                  Foco Pomodoro
                </h1>
                <p className="text-sm text-muted-foreground">
                  Mantenha o foco, acompanhe seu progresso
                </p>
              </div>
            </motion.div>
          </header>

          <AnalyticsProvider>
            <div className="flex flex-col gap-4 mt-2 pb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full"
              >
                <PomodoroTimer />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="w-full"
              >
                <AnalyticsCard />
              </motion.div>
            </div>
          </AnalyticsProvider>
        </div>
      </div>
    </div>
  );
}
