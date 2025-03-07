"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Calendar, Clock } from "lucide-react";
import { RoutineItem } from "./RoutineItem";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { RoutineItem as RoutineItemType } from "./RoutineManager";

interface DayCardProps {
  day: string;
  dayIndex: number;
  routines: RoutineItemType[];
  onEdit: (routine: RoutineItemType) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  setIsDialogOpen: (open: boolean) => void;
}

export function DayCard({
  day,
  dayIndex,
  routines,
  onEdit,
  onDelete,
  onToggleComplete,
  setIsDialogOpen,
}: DayCardProps) {
  const isToday = new Date().getDay() === dayIndex;
  const completedCount = routines.filter((r) => r.completed).length;
  const progress = routines.length
    ? (completedCount / routines.length) * 100
    : 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      animate={
        isToday
          ? {
              boxShadow: [
                "0px 0px 0px rgba(59, 130, 246, 0)",
                "0px 0px 8px rgba(59, 130, 246, 0.5)",
                "0px 0px 0px rgba(59, 130, 246, 0)",
              ],
            }
          : {}
      }
      transition={
        isToday
          ? {
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1,
            }
          : {}
      }
    >
      <Card
        className={`h-[500px] relative overflow-hidden transition-shadow hover:shadow-lg
        ${isToday ? "ring-2 ring-primary" : ""}
        ${
          completedCount === routines.length && routines.length > 0
            ? "bg-primary/5"
            : ""
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background pointer-events-none" />

        <CardHeader className="relative space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar
                className={`h-5 w-5 ${
                  isToday ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <CardTitle className="text-xl font-semibold">
                {day}
                {isToday && (
                  <span className="ml-2 text-sm font-normal text-primary">
                    (Hoje)
                  </span>
                )}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Adicionar rotina(s)</span>
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {completedCount} de {routines.length} concluídas
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar
              value={progress}
              isCompleted={completedCount === routines.length}
            />
          </div>
        </CardHeader>

        <CardContent className="relative h-[calc(100%-140px)]">
          <ScrollArea className="h-full pr-4">
            {routines.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-4"
              >
                <p className="text-sm text-muted-foreground">
                  Sem rotinas para {day}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Clique em + para adicionar uma nova rotina
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2 pb-4">
                {routines
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((routine) => (
                    <RoutineItem
                      key={routine.id}
                      routine={routine}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleComplete={onToggleComplete}
                    />
                  ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>

        {isToday && completedCount < routines.length && routines.length > 0 && (
          <motion.div
            className="absolute bottom-2 right-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-primary font-normal text-sm flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Pendente
            </div>
          </motion.div>
        )}
        {completedCount === routines.length && routines.length > 0 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bottom-2 right-2 ml-2 text-sm font-normal text-green-500"
          >
            ✓ Concluída
          </motion.span>
        )}
      </Card>
    </motion.div>
  );
}
