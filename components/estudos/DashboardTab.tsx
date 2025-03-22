"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format, parseISO, isToday, isTomorrow, isThisWeek } from "date-fns";
import {
  BookOpen,
  Users,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle,
  BookMarked,
  GraduationCap,
} from "lucide-react";
import type { Subject, Professor, StudySession, StudyResource } from "@/types";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import Link from "next/link";

interface DashboardTabProps {
  subjects: Subject[];
  professors: Professor[];
  isLoading: boolean;
}

export default function DashboardTab({
  subjects,
  professors,
  isLoading,
}: DashboardTabProps) {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [stats, setStats] = useState({
    completedSessions: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    totalResources: 0,
    completionRate: 0,
  });
  const [, setActiveTab] = useState<
    "dashboard" | "sessions" | "resources" | "subjects"
  >("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const [sessionsResponse, resourcesResponse] = await Promise.all([
          fetch("/api/sessions-study"),
          fetch("/api/resources"),
        ]);

        if (!sessionsResponse.ok || !resourcesResponse.ok) {
          throw new Error("Falha ao buscar dados");
        }

        const sessionsData = await sessionsResponse.json();
        const resourcesData = await resourcesResponse.json();

        setSessions(sessionsData);
        setResources(resourcesData);

        // Calculate stats
        const completedSessions = sessionsData.filter(
          (session: StudySession) => session.completed
        ).length;
        const upcomingSessions = sessionsData.filter(
          (session: StudySession) => {
            const sessionDate = parseISO(session.startTime);
            return (
              !session.completed &&
              (isToday(sessionDate) ||
                isTomorrow(sessionDate) ||
                isThisWeek(sessionDate))
            );
          }
        ).length;

        setStats({
          completedSessions,
          totalSessions: sessionsData.length,
          upcomingSessions,
          totalResources: resourcesData.length,
          completionRate:
            sessionsData.length > 0
              ? (completedSessions / sessionsData.length) * 100
              : 0,
        });
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

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
      transition: { duration: 0.3 },
    },
  };

  if (isLoading || isLoadingData) {
    return <DashboardSkeleton />;
  }

  // Get upcoming sessions (today and tomorrow)
  const upcomingSessions = sessions
    .filter((session) => {
      const sessionDate = parseISO(session.startTime);
      return (
        !session.completed && (isToday(sessionDate) || isTomorrow(sessionDate))
      );
    })
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    )
    .slice(0, 3);

  // Get recent resources
  const recentResources = resources
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 backdrop-blur-sm border"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.6),transparent)]" />
        <div className="relative">
          <h2 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao seu Plano de Estudos
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Rastreie seu progresso acadêmico, gerencie seus recursos de estudo e
            mantenha-se atualizado em sua jornada de aprendizado.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="#upcoming-sessions">
                Ver Sessões Futuras
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#recent-resources">
                Ver Recursos
                <FileText className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Matérias
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {subjects.length === 1 ? "Matéria" : "Matérias"} em seu
                currículo
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sessões de Estudo
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.completedSessions}/{stats.totalSessions}
              </div>
              <div className="mt-2">
                <Progress value={stats.completionRate} className="h-1" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.completionRate.toFixed(0)}% de conclusão
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recursos de Estudo
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResources}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.totalResources === 1 ? "Recurso" : "Recursos"} carregados
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{professors.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {professors.length === 1 ? "Professor" : "Professores"}{" "}
                registrados
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card className="bg-card/50 backdrop-blur-sm" id="upcoming-sessions">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sessões Futuras</CardTitle>
                <CardDescription>Sessões de estudo agendadas</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Nenhuma sessão futura</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Você está atualizado! Agende sua próxima sessão de estudo.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start space-x-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className="mt-1 h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: session.subject.color }}
                    >
                      <BookMarked className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">
                        {session.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.subject.name}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>
                          {format(
                            parseISO(session.startTime),
                            "EEEE, MMM d • h:mm a"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#" onClick={() => setActiveTab("sessions")}>
                Ver Todas as Sessões
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Resources */}
        <Card className="bg-card/50 backdrop-blur-sm" id="recent-resources">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recursos Recentes</CardTitle>
                <CardDescription>
                  Seus materiais de estudo mais recentes
                </CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {recentResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Nenhum recurso ainda</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Carregue seu primeiro recurso de estudo para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-start space-x-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div
                      className="mt-1 h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: resource.subject.color }}
                    >
                      <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium leading-none">
                        {resource.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {resource.subject.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {resource.fileType.toUpperCase()} •{" "}
                        {format(new Date(resource.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#" onClick={() => setActiveTab("resources")}>
                Ver Todos os Recursos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Subject Overview */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visão Geral das Matérias</CardTitle>
                <CardDescription>
                  Seu currículo acadêmico em um olhada
                </CardDescription>
              </div>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium">Nenhuma matéria ainda</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adicione suas primeiras matérias para começar a usar sua planilha
                  de estudo.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.slice(0, 6).map((subject) => (
                  <div
                    key={subject.id}
                    className="flex flex-col space-y-2 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: subject.color }}
                      />
                      <h3 className="font-medium">{subject.name}</h3>
                    </div>
                    {subject.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {subject.description}
                      </p>
                    )}
                    {subject.professor && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="mr-1 h-3 w-3" />
                        <span>{subject.professor.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {subjects.length > 6 && (
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="#" onClick={() => setActiveTab("subjects")}>
                  Ver Todas as Matérias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
