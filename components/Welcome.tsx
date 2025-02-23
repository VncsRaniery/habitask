"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  ArrowRight,
  Clock,
  AlertTriangle,
  BarChart2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import type { Task } from "@/types";

export default function Welcome() {
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const tasks = await response.json();

        // Filter and sort upcoming tasks
        const now = new Date();
        const upcoming = tasks
          .filter((task: Task) => {
            const dueDate = new Date(task.dueDate);
            return dueDate > now && task.status !== "Feita";
          })
          .sort(
            (a: Task, b: Task) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          )
          .slice(0, 3);

        setUpcomingTasks(upcoming);

        // Calculate task statistics
        const completed = tasks.filter(
          (task: Task) => task.status === "Feita"
        ).length;
        const inProgress = tasks.filter(
          (task: Task) => task.status === "Em Progresso"
        ).length;
        const upcomingCount = tasks.filter(
          (task: Task) =>
            task.status === "Pendente" && new Date(task.dueDate) > now
        ).length;

        setTaskStats({
          total: tasks.length,
          completed,
          inProgress,
          upcoming: upcomingCount,
        });
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "text-rose-500";
      case "Média":
        return "text-amber-500";
      case "Baixa":
        return "text-emerald-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";
      case "Em Progresso":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400";
      case "Feita":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto space-y-12"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Bem vindo ao{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Task Manager
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Seu espaço de trabalho pessoal para organizar tarefas, gerenciar
              projetos e permanecer produtivo. Comece por criando sua primeira
              tarefa ou verifique seus próximos prazos.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/dashboard/tasks">
                <Button size="lg" className="gap-2">
                  Ir para as tarefas <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  Visão geral
                </CardTitle>
                <CardDescription>
                  Suas estatísticas e progresso de tarefas atuais
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Todas
                    </p>
                    <p className="text-2xl font-bold">{taskStats.total}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Completadas
                    </p>
                    <p className="text-2xl font-bold text-emerald-500">
                      {taskStats.completed}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Em Progresso
                    </p>
                    <p className="text-2xl font-bold text-amber-500">
                      {taskStats.inProgress}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Próximas
                    </p>
                    <p className="text-2xl font-bold text-blue-500">
                      {taskStats.upcoming}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Progresso geral</span>
                    <span>
                      {taskStats.total
                        ? Math.round(
                            (taskStats.completed / taskStats.total) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      taskStats.total
                        ? (taskStats.completed / taskStats.total) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-sm bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Próximas tarefas
                </CardTitle>
                <CardDescription>
                  Suas tarefas mais urgentes que precisam de atenção
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-24 rounded-lg bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : upcomingTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium text-muted-foreground">
                      Todos apanhados!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Nenhuma tarefa futura no momento.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="font-medium leading-none">
                                  {task.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {task.description}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={getStatusColor(task.status)}
                              >
                                {task.status}
                              </Badge>
                            </div>
                            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Prazo{" "}
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <AlertTriangle
                                  className={`h-4 w-4 ${getPriorityColor(
                                    task.priority
                                  )}`}
                                />
                                <span className="capitalize">
                                  {task.priority} Prioridade
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <Link href="/dashboard/tasks">
                  <Button variant="ghost" className="gap-2">
                    Vizualizar todas as tarefas{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
