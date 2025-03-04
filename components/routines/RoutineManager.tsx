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
      if (!response.ok) throw new Error("Falha em carregar rotinas");
      const data = await response.json();
      setRoutines(data);
      setError(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha em carregar rotinas";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAndResetRoutines = useCallback(async () => {
    const now = new Date();
    const lastReset = new Date(lastResetDate);

    if (
      now.getDay() === 0 && // Domingo
      now.getTime() - lastReset.getTime() > 6 * 24 * 60 * 60 * 1000
    ) {
      try {
        const historyPromises = routines.map((routine) =>
          fetch("/api/routines/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              routineId: routine.id,
              completed: routine.completed,
              date: now.toISOString(),
              dayOfWeek: routine.dayOfWeek,
            }),
          })
        );

        // Reset all routines
        const resetPromises = routines.map((routine) => {
          if (routine.completed) {
            return fetch(`/api/routines/${routine.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...routine, completed: false }),
            });
          }
          return Promise.resolve();
        });

        await Promise.all([...historyPromises, ...resetPromises]);
        setRoutines((prev) =>
          prev.map((routine) => ({ ...routine, completed: false }))
        );
        setLastResetDate(now.toISOString());

        toast.success("As rotinas semanais foram redefinidas", {
          description:
            "Todas as rotinas foram marcadas como incompletas para a nova semana.",
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Falha em resertar item(s)";
        toast.error("Falha em resetar item(s)", {
          description: message,
        });
      }
    }
  }, [lastResetDate, routines, setLastResetDate]);

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
        throw new Error(error.error || "Falha em adicionar item(s) a rotina");
      }

      const newRoutines = await response.json();
      setRoutines((prev) => [
        ...prev,
        ...(Array.isArray(newRoutines) ? newRoutines : [newRoutines]),
      ]);
      toast.success(
        `${
          Array.isArray(newRoutines) ? newRoutines.length : 1
        } items(s) Adicionado(s) com sucesso`
      );
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha em adicionar item(s)";
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
        throw new Error(error.error || "Falha ao editar item");
      }

      const updatedRoutine = await response.json();
      setRoutines((prev) =>
        prev.map((r) => (r.id === updatedRoutine.id ? updatedRoutine : r))
      );
      toast.success("Item da rotina editado com sucesso");
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao editar item";
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
        throw new Error(error.error || "Falha em deletar item da rotina");
      }

      setRoutines((prev) => prev.filter((r) => r.id !== id));
      toast.success("Item da rotina deletado com sucesso");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao deletar item da rotina";
      toast.error(message);
    }
  };

  const handleToggleComplete = async (id: string) => {
    const routine = routines.find((r) => r.id === id);
    if (!routine) return;

    // Optimistic update
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );

    try {
      const [routineResponse, historyResponse] = await Promise.all([
        fetch(`/api/routines/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...routine, completed: !routine.completed }),
        }),
        fetch("/api/routines/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            routineId: id,
            completed: !routine.completed,
            date: new Date().toISOString(),
            dayOfWeek: routine.dayOfWeek,
          }),
        }),
      ]);

      if (!routineResponse.ok || !historyResponse.ok) {
        throw new Error("Falha ao editar item da rotina");
      }

      const updatedRoutine = await routineResponse.json();
      setRoutines((prev) =>
        prev.map((r) => (r.id === updatedRoutine.id ? updatedRoutine : r))
      );
      toast.success(
        `Rotina marcada como ${
          updatedRoutine.completed ? "concluída" : "incompleta"
        }`
      );
    } catch (error) {
      // Revert on error
      setRoutines((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, completed: routine.completed } : r
        )
      );
      const message =
        error instanceof Error
          ? error.message
          : "Falha ao editar item da rotina";
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
            Rotinas Semanais
          </h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas rotinas diárias e monitore seus hábitos
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/rotinas/analises">
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              Análises
            </Button>
          </Link>
          <Button onClick={() => setIsDialogOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" /> Adicionar item(s) a rotina
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
