"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { format, subDays, eachDayOfInterval } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart2,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  ListTodo,
} from "lucide-react"
import type { Task } from "@/types"
import { AnalyticsSkeleton } from "../skeletons/AnalyticsSkeleton"
import { EmptyChartState } from "./EmptyChartState"

export default function TaskAnalytics() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [timeRange, setTimeRange] = useState("7days")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks")
        if (!response.ok) throw new Error("Failed to fetch tasks")
        const data = await response.json()
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const getDateRange = () => {
    const end = new Date()
    const start = subDays(end, timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90)
    return { start, end }
  }

  const calculateStats = () => {
    const now = new Date()
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((task) => task.status === "Feita").length
    const inProgressTasks = tasks.filter((task) => task.status === "Em Progresso").length
    const pendingTasks = tasks.filter((task) => task.status === "Pendente").length
    const overdueTasks = tasks.filter((task) => task.status !== "Feita" && new Date(task.dueDate) < now).length
    const completionRate = totalTasks ? (completedTasks / totalTasks) * 100 : 0

    const statusData = [
      { name: "Pendente", value: pendingTasks },
      { name: "Em Progresso", value: inProgressTasks },
      { name: "Feita", value: completedTasks },
    ]

    const priorityData = [
      { name: "Alta", value: tasks.filter((task) => task.priority === "Alta").length },
      { name: "Média", value: tasks.filter((task) => task.priority === "Média").length },
      { name: "Baixa", value: tasks.filter((task) => task.priority === "Baixa").length },
    ]

    // Calculate trend (comparing to previous period)
    const { start } = getDateRange()
    const previousPeriodStart = subDays(start, timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : 90)

    const currentPeriodCompleted = tasks.filter(
      (task) => task.status === "Feita" && new Date(task.createdAt) >= start,
    ).length

    const previousPeriodCompleted = tasks.filter(
      (task) =>
        task.status === "Feita" && new Date(task.createdAt) >= previousPeriodStart && new Date(task.createdAt) < start,
    ).length

    const trend = previousPeriodCompleted
      ? ((currentPeriodCompleted - previousPeriodCompleted) / previousPeriodCompleted) * 100
      : 0

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      statusData,
      priorityData,
      trend,
    }
  }

  const calculateProductivityData = () => {
    const { start, end } = getDateRange()
    const days = eachDayOfInterval({ start, end })

    return days.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      completed: tasks.filter(
        (task) =>
          task.status === "Feita" && format(new Date(task.createdAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"),
      ).length,
      created: tasks.filter((task) => format(new Date(task.createdAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"))
        .length,
    }))
  }

  const stats = calculateStats()
  const productivityData = calculateProductivityData()

  const COLORS = {
    todo: "rgb(99, 102, 241)", // indigo-500
    inProgress: "rgb(249, 115, 22)", // orange-500
    done: "rgb(34, 197, 94)", // green-500
    high: "rgb(239, 68, 68)", // red-500
    medium: "rgb(249, 115, 22)", // orange-500
    low: "rgb(34, 197, 94)", // green-500
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const isBurnoutRisk = stats.overdueTasks > stats.totalTasks * 0.3 || stats.pendingTasks > stats.totalTasks * 0.5

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        {isLoading ? (
          <AnalyticsSkeleton />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Análises das tarefas</h1>
                <p className="text-muted-foreground">
                Insights e métricas para {format(getDateRange().start, "MMM d, yyyy")} -{" "}
                  {format(getDateRange().end, "MMM d, yyyy")}
                </p>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Burnout Warning */}
            <AnimatePresence>
              {isBurnoutRisk && (
                <motion.div variants={itemVariants} initial="hidden" animate="visible" exit="hidden" layout>
                  <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Risco de Burnout detectado</AlertTitle>
                    <AlertDescription className="mt-2 flex flex-col gap-2">
                      <p>Você tem um grande número de tarefas atrasadas ou pendentes. Considerar:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Revendo e priorizando suas tarefas</li>
                        <li>Dividir tarefas grandes em tarefas menores</li>
                        <li>Delegar tarefas sempre que possível</li>
                        <li>Fazendo pausas regulares entre as tarefas</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stats Overview */}
            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Progresso de tarefas</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTasks}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <ListTodo className="h-4 w-4" />
                    <span>{stats.inProgressTasks} em progresso</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex text-xs justify-between">
                      <span>Progresso geral</span>
                      <span>{stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tendência de conclusão</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {stats.completedTasks}
                    {stats.trend !== 0 && (
                      <span
                        className={`text-sm flex items-center ${stats.trend > 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {stats.trend > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {Math.abs(stats.trend).toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">vs período anterior</div>
                  <div className="mt-4 h-[40px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productivityData.slice(-7)}>
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={2}
                          className="stroke-primary fill-primary/10"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tarefas atrasadas</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.overdueTasks}</div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{((stats.overdueTasks / stats.totalTasks) * 100).toFixed(1)}% do total de tarefas</span>
                  </div>
                  <div className="mt-4 h-[40px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={productivityData.slice(-7)}>
                        <Area
                          type="monotone"
                          dataKey="created"
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={2}
                          className="stroke-primary fill-primary/10"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Eficiência de Tarefas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((stats.completedTasks / (stats.totalTasks || 1)) * 100).toFixed(1)}%
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <BarChart2 className="h-4 w-4" />
                    <span>{stats.pendingTasks} tarefas restantes</span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex text-xs justify-between">
                      <span>Taxa de conclusão</span>
                      <span>{stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.completionRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <motion.div variants={itemVariants}>
                <Card className="backdrop-blur-sm bg-card/50">
                  <CardHeader>
                    <CardTitle>Distribuição de Tarefas</CardTitle>
                    <CardDescription>Visão geral das tarefas por status atual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.totalTasks === 0 ? (
                      <EmptyChartState message="Nenhuma tarefa disponível para mostrar a distribuição" />
                    ) : (
                      <div className="h-[300px] flex flex-col">
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                              >
                                {stats.statusData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.name === "Pendente"
                                        ? COLORS.todo
                                        : entry.name === "Em Progresso"
                                          ? COLORS.inProgress
                                          : COLORS.done
                                    }
                                    className="transition-opacity duration-200 hover:opacity-80"
                                    style={{
                                      filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                                    }}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    const percentage = ((data.value / stats.totalTasks) * 100).toFixed(1)
                                    return (
                                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                                        <div className="grid gap-2">
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="h-3 w-3 rounded-full"
                                              style={{
                                                backgroundColor:
                                                  data.name === "Pendente"
                                                    ? COLORS.todo
                                                    : data.name === "Em Progresso"
                                                      ? COLORS.inProgress
                                                      : COLORS.done,
                                              }}
                                            />
                                            <span className="font-medium">{data.name}</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Tarefas
                                              </span>
                                              <span className="font-bold text-sm">{data.value}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Porcentagem
                                              </span>
                                              <span className="font-bold text-sm">{percentage}%</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 text-sm mt-2 px-4">
                          {stats.statusData.map((entry, index) => (
                            <motion.div
                              key={entry.name}
                              className="flex items-center cursor-pointer transition-transform hover:scale-105"
                              whileHover={{ y: -2 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  backgroundColor:
                                    entry.name === "Pendente"
                                      ? COLORS.todo
                                      : entry.name === "Em Progresso"
                                        ? COLORS.inProgress
                                        : COLORS.done,
                                }}
                              />
                              <span className="whitespace-nowrap">
                                {entry.name} ({((entry.value / stats.totalTasks) * 100).toFixed(1)}%)
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="backdrop-blur-sm bg-card/50">
                  <CardHeader>
                    <CardTitle>Distribuição Prioritária</CardTitle>
                    <CardDescription>Visão geral das tarefas por nível de prioridade</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats.totalTasks === 0 ? (
                      <EmptyChartState message="Nenhuma tarefa disponível para mostrar prioridades" />
                    ) : (
                      <div className="h-[300px] flex flex-col">
                        <div className="flex-1">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={stats.priorityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={1000}
                              >
                                {stats.priorityData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.name === "Alta"
                                        ? COLORS.high
                                        : entry.name === "Média"
                                          ? COLORS.medium
                                          : COLORS.low
                                    }
                                    className="transition-opacity duration-200 hover:opacity-80"
                                    style={{
                                      filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                                    }}
                                  />
                                ))}
                              </Pie>
                              <Tooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    const percentage = ((data.value / stats.totalTasks) * 100).toFixed(1)
                                    return (
                                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                                        <div className="grid gap-2">
                                          <div className="flex items-center gap-2">
                                            <div
                                              className="h-3 w-3 rounded-full"
                                              style={{
                                                backgroundColor:
                                                  data.name === "Alta"
                                                    ? COLORS.high
                                                    : data.name === "Média"
                                                      ? COLORS.medium
                                                      : COLORS.low,
                                              }}
                                            />
                                            <span className="font-medium">{data.name} Prioridade</span>
                                          </div>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Tarefas
                                              </span>
                                              <span className="font-bold text-sm">{data.value}</span>
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                Porcentagem
                                              </span>
                                              <span className="font-bold text-sm">{percentage}%</span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }
                                  return null
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 text-sm mt-2 px-4">
                          {stats.priorityData.map((entry, index) => (
                            <motion.div
                              key={entry.name}
                              className="flex items-center cursor-pointer transition-transform hover:scale-105"
                              whileHover={{ y: -2 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div
                                className="w-3 h-3 rounded-full mr-2"
                                style={{
                                  backgroundColor:
                                    entry.name === "Alta"
                                      ? COLORS.high
                                      : entry.name === "Média"
                                        ? COLORS.medium
                                        : COLORS.low,
                                }}
                              />
                              <span className="whitespace-nowrap">
                                {entry.name} ({((entry.value / stats.totalTasks) * 100).toFixed(1)}%)
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Productivity Chart */}
            <motion.div variants={itemVariants}>
              <Card className="backdrop-blur-sm bg-card/50">
                <CardHeader>
                  <CardTitle>Tendências de produtividade</CardTitle>
                  <CardDescription>Conclusão de tarefas e padrões de criação ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  {productivityData.length === 0 ? (
                    <EmptyChartState message="Não há dados de produtividade disponíveis para o período selecionado" />
                  ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productivityData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(value) => format(new Date(value), "MMM dd")}
                            stroke="#888888"
                          />
                          <YAxis stroke="#888888" />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="grid gap-2">
                                      <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Data</span>
                                        <span className="font-bold text-sm">
                                          {format(new Date(label), "MMM dd, yyyy")}
                                        </span>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            Concluída
                                          </span>
                                          <span className="font-bold text-sm text-green-500">{payload[0].value}</span>
                                        </div>
                                        <div className="flex flex-col">
                                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                                            Criada
                                          </span>
                                          <span className="font-bold text-sm text-blue-500">{payload[1].value}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              }
                              return null
                            }}
                          />
                          <Bar dataKey="completed" name="Completed" fill={COLORS.done} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="created" name="Created" fill={COLORS.todo} radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

