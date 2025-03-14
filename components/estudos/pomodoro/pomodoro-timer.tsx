"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Clock,
  Brain,
  Zap,
  LogIn,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAnalytics } from "@/contexts/analytics-context";
import { useRouter } from "next/navigation";

type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

const TIMER_MODES = {
  pomodoro: {
    label: "Pomodoro",
    time: 25 * 60,
    color: "bg-primary",
    hoverColor: "hover:bg-primary/90",
    textColor: "text-primary",
    ringColor: "ring-primary/30",
    gradientFrom: "from-primary/20",
    gradientTo: "to-primary/5",
    icon: <Brain className="h-4 w-4 mr-1.5" />,
    message: "Concentre-se na sua tarefa até o fim do temporizador",
  },
  shortBreak: {
    label: "Pausa Curta",
    time: 5 * 60,
    color: "bg-cyan-500",
    hoverColor: "hover:bg-cyan-500/90",
    textColor: "text-cyan-500",
    ringColor: "ring-cyan-500/30",
    gradientFrom: "from-cyan-500/20",
    gradientTo: "to-cyan-500/5",
    icon: <Coffee className="h-4 w-4 mr-1.5" />,
    message: "Faça uma pequena pausa e relaxe",
  },
  longBreak: {
    label: "Pausa Longa",
    time: 15 * 60,
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-500/90",
    textColor: "text-blue-500",
    ringColor: "ring-blue-500/30",
    gradientFrom: "from-blue-500/20",
    gradientTo: "to-blue-500/5",
    icon: <Zap className="h-4 w-4 mr-1.5" />,
    message: "Descanse por mais tempo para recarregar sua energia",
  },
};

