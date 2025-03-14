"use client";

import type React from "react";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  Coffee,
  TrendingUp,
  AlarmClock,
  TimerOff,
  Timer,
  Hourglass,
  Pause,
  BarChart,
  PieChart,
  Scale,
  AlertTriangle,
  LogIn,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsData } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/contexts/analytics-context";
import { useRouter } from "next/navigation";

export default function AnalyticsCard() {
  const { refreshTrigger, isRefreshing } = useAnalytics();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<"day" | "week">("day");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "breaks" | "time" | "completion"
  >("overview");
  const router = useRouter();
  const isMounted = useRef(true);
  const fetchingRef = useRef(false);

  // Function to fetch analytics data - usando useCallback para evitar recriações
  const fetchAnalytics = useCallback(async () => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;

    fetchingRef.current = true;

    if (!isMounted.current) return;

    setLoading(true);
    setError(null);
    setIsAuthError(false);

    try {
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`);

      if (response.status === 401) {
        setIsAuthError(true);
        setError("Você precisa estar autenticado para ver suas análises");
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      if (!response.ok) {
        throw new Error("Falha ao buscar análises");
      }

      const data = await response.json();

      // Only update state if component is still mounted
      if (isMounted.current) {
        setAnalytics(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Falha ao buscar análises:", error);
      if (isMounted.current) {
        setError("Falha ao carregar dados de análise");
        setLoading(false);
      }
    } finally {
      fetchingRef.current = false;
    }
  }, [timeframe]);

  useEffect(() => {
    isMounted.current = true;

    fetchAnalytics();

    return () => {
      isMounted.current = false;
    };
  }, [timeframe, refreshTrigger, fetchAnalytics]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatRatio = (ratio: number) => {
    if (ratio === Number.POSITIVE_INFINITY) return "∞";
    if (ratio === 0) return "0";
    return ratio.toFixed(1) + ":1";
  };

  const SkeletonItem = ({ index }: { index: number }) => (
    <motion.div
      className="flex items-center gap-3 p-3 rounded-xl bg-card/80 backdrop-blur-sm border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      layout
    >
      <div className="p-2 rounded-full bg-muted animate-pulse w-8 h-8" />
      <div className="w-full">
        <div className="h-2 bg-muted rounded animate-pulse w-14 mb-2" />
        <div className="h-5 bg-muted rounded animate-pulse w-10" />
      </div>
    </motion.div>
  );

  const HeaderSkeleton = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-5 bg-muted rounded w-28" />
      <div className="h-3 bg-muted rounded w-40" />
      <div className="mt-2 space-y-2">
        <div className="h-8 bg-muted rounded-full w-full" />
        <div className="h-8 bg-muted rounded-full w-full" />
      </div>
    </div>
  );

  const EmptySkeleton = () => (
    <div className="flex flex-col items-center justify-center py-6 px-4 space-y-3">
      <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
      <div className="h-4 bg-muted rounded w-32 animate-pulse" />
      <div className="h-3 bg-muted rounded w-48 animate-pulse" />
    </div>
  );

  const AnalyticItem = ({
    icon,
    title,
    value,
    color,
    index,
    tooltip,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color?: string;
    index: number;
    tooltip?: string;
  }) => (
    <motion.div
      className={cn(
        "flex items-center gap-2 p-2 rounded-lg glass-morphism shadow-sm",
        "hover:shadow-md transition-all duration-300",
        "relative group hover:bg-card/90"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 * index }}
      whileHover={{
        y: -2,
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      }}
      layout
    >
      <div
        className={cn(
          "p-1.5 rounded-full",
          color || "bg-primary/10 text-primary"
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium">{title}</p>
        <p className="text-base sm:text-lg font-semibold">{value}</p>
      </div>

      {tooltip && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-card/95 backdrop-blur-sm rounded-xl z-10">
          <p className="text-xs text-center px-4">{tooltip}</p>
        </div>
      )}
    </motion.div>
  );

  const AuthErrorComponent = () => (
    <motion.div
      key="auth-error"
      className="text-center py-6 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <LogIn className="h-10 w-10 text-primary mx-auto mb-3" />
      <h3 className="text-base font-medium mb-2">Autenticação Necessária</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Você precisa estar autenticado para ver suas análises de produtividade.
      </p>
      <Button
        variant="default"
        size="sm"
        className="mt-2"
        onClick={() => router.push("/login")}
      >
        Fazer Login
      </Button>
    </motion.div>
  );

  return (
    <Card className="shadow-xl h-full border-0 overflow-hidden backdrop-blur-sm bg-background/80 flex flex-col elegant-card-hover relative">
      <motion.div
        className="h-1 bg-gradient-to-r from-primary/20 to-primary/5"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8 }}
      />
      <CardHeader className="pb-2 border-b border-border/40 relative p-3">
        {loading && !analytics ? (
          <HeaderSkeleton />
        ) : (
          <>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-4 w-4 text-primary" />
              Análises
            </CardTitle>
            <CardDescription className="text-xs">
              Acompanhe suas métricas de produtividade
            </CardDescription>
            {isRefreshing && (
              <motion.div
                className="absolute top-3 right-3 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </motion.div>
            )}
            {!isAuthError && (
              <div className="flex flex-col gap-2 mt-1">
                <Tabs
                  defaultValue="day"
                  className="w-full"
                  onValueChange={(value) =>
                    setTimeframe(value as "day" | "week")
                  }
                >
                  <TabsList className="grid grid-cols-2 rounded-full p-1 shadow-sm bg-muted/50 h-8">
                    <TabsTrigger
                      value="day"
                      className="rounded-full data-[state=active]:shadow-md data-[state=active]:bg-background transition-all duration-200 text-xs"
                    >
                      Hoje
                    </TabsTrigger>
                    <TabsTrigger
                      value="week"
                      className="rounded-full data-[state=active]:shadow-md data-[state=active]:bg-background transition-all duration-200 text-xs"
                    >
                      Esta Semana
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <Tabs
                  defaultValue="overview"
                  className="w-full"
                  onValueChange={(value) =>
                    setActiveTab(
                      value as "overview" | "breaks" | "time" | "completion"
                    )
                  }
                >
                  <TabsList className="grid grid-cols-4 rounded-full p-1 shadow-sm bg-muted/50 h-8">
                    <TabsTrigger
                      value="overview"
                      className="rounded-full data-[state=active]:shadow-md data-[state=active]:bg-background transition-all duration-200 text-xs"
                    >
                      Visão Geral
                    </TabsTrigger>
                    <TabsTrigger
                      value="completion"
                      className="rounded-full data-[state=active]:shadow-md data-[state=active]:bg-background transition-all duration-200 text-xs"
                    >
                      Conclusão
                    </TabsTrigger>
                    <TabsTrigger
                      value="breaks"
                      className="rounded-full data-[state=active]:shadow-md data-[state=active]:bg-background transition-all duration-200 text-xs"
                    >
                      Pausas
                    </TabsTrigger>
                    <TabsTrigger
                      value="time"
                      className="rounded-full data-[state=active]:shadow-md data-[state=active]:bg-background transition-all duration-200 text-xs"
                    >
                      Tempo
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}
          </>
        )}
      </CardHeader>
      <CardContent className="pt-2 p-3 overflow-auto">
        <AnimatePresence mode="wait" initial={false}>
          {loading && !analytics ? (
            <motion.div
              key="loading"
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              layout
            >
              {[...Array(6)].map((_, i) => (
                <SkeletonItem key={i} index={i} />
              ))}
            </motion.div>
          ) : isAuthError ? (
            <AuthErrorComponent />
          ) : error && !isAuthError ? (
            <motion.div
              key="error"
              className="text-center py-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <XCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
              <h3 className="text-base font-medium mb-2">
                Erro ao Carregar Dados
              </h3>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => fetchAnalytics()}
              >
                Tentar Novamente
              </Button>
            </motion.div>
          ) : analytics ? (
            <>
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <AnalyticItem
                    icon={<CheckCircle className="h-4 w-4" />}
                    title="Sessões Concluídas"
                    value={analytics.completedSessions}
                    color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    index={0}
                  />

                  <AnalyticItem
                    icon={<Calendar className="h-4 w-4" />}
                    title={
                      timeframe === "day" ? "Sessões Hoje" : "Sessões na Semana"
                    }
                    value={analytics.sessionsPerTimeframe}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    index={1}
                  />

                  <AnalyticItem
                    icon={<PieChart className="h-4 w-4" />}
                    title="Taxa de Conclusão"
                    value={`${analytics.completionRate}%`}
                    color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    index={2}
                    tooltip="Porcentagem de sessões que foram concluídas com sucesso"
                  />

                  <AnalyticItem
                    icon={<Coffee className="h-4 w-4" />}
                    title="Pausas Realizadas"
                    value={analytics.breaksTaken}
                    color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                    index={3}
                  />

                  <AnalyticItem
                    icon={<Clock className="h-4 w-4" />}
                    title="Tempo Total de Foco"
                    value={formatTime(analytics.totalFocusTime)}
                    color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    index={4}
                  />

                  <AnalyticItem
                    icon={<Clock className="h-4 w-4" />}
                    title="Tempo Total de Pausa"
                    value={formatTime(analytics.totalBreakTime)}
                    color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    index={5}
                  />
                </motion.div>
              )}

              {activeTab === "completion" && (
                <motion.div
                  key="completion"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <AnalyticItem
                    icon={<CheckCircle className="h-5 w-5" />}
                    title="Sessões Concluídas"
                    value={analytics.completedSessions}
                    color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    index={0}
                  />

                  <AnalyticItem
                    icon={<XCircle className="h-5 w-5" />}
                    title="Sessões Incompletas"
                    value={analytics.incompleteSessions}
                    color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    index={1}
                    tooltip="Sessões que foram reiniciadas ou abandonadas antes da conclusão"
                  />

                  <AnalyticItem
                    icon={<Scale className="h-5 w-5" />}
                    title="Concluídas vs Incompletas"
                    value={formatRatio(analytics.completedVsIncompleteRatio)}
                    color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    index={2}
                    tooltip="Proporção de sessões concluídas para incompletas"
                  />

                  <AnalyticItem
                    icon={<PieChart className="h-5 w-5" />}
                    title="Taxa de Conclusão"
                    value={`${analytics.completionRate}%`}
                    color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    index={3}
                  />

                  <AnalyticItem
                    icon={<Clock className="h-5 w-5" />}
                    title="Tempo de Foco Incompleto"
                    value={formatTime(analytics.totalIncompleteFocusTime)}
                    color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                    index={4}
                    tooltip="Tempo total gasto em sessões incompletas"
                  />

                  <AnalyticItem
                    icon={<BarChart className="h-5 w-5" />}
                    title="Tempo Concluído vs Incompleto"
                    value={formatRatio(
                      analytics.timeCompletedVsIncompleteRatio
                    )}
                    color="bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
                    index={5}
                    tooltip="Proporção de tempo gasto em sessões concluídas vs incompletas"
                  />
                </motion.div>
              )}

              {activeTab === "breaks" && (
                <motion.div
                  key="breaks"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <AnalyticItem
                    icon={<Coffee className="h-5 w-5" />}
                    title="Pausas Curtas"
                    value={analytics.shortBreakCount}
                    color="bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400"
                    index={0}
                  />

                  <AnalyticItem
                    icon={<Coffee className="h-5 w-5" />}
                    title="Pausas Longas"
                    value={analytics.longBreakCount}
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    index={1}
                  />

                  <AnalyticItem
                    icon={<Pause className="h-5 w-5" />}
                    title="Total de Pausas"
                    value={analytics.totalPauseCount}
                    color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    index={2}
                  />

                  <AnalyticItem
                    icon={<Pause className="h-5 w-5" />}
                    title="Média de Pausas/Sessão"
                    value={analytics.avgPausesPerSession}
                    color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    index={3}
                  />

                  <AnalyticItem
                    icon={<TimerOff className="h-5 w-5" />}
                    title="Tempo Total de Pausa"
                    value={formatTime(analytics.totalPauseTime)}
                    color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    index={4}
                  />

                  <AnalyticItem
                    icon={<AlarmClock className="h-5 w-5" />}
                    title="Proporção Pausa/Foco"
                    value={
                      analytics.totalFocusTime > 0
                        ? `${Math.round(
                            (analytics.totalBreakTime /
                              analytics.totalFocusTime) *
                              100
                          )}%`
                        : "0%"
                    }
                    color="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                    index={5}
                    tooltip="Porcentagem de tempo de pausa em comparação com o tempo de foco"
                  />
                </motion.div>
              )}

              {activeTab === "time" && (
                <motion.div
                  key="time"
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <AnalyticItem
                    icon={<Clock className="h-5 w-5" />}
                    title="Tempo Total de Foco"
                    value={formatTime(analytics.totalFocusTime)}
                    color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    index={0}
                  />

                  <AnalyticItem
                    icon={<Clock className="h-5 w-5" />}
                    title="Tempo Total de Pausa"
                    value={formatTime(analytics.totalBreakTime)}
                    color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    index={1}
                  />

                  <AnalyticItem
                    icon={<AlertTriangle className="h-5 w-5" />}
                    title="Tempo de Foco Incompleto"
                    value={formatTime(analytics.totalIncompleteFocusTime)}
                    color="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
                    index={2}
                    tooltip="Tempo gasto em sessões que não foram concluídas"
                  />

                  <AnalyticItem
                    icon={<Hourglass className="h-5 w-5" />}
                    title="Média de Tempo Extra"
                    value={formatTime(analytics.avgExtraTime)}
                    color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                    index={3}
                  />

                  <AnalyticItem
                    icon={<Timer className="h-5 w-5" />}
                    title="Duração Média da Sessão"
                    value={
                      analytics.completedSessions > 0
                        ? formatTime(
                            Math.round(
                              analytics.totalFocusTime /
                                analytics.completedSessions
                            )
                          )
                        : "0m"
                    }
                    color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    index={4}
                  />

                  <AnalyticItem
                    icon={<TrendingUp className="h-5 w-5" />}
                    title="Produtividade Total"
                    value={formatTime(
                      analytics.totalFocusTime + analytics.totalBreakTime
                    )}
                    color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    index={5}
                    tooltip="Tempo combinado de todas as sessões de foco e pausa concluídas"
                  />
                </motion.div>
              )}
            </>
          ) : (
            <motion.div
              key="empty"
              className="text-center py-6 px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              {loading ? (
                <EmptySkeleton />
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-flex rounded-full bg-muted p-3 mb-3"
                  >
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                  <h3 className="text-base font-medium mb-2">
                    Nenhum dado disponível ainda
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                    Complete sua primeira sessão Pomodoro para começar a
                    acompanhar suas métricas de produtividade.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
