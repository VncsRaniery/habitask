"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Plus, Calendar } from "lucide-react";
import { RoutineItem } from "./RoutineItem";
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
    <motion.div variants={cardVariants}>
      <Card
        className={`h-[500px] relative overflow-hidden transition-shadow hover:shadow-lg
      ${isToday ? "ring-2 ring-primary" : ""}`}
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
              <span className="sr-only">Adicionar item(s) a sua rotina</span>
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {completedCount} of {routines.length} completadas
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
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
                  Click em + para adicionar novos itens
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
      </Card>
    </motion.div>
  );
}