export default function PomodoroTimer() {
  const { triggerRefresh } = useAnalytics();
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [time, setTime] = useState(TIMER_MODES[mode].time);
  const [isActive, setIsActive] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [isOvertime, setIsOvertime] = useState(false);
  const [extraTime, setExtraTime] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [totalPauseTime, setTotalPauseTime] = useState(0);
  const [isAuthError, setIsAuthError] = useState(false);
  const router = useRouter();
  const pauseStartTimeRef = useRef<number | null>(null);
  const originalTimeRef = useRef(TIMER_MODES[mode].time);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const isNegative = seconds < 0;
    const absoluteSeconds = Math.abs(seconds);
    const mins = Math.floor(absoluteSeconds / 60);
    const secs = absoluteSeconds % 60;
    return `${isNegative ? "-" : ""}${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const resetTimer = useCallback(async () => {
    if (sessionId) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isCompleted: false,
            endTime: new Date(),
            extraTime: isOvertime ? extraTime : 0,
            pauseCount: pauseCount,
            totalPauseTime: totalPauseTime,
          }),
        });

        if (response.status === 401) {
          setIsAuthError(true);
          toast.error(
            "Você precisa estar autenticado para salvar suas sessões"
          );
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao atualizar sessão");
        }

        triggerRefresh();

        toast.info("Sessão reiniciada e marcada como incompleta", {
          icon: <RotateCcw className="h-4 w-4" />,
        });
      } catch {
        console.error("Falha ao atualizar sessão");
        toast.error("Falha ao atualizar sessão");
      } finally {
        setIsLoading(false);
      }
    }

    setIsActive(false);
    setTime(TIMER_MODES[mode].time);
    setSessionId(null);
    setIsOvertime(false);
    setExtraTime(0);
    setPauseCount(0);
    setTotalPauseTime(0);
    originalTimeRef.current = TIMER_MODES[mode].time;
  }, [
    mode,
    sessionId,
    isOvertime,
    extraTime,
    pauseCount,
    totalPauseTime,
    triggerRefresh,
  ]);

  const toggleTimer = async () => {
    if (!isActive && !sessionId) {
      try {
        setIsLoading(true);
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: mode,
            startTime: new Date(),
            isCompleted: false,
            duration: TIMER_MODES[mode].time,
            pauseCount: 0,
            totalPauseTime: 0,
          }),
        });

        if (response.status === 401) {
          setIsAuthError(true);
          toast.error(
            "Você precisa estar autenticado para salvar suas sessões"
          );
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao criar sessão");
        }

        const result = await response.json();
        setSessionId(result.id);
        setIsActive(true);
        setIsLoading(false);
        originalTimeRef.current = TIMER_MODES[mode].time;

        toast.success(`Sessão de ${TIMER_MODES[mode].label} iniciada`, {
          icon: <Play className="h-4 w-4" />,
        });
      } catch {
        setIsLoading(false);
        toast.error("Falha ao iniciar sessão");
      }
    } else if (!isActive && sessionId) {
      if (pauseStartTimeRef.current) {
        const pauseDuration = Math.floor(
          (Date.now() - pauseStartTimeRef.current) / 1000
        );
        setTotalPauseTime((prev) => prev + pauseDuration);
        pauseStartTimeRef.current = null;
      }

      setIsActive(true);
      toast.info("Sessão retomada", {
        icon: <Play className="h-4 w-4" />,
      });
    } else {
      setPauseCount((prev) => prev + 1);
      pauseStartTimeRef.current = Date.now();
      setIsActive(false);
      toast.info("Sessão pausada", {
        icon: <Pause className="h-4 w-4" />,
      });
    }
  };

  const completeSession = async () => {
    if (sessionId) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isCompleted: true,
            endTime: new Date(),
            extraTime: isOvertime ? extraTime : 0,
            pauseCount: pauseCount,
            totalPauseTime: totalPauseTime,
          }),
        });

        if (response.status === 401) {
          setIsAuthError(true);
          toast.error(
            "Você precisa estar autenticado para salvar suas sessões"
          );
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Falha ao atualizar sessão");
        }

        triggerRefresh();

        setShowCompletionAnimation(true);
        setTimeout(() => {
          setShowCompletionAnimation(false);
          resetTimer();
          setIsLoading(false);
        }, 2000);

        const sessionType = mode === "pomodoro" ? "foco" : "pausa";
        const extraTimeMsg = isOvertime
          ? ` (+${Math.floor(extraTime / 60)}m ${extraTime % 60}s extra)`
          : "";

        toast.success(
          mode === "pomodoro"
            ? `Ótimo trabalho! Sessão de ${sessionType} concluída${extraTimeMsg}.`
            : `Pausa finalizada${extraTimeMsg}. Pronto para focar?`,
          {
            icon: <CheckCircle2 className="h-4 w-4" />,
          }
        );
      } catch {
        setIsLoading(false);
        toast.error("Falha ao completar sessão");
      }
    }
  };

  const changeMode = (newMode: TimerMode) => {
    if (isActive) {
      completeSession().then(() => {
        setMode(newMode);
        setTime(TIMER_MODES[newMode].time);
        originalTimeRef.current = TIMER_MODES[newMode].time;
      });
    } else if (sessionId) {
      resetTimer().then(() => {
        setMode(newMode);
        setTime(TIMER_MODES[newMode].time);
        originalTimeRef.current = TIMER_MODES[newMode].time;
      });
    } else {
      setMode(newMode);
      setTime(TIMER_MODES[newMode].time);
      setIsOvertime(false);
      setExtraTime(0);
      originalTimeRef.current = TIMER_MODES[newMode].time;
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;

          if (newTime === -1 && !isOvertime) {
            setIsOvertime(true);
            toast.info("Tempo esgotado! O temporizador está em tempo extra.", {
              icon: <AlertCircle className="h-4 w-4" />,
            });
          }

          if (newTime < 0) {
            setExtraTime((prev) => prev + 1);
          }

          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isOvertime]);

  const calculateProgress = () => {
    if (time >= 0) {
      return ((originalTimeRef.current - time) / originalTimeRef.current) * 100;
    } else {
      return 100 + (Math.abs(time) / (originalTimeRef.current / 2)) * 20;
    }
  };

  const progress = calculateProgress();
  const currentModeStyles = TIMER_MODES[mode];

  const TimerSkeleton = () => (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full animate-pulse bg-muted" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-8 bg-muted rounded-md animate-pulse" />
            <div className="w-12 h-3 bg-muted rounded-md animate-pulse mt-1" />
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-center">
        <div className="w-24 h-9 bg-muted rounded-full animate-pulse" />
        <div className="w-24 h-9 bg-muted rounded-full animate-pulse" />
      </div>
    </div>
  );

  const AuthErrorComponent = () => (
    <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
      <LogIn className="h-12 w-12 text-primary mx-auto mb-3" />
      <h3 className="text-lg font-medium mb-2">Autenticação Necessária</h3>
      <p className="text-muted-foreground text-sm mb-4 max-w-xs mx-auto">
        Você pode usar o temporizador, mas precisa estar autenticado para salvar
        suas sessões e ver suas estatísticas.
      </p>
      <Button
        variant="default"
        size="sm"
        className="mt-2"
        onClick={() => router.push("/login")}
      >
        Fazer Login
      </Button>
    </div>
  );

  return (
    <Card className="shadow-xl overflow-hidden border-0 backdrop-blur-sm bg-background/80 flex flex-col elegant-card-hover">
      <motion.div
        className={cn(
          "h-1 bg-gradient-to-r",
          isOvertime
            ? "from-orange-500/50 to-red-500/50"
            : `${currentModeStyles.gradientFrom} ${currentModeStyles.gradientTo}`
        )}
        initial={{ width: "0%" }}
        animate={{ width: isActive ? "100%" : "0%" }}
        transition={{ duration: isActive ? 0.5 : 0.2 }}
      />
      <CardContent className="p-3 flex flex-col">
        {isAuthError ? (
          <AuthErrorComponent />
        ) : (
          <>
            <Tabs
              defaultValue="pomodoro"
              className="w-full"
              onValueChange={(value) => changeMode(value as TimerMode)}
            >
              <TabsList className="grid grid-cols-3 mb-3 rounded-full p-1 shadow-sm">
                <TabsTrigger
                  value="pomodoro"
                  className="rounded-full data-[state=active]:shadow-md transition-all duration-200 text-xs sm:text-sm"
                >
                  Pomodoro
                </TabsTrigger>
                <TabsTrigger
                  value="shortBreak"
                  className="rounded-full data-[state=active]:shadow-md transition-all duration-200 text-xs sm:text-sm"
                >
                  Pausa Curta
                </TabsTrigger>
                <TabsTrigger
                  value="longBreak"
                  className="rounded-full data-[state=active]:shadow-md transition-all duration-200 text-xs sm:text-sm"
                >
                  Pausa Longa
                </TabsTrigger>
              </TabsList>

              {Object.entries(TIMER_MODES).map(([key]) => (
                <TabsContent key={key} value={key} className="mt-0">
                  {isLoading ? (
                    <TimerSkeleton />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4 mx-auto">
                        <AnimatePresence>
                          {showCompletionAnimation && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center z-10"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 1.2, opacity: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div
                                className={cn(
                                  "w-full h-full rounded-full flex items-center justify-center",
                                  currentModeStyles.color,
                                  "bg-opacity-20"
                                )}
                              >
                                <CheckCircle2 className="w-20 h-20 sm:w-24 sm:h-24 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <svg
                          className="w-full h-full -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="hsl(var(--muted))"
                            strokeWidth="2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={
                              isOvertime
                                ? "#f97316"
                                : mode === "pomodoro"
                                ? "hsl(var(--primary))"
                                : mode === "shortBreak"
                                ? "#06b6d4"
                                : "#3b82f6"
                            }
                            strokeWidth="4"
                            strokeDasharray="282.7"
                            strokeDashoffset={
                              282.7 - (282.7 * Math.min(progress, 120)) / 100
                            }
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 282.7 }}
                            animate={{
                              strokeDashoffset:
                                282.7 - (282.7 * Math.min(progress, 120)) / 100,
                            }}
                            transition={{ duration: 0.5 }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <motion.span
                              className={cn(
                                "text-5xl sm:text-6xl font-bold tabular-nums tracking-tight",
                                isOvertime ? "text-orange-500" : "text-gradient"
                              )}
                              key={time}
                              initial={{ opacity: 0.8, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {formatTime(time)}
                            </motion.span>
                            <motion.span
                              className={cn(
                                "text-xs sm:text-sm mt-1",
                                isOvertime
                                  ? "text-orange-500"
                                  : currentModeStyles.textColor
                              )}
                            >
                              {isOvertime
                                ? "Tempo Extra"
                                : isActive
                                ? "Em andamento"
                                : "Pronto"}
                            </motion.span>

                            {pauseCount > 0 && (
                              <motion.div
                                className="flex items-center gap-1 mt-1 text-xs text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <Pause className="h-3 w-3" />
                                <span>
                                  {pauseCount}{" "}
                                  {pauseCount === 1 ? "pausa" : "pausas"}
                                </span>
                              </motion.div>
                            )}
                          </motion.div>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2">
                        <Button
                          size="default"
                          onClick={toggleTimer}
                          disabled={isLoading}
                          className={cn(
                            "rounded-full px-4 sm:px-6 transition-all duration-300 shadow-md focus-ring",
                            isOvertime
                              ? "bg-orange-500 hover:bg-orange-600"
                              : currentModeStyles.color,
                            isOvertime ? "" : currentModeStyles.hoverColor,
                            "w-28 sm:w-32 text-sm font-medium"
                          )}
                        >
                          {isLoading ? (
                            <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          ) : (
                            <>
                              {isActive ? (
                                <Pause className="mr-2 h-4 w-4" />
                              ) : (
                                <Play className="mr-2 h-4 w-4" />
                              )}
                              {isActive
                                ? "Pausar"
                                : sessionId
                                ? "Retomar"
                                : "Iniciar"}
                            </>
                          )}
                        </Button>

                        <AnimatePresence>
                          {isOvertime && sessionId && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, width: 0 }}
                              animate={{ opacity: 1, scale: 1, width: "auto" }}
                              exit={{ opacity: 0, scale: 0.8, width: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Button
                                size="default"
                                variant="outline"
                                onClick={completeSession}
                                disabled={isLoading}
                                className="rounded-full px-4 sm:px-6 transition-all duration-300 border-orange-500 text-orange-500 hover:bg-orange-500/10 text-sm"
                              >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Completar
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <Button
                          size="default"
                          variant="outline"
                          onClick={resetTimer}
                          disabled={
                            isLoading ||
                            (time === TIMER_MODES[mode].time && !sessionId)
                          }
                          className="rounded-full px-4 sm:px-6 transition-all duration-300 text-sm"
                        >
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Reiniciar
                        </Button>
                      </div>

                      <AnimatePresence>
                        {isOvertime && (
                          <motion.div
                            className="mt-3 text-orange-500 text-xs sm:text-sm flex items-center bg-orange-500/10 px-3 py-1.5 rounded-full"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                            Tempo Extra: {Math.floor(extraTime / 60)}m{" "}
                            {extraTime % 60}s
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            <motion.div
              className="mt-2 text-center text-muted-foreground glass-morphism p-2 rounded-xl text-xs sm:text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="flex items-center justify-center">
                {TIMER_MODES[mode].icon}
                <span>{TIMER_MODES[mode].message}</span>
              </p>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
