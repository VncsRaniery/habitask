"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DayCard } from "./DayCard";
import { TimeCard } from "./TimeCard";
import { RoutineDialog } from "./RoutineDialog";
import { RoutineManagerSkeleton } from "@/components/skeletons/RoutineManagerSkeleton";
import Link from "next/link";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface RoutineItem {
  id: string;
  title: string;
  dayOfWeek: number;
  time: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const DAYS = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
];

export default function RoutineManager() {
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<RoutineItem | null>(
    null
  );
  const [, setError] = useState<string | null>(null);
  const [lastResetDate, setLastResetDate] = useLocalStorage<string>(
    "lastResetDate",
    new Date().toISOString()
  );

  const fetchRoutines = useCallback(async () => {
    try {
      const response = await fetch("/api/routines");
      if (!response.ok) throw new Error("Falha ao buscar rotinas");
      const data = await response.json();
      setRoutines(data);
      setError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao carregar rotinas";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [forceReset, setForceReset] = useState(false);
  const checkAndResetRoutines = useCallback(async () => {
    const now = new Date();
    const lastReset = new Date(lastResetDate);

    // Verifica se o reset foi forçado ou se é domingo e o reset ainda não foi feito neste dia
    if (
      !forceReset &&
      (now.getDay() !== 6 || lastReset.getDate() === now.getDate())
    ) {
      return; // Se não for domingo ou o reset já foi feito, não faz nada
    }

    try {
      // Salvar histórico da semana, se necessário
      const today = now.toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
      const historyPromises = routines.map(async (routine) => {
        const historyResponse = await fetch(
          `/api/routines/history/check?routineId=${routine.id}&date=${today}`
        );
        const historyData = await historyResponse.json();

        if (!historyData.exists) {
          await fetch("/api/routines/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              routineId: routine.id,
              completed: routine.completed,
              date: now.toISOString(),
            }),
          });
        }
      });

      await Promise.all(historyPromises); // Processar todas as promessas de histórico simultaneamente

      // Resetar rotinas
      const resetPromises = routines.map((routine) => {
        if (routine.completed) {
          return fetch(`/api/routines/${routine.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...routine, completed: false }),
          });
        }
        return Promise.resolve(); // Retorna uma promessa resolvida caso não precise resetar
      });

      await Promise.all(resetPromises); // Executa o reset de todas as rotinas simultaneamente

      // Atualizar estado local
      setRoutines((prev) =>
        prev.map((routine) => ({ ...routine, completed: false }))
      );

      // Atualizar a data do último reset
      setLastResetDate(now.toISOString());

      // Após o reset, desativa o controle manual (para garantir que só será ativado uma vez)
      if (forceReset) {
        setForceReset(false);
      }

      toast.success("Weekly routines have been reset", {
        description:
          "All routines have been marked as incomplete for the new week.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to reset routines";
      toast.error("Failed to reset routines", {
        description: message,
      });
    }
  }, [lastResetDate, routines, forceReset, setLastResetDate]);


  
  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  useEffect(() => {
    checkAndResetRoutines();
  }, [checkAndResetRoutines]);

  const handleAddRoutine = async (
    routineData: Omit<RoutineItem, "id" | "createdAt" | "updatedAt">[]
  ) => {
    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routineData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao adicionar rotina");
      }

      const newRoutines = await response.json();
      setRoutines((prev) => [
        ...prev,
        ...(Array.isArray(newRoutines) ? newRoutines : [newRoutines]),
      ]);
      toast.success(
        `${
          Array.isArray(newRoutines) ? newRoutines.length : 1
        } rotina(s) adicionada(s) com sucesso`
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao adicionar rotina";
      toast.error(message);
      return false;
    }
  };

  const handleEditRoutine = async (routine: RoutineItem) => {
    try {
      const response = await fetch(`/api/routines/${routine.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routine),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao atualizar rotina");
      }

      const updatedRoutine = await response.json();
      setRoutines((prev) =>
        prev.map((r) => (r.id === updatedRoutine.id ? updatedRoutine : r))
      );
      toast.success("Rotina atualizada com sucesso");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao atualizar rotina";
      toast.error(message);
      return false;
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Falha ao excluir rotina");
      }

      setRoutines((prev) => prev.filter((r) => r.id !== id));
      toast.success("Rotina excluída com sucesso");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao excluir rotina";
      toast.error(message);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const routine = routines.find((r) => r.id === id);
    if (!routine) return;

    const currentDayOfWeek = new Date().getDay();
    if (currentDayOfWeek !== routine.dayOfWeek) {
      toast.error("Você só pode marcar rotinas para o dia atual");
      return;
    }

    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );

    try {
      const response = await fetch(`/api/routines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...routine, completed: !routine.completed }),
      });

      if (!response.ok) {
        setRoutines((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, completed: routine.completed } : r
          )
        );
        throw new Error("Falha ao atualizar rotina");
      }

      const updatedRoutine = await response.json();
      setRoutines((prev) =>
        prev.map((r) => (r.id === updatedRoutine.id ? updatedRoutine : r))
      );

      const today = new Date().toISOString().split("T")[0];

      const historyResponse = await fetch(
        `/api/routines/history/check?routineId=${updatedRoutine.id}&date=${today}`
      );
      const historyData = await historyResponse.json();

      if (historyData.exists) {
        await fetch(`/api/routines/history/${historyData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            completed: updatedRoutine.completed,
          }),
        });
      } else {
        await fetch("/api/routines/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            routineId: updatedRoutine.id,
            completed: updatedRoutine.completed,
            date: new Date().toISOString(),
          }),
        });
      }

      const dayRoutines = routines.filter(
        (r) => r.dayOfWeek === currentDayOfWeek
      );
      const allCompleted = dayRoutines.every((r) =>
        r.id === id ? updatedRoutine.completed : r.completed
      );

      if (allCompleted && updatedRoutine.completed) {
        toast.success(
          `As rotinas de ${DAYS[routine.dayOfWeek]} foram concluídas! 🎉`,
          {
            description: "Ótimo trabalho mantendo sua rotina!",
          }
        );
      } else {
        toast.success(
          `Rotina marcada como ${
            updatedRoutine.completed ? "concluída" : "incompleta"
          }`
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao atualizar rotina";
      toast.error(message);
    }
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

  if (isLoading) return <RoutineManagerSkeleton />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Rotinas semanais
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas rotinas diárias e monitore seus hábitos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/rotinas/analytics">
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              Análises
            </Button>
          </Link>
          <Button onClick={() => setIsDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" /> Adicionar rotina(s)
          </Button>
        </div>
      </header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {DAYS.map((day, index) => (
          <DayCard
            key={day}
            day={day}
            dayIndex={index}
            routines={routines.filter((r) => r.dayOfWeek === index)}
            onEdit={(routine) => {
              setSelectedRoutine(routine);
              setIsDialogOpen(true);
            }}
            onDelete={handleDeleteRoutine}
            onToggleComplete={handleToggleComplete}
            setIsDialogOpen={setIsDialogOpen}
          />
        ))}
        <TimeCard />
      </motion.div>

      <RoutineDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedRoutine(null);
        }}
        onSubmit={async (routineData) => {
          let success = false;
          if (selectedRoutine) {
            success = await handleEditRoutine({
              ...selectedRoutine,
              ...routineData[0],
            });
          } else {
            success = await handleAddRoutine(routineData);
          }

          if (success) {
            setIsDialogOpen(false);
            setSelectedRoutine(null);
          }

          return success;
        }}
        initialData={selectedRoutine}
      />
    </div>
  );
}
