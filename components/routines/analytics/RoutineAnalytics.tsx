"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  format,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowLeft,
  ListTodo,
  Download,
  Activity,
  Flame,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Toaster } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { RoutineItem } from "../RoutineManager";
import { AnalyticsSkeleton } from "../../skeletons/AnalyticsSkeleton";
import { ptBR } from "date-fns/locale";

const DAYS = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];
const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
];

interface RoutineHistory {
  id: string;
  routineId: string;
  routine: RoutineItem;
  completed: boolean;
  date: string;
  weekNumber: number;
  yearNumber: number;
  createdAt: string;
}

export default function RoutineAnalytics() {
  const [timeRange] = useState("month");
  const [heatmapTimeRange, setHeatmapTimeRange] = useState("month");
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [history, setHistory] = useState<RoutineHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalCompletedDays: 0,
  });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [routinesResponse, historyResponse] = await Promise.all([
        fetch("/api/routines"),
        fetch(`/api/routines/history?period=${timeRange}`),
      ]);

      if (!routinesResponse.ok) throw new Error("Falha ao buscar rotinas");
      if (!historyResponse.ok) throw new Error("Falha ao buscar histórico");

      const routinesData = await routinesResponse.json();
      const historyData = await historyResponse.json();

      setRoutines(routinesData);
      setHistory(historyData);

      calculateStreaks(historyData);
    } catch (error) {
      toast.error("Falha ao carregar dados analíticos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calculateStreaks = (historyData: RoutineHistory[]) => {
    const historyByDate = historyData.reduce(
      (acc, item) => {
        const dateStr = format(new Date(item.date), "yyyy-MM-dd", {
          locale: ptBR,
        });
        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: new Date(item.date),
            entries: [],
            routineIds: new Set<string>(),
            completedRoutineIds: new Set<string>(),
            dayOfWeek: new Date(item.date).getDay(),
          };
        }
        acc[dateStr].entries.push(item);
        acc[dateStr].routineIds.add(item.routineId);
        if (item.completed) {
          acc[dateStr].completedRoutineIds.add(item.routineId);
        }
        return acc;
      },
      {} as Record<
        string,
        {
          date: Date;
          entries: RoutineHistory[];
          routineIds: Set<string>;
          completedRoutineIds: Set<string>;
          dayOfWeek: number;
        }
      >
    );

    const sortedDates = Object.keys(historyByDate).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    let currentStreak = 0;
    let longestStreak = 0;
    let lastCompleteDayStreak = 0;
    let streakBroken = false;

    for (const dateStr of sortedDates) {
      const dayData = historyByDate[dateStr];
      if (dayData.routineIds.size === 0) continue;
      const isComplete = [...dayData.routineIds].every((routineId) =>
        dayData.completedRoutineIds.has(routineId)
      );

      if (isComplete) {
        currentStreak += 1;
        lastCompleteDayStreak = currentStreak;
        streakBroken = false;
      } else {
        if (!streakBroken) {
          currentStreak = Math.max(0, currentStreak - 1);
          streakBroken = true;
        }
      }
      longestStreak = Math.max(longestStreak, currentStreak);
    }
    const currentStreakValue = streakBroken
      ? lastCompleteDayStreak
      : currentStreak;

    const totalCompletedDays = sortedDates.filter((dateStr) => {
      const dayData = historyByDate[dateStr];
      return [...dayData.routineIds].every((routineId) =>
        dayData.completedRoutineIds.has(routineId)
      );
    }).length;

    setStreakData({
      currentStreak: currentStreakValue,
      longestStreak,
      totalCompletedDays,
    });
  };

  const calculateStats = () => {
    const totalRoutines = routines.length;
    const completedRoutines = routines.filter((r) => r.completed).length;
    const completionRate = totalRoutines
      ? (completedRoutines / totalRoutines) * 100
      : 0;

    const routinesByDay = DAYS.map((day, index) => {
      const dayRoutines = routines.filter((r) => r.dayOfWeek === index);
      const completedDayRoutines = dayRoutines.filter((r) => r.completed);
      const dayCompletionRate = dayRoutines.length
        ? (completedDayRoutines.length / dayRoutines.length) * 100
        : 0;

      return {
        day,
        dayIndex: index,
        count: dayRoutines.length,
        completed: completedDayRoutines.length,
        completionRate: dayCompletionRate,
      };
    });

    const timeDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: routines.filter((r) => {
        const [routineHour] = r.time.split(":");
        return Number.parseInt(routineHour) === hour;
      }).length,
    }));

    const today = new Date().getDay();
    const todayRoutines = routines.filter((r) => r.dayOfWeek === today);
    const completedTodayRoutines = todayRoutines.filter((r) => r.completed);
    const todayCompletionRate =
      todayRoutines.length > 0
        ? (completedTodayRoutines.length / todayRoutines.length) * 100
        : 0;

    return {
      totalRoutines,
      completedRoutines,
      completionRate,
      routinesByDay,
      timeDistribution,
      averagePerDay: totalRoutines / 7,
      consistencyScore: Math.round(todayCompletionRate),
      streakData,
    };
  };

  const generateHeatmapData = () => {
    const endDate = new Date();
    let startDate: Date;

    if (heatmapTimeRange === "week") {
      startDate = subWeeks(endDate, 1);
    } else if (heatmapTimeRange === "month") {
      startDate = subWeeks(endDate, 4);
    } else {
      startDate = subWeeks(endDate, 52);
    }

    const weeks: Date[] = [];
    let currentWeekStart = startOfWeek(startDate);

    while (currentWeekStart <= endDate) {
      weeks.push(currentWeekStart);
      currentWeekStart = new Date(currentWeekStart);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    const weekData = weeks.map((weekStart) => {
      const weekEnd = endOfWeek(weekStart);
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

      return {
        weekOf: format(weekStart, "MMM d"),
        days: weekDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd", { locale: ptBR });
          const dayOfWeek = day.getDay();

          const routinesForDay = routines.filter(
            (r) => r.dayOfWeek === dayOfWeek
          );

          const dayHistory = history.filter(
            (h) =>
              format(new Date(h.date), "yyyy-MM-dd", { locale: ptBR }) ===
              dateStr
          );

          const completedRoutineIds = new Set(
            dayHistory.filter((h) => h.completed).map((h) => h.routineId)
          );

          let completionRate = 0;
          let completedCount = 0;

          if (routinesForDay.length > 0) {
            completedCount = routinesForDay.filter((r) =>
              dayHistory.some((h) => h.routineId === r.id && h.completed)
            ).length;

            completionRate = (completedCount / routinesForDay.length) * 100;
          }

          return {
            date: dateStr,
            dayName: format(day, "EEE", { locale: ptBR }),
            dayOfWeek,
            value: completionRate,
            total: routinesForDay.length,
            completed: completedCount,
            progress: routinesForDay.length > 0 ? completionRate / 100 : 0,
            uniqueRoutines: completedRoutineIds.size,
            expectedRoutines: routinesForDay.length,
            routineDetails: routinesForDay.map((routine) => {
              const historyEntry = dayHistory.find(
                (h) => h.routineId === routine.id
              );
              return {
                id: routine.id,
                title: routine.title,
                completed: historyEntry?.completed || false,
              };
            }),
          };
        }),
        isCurrentWeek: weekDays.some((day) => {
          const today = new Date();
          return (
            format(day, "yyyy-MM-dd", { locale: ptBR }) ===
            format(today, "yyyy-MM-dd", { locale: ptBR })
          );
        }),
      };
    });

    return weekData.sort((a, b) => {
      if (a.isCurrentWeek) return -1;
      if (b.isCurrentWeek) return 1;
      return 0;
    });
  };

  const exportData = () => {
    const data = JSON.stringify(
      {
        routines,
        history,
        stats: {
          completionRate: stats.completionRate,
          consistencyScore: stats.consistencyScore,
          streaks: streakData,
        },
      },
      null,
      2
    );

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `routine-analytics-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Dados analíticos exportados com sucesso");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const stats = calculateStats();
  const heatmapData = generateHeatmapData();

  if (isLoading) return <AnalyticsSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Toaster position="bottom-right" />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Análise das rotinas
              </h1>
              <p className="text-muted-foreground mt-2">
                Acompanhe a conclusão da sua rotina e hábitos ao longo do tempo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/rotinas">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar a rotinas
                </Button>
              </Link>
              <Button onClick={exportData}>
                <Download className="mr-2 h-4 w-4" />
                Exportar Dados
              </Button>
            </div>
          </motion.div>

          {/* Streak Alert */}
          {streakData.currentStreak > 0 && (
            <motion.div variants={itemVariants}>
              <Alert className="bg-primary/10 border-primary/20">
                <Flame className="h-5 w-5 text-primary" />
                <AlertTitle className="text-primary font-bold">
                  Sua Sequência atual é de {streakData.currentStreak} dias! 🔥
                </AlertTitle>
                <AlertDescription className="text-primary/90">
                  Você está indo muito bem! Continue com o bom trabalho para manter
                  sua sequência e construir hábitos consistentes.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Stats Overview */}
          <motion.div
            variants={itemVariants}
            className="grid gap-4 md:grid-cols-3"
          >
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Conclusões de hoje
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.consistencyScore}%
                </div>
                <Progress value={stats.consistencyScore} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {
                    routines
                      .filter((r) => r.dayOfWeek === new Date().getDay())
                      .filter((r) => r.completed).length
                  }{" "}
                  de{" "}
                  {
                    routines.filter((r) => r.dayOfWeek === new Date().getDay())
                      .length
                  }{" "}
                  rotinas concluídas hoje
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Dias Completos Consecutivos
                </CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {streakData.currentStreak} dias
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Dias com todas as rotinas concluídas
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de rotinas
                </CardTitle>
                <ListTodo className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRoutines}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {stats.averagePerDay.toFixed(1)} rotinas por dia em média
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Distribuição Diária</CardTitle>
                <CardDescription>
                  Número de rotinas por dia da semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.routinesByDay}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="day"
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Dia
                                    </span>
                                    <span className="font-bold text-sm">
                                      {data.day}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Rotinas
                                      </span>
                                      <span className="font-bold text-sm">
                                        {data.count}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                                        Concluídas
                                      </span>
                                      <span className="font-bold text-sm">
                                        {data.completed}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="count"
                        name="Total"
                        fill={COLORS[0]}
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationBegin={300}
                        animationEasing="ease-in-out"
                      />
                      <Bar
                        dataKey="completed"
                        name="Completed"
                        fill={COLORS[1]}
                        radius={[4, 4, 0, 0]}
                        animationDuration={1500}
                        animationBegin={300}
                        animationEasing="ease-in-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Distribuição de tempo</CardTitle>
                <CardDescription>
                  Número de rotinas por hora do dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.timeDistribution}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-muted"
                      />
                      <XAxis
                        dataKey="hour"
                        tickFormatter={(hour) =>
                          format(new Date().setHours(hour), "HH")
                        }
                      />
                      <YAxis />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Horário
                                    </span>
                                    <span className="font-bold text-sm">
                                      {format(
                                        new Date().setHours(label),
                                        "hh:00"
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Rotinas
                                    </span>
                                    <span className="font-bold text-sm">
                                      {payload[0].value}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke={COLORS[2]}
                        fill={COLORS[2]}
                        fillOpacity={0.2}
                        animationDuration={1500}
                        animationBegin={300}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Heatmap */}
          <motion.div>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-col space-y-4">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Mapa de conclusão de rotina</CardTitle>
                    <CardDescription>
                      Visualização dos seus padrões de rotina
                    </CardDescription>
                  </div>
                  <Select
                    value={heatmapTimeRange}
                    onValueChange={setHeatmapTimeRange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecione o intervalo de tempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Últimos 7 dias</SelectItem>
                      <SelectItem value="month">Últimos 30 dias</SelectItem>
                      <SelectItem value="year">Últimos 365 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-sm text-muted-foreground">Menos</div>
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, i) => (
                    <div
                      key={i}
                      className="h-4 w-4 rounded-sm"
                      style={{
                        backgroundColor: `rgba(34, 197, 94, ${opacity})`,
                      }}
                    />
                  ))}
                  <div className="text-sm text-muted-foreground">Mais</div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-6">
                    {heatmapData.map((week, weekIndex) => {
                      const isCurrentWeek = week.days.some((day) => {
                        const today = new Date();
                        return (
                          format(new Date(day.date), "yyyy-MM-dd", {
                            locale: ptBR,
                          }) === format(today, "yyyy-MM-dd", { locale: ptBR })
                        );
                      });

                      return (
                        <div
                          key={weekIndex}
                          className={`space-y-2 ${
                            isCurrentWeek ? "relative" : ""
                          }`}
                        >
                          {isCurrentWeek && (
                            <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full" />
                          )}
                          <div
                            className={`text-sm font-medium ${
                              isCurrentWeek ? "text-primary font-bold" : ""
                            }`}
                          >
                            Semana de {week.weekOf}{" "}
                            {isCurrentWeek && (
                              <span className="text-xs ml-2">
                                (Semana Atual)
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {week.days.map((day, dayIndex) => {
                              const isToday =
                                format(new Date(day.date), "yyyy-MM-dd", {
                                  locale: ptBR,
                                }) ===
                                format(new Date(), "yyyy-MM-dd", {
                                  locale: ptBR,
                                });

                              return (
                                <div key={dayIndex} className="relative">
                                  <div
                                    className={`h-10 rounded-md cursor-pointer transition-all ${
                                      isToday
                                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundColor:
                                        day.total === 0
                                          ? "var(--muted)"
                                          : `rgba(34, 197, 94, ${day.progress})`,
                                      transition:
                                        "background-color 0.5s ease-in-out",
                                    }}
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span
                                        className={`text-xs font-medium ${
                                          isToday
                                            ? "text-primary font-bold"
                                            : ""
                                        }`}
                                      >
                                        {day.dayName}
                                      </span>
                                    </div>
                                  </div>
                                  {isToday && (
                                    <div className="absolute -top-2 -right-2 h-4 w-4 bg-primary rounded-full border-2 border-background z-10" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Completion History */}
          <motion.div variants={itemVariants}>
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Histórico de conclusão</CardTitle>
                <CardDescription>
                  Histórico recente de conclusões de rotina
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Rotina</TableHead>
                        <TableHead>Dia</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {history
                        .sort(
                          (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                        )
                        .slice(0, 50)
                        .map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>
                              {format(new Date(entry.date), "MMM d, yyyy", {
                                locale: ptBR,
                              })}
                            </TableCell>
                            <TableCell>{entry.routine.title}</TableCell>
                            <TableCell>
                              {DAYS[new Date(entry.date).getDay()]}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {entry.completed ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>Concluída</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-amber-500" />
                                    <span>Perdida</span>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
