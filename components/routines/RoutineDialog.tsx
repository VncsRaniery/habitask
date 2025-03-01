"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X, Clock, CalendarDays, ArrowDownUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RoutineItem } from "./RoutineManager";

interface RoutineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    routines: Omit<RoutineItem, "id" | "createdAt" | "updatedAt">[]
  ) => Promise<boolean>;
  initialData?: RoutineItem | null;
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

interface RoutineFormData {
  title: string;
  time: string;
}

export function RoutineDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: RoutineDialogProps) {
  const [selectedDay, setSelectedDay] = useState(
    new Date().getDay().toString()
  );
  const [routines, setRoutines] = useState<RoutineFormData[]>([
    { title: "", time: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSelectedDay(initialData.dayOfWeek.toString());
      setRoutines([{ title: initialData.title, time: initialData.time }]);
    } else {
      setSelectedDay(new Date().getDay().toString());
      setRoutines([{ title: "", time: "" }]);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validRoutines = routines.filter((r) => r.title && r.time);
    if (validRoutines.length === 0) return;

    setIsSubmitting(true);
    try {
      const formattedRoutines = validRoutines.map((routine) => ({
        title: routine.title,
        dayOfWeek: Number.parseInt(selectedDay),
        time: routine.time,
        completed: false,
      }));

      const success = await onSubmit(formattedRoutines);
      if (success) {
        setRoutines([{ title: "", time: "" }]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRoutine = () => {
    if (routines.length < 20) {
      setRoutines([...routines, { title: "", time: "" }]);
    }
  };

  const removeRoutine = (index: number) => {
    if (routines.length === 1) return;
    setRoutines(routines.filter((_, i) => i !== index));
  };

  const updateRoutine = (
    index: number,
    field: keyof RoutineFormData,
    value: string
  ) => {
    const updatedRoutines = [...routines];
    updatedRoutines[index] = { ...updatedRoutines[index], [field]: value };
    setRoutines(updatedRoutines);
  };

  const sortRoutinesByTime = () => {
    setRoutines([...routines].sort((a, b) => a.time.localeCompare(b.time)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialData
              ? "Editar item da sua Rotina"
              : "Adicionar item(s) a sua Rotina"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Edite os detalhes da sua rotina abaixo"
              : "Adicione uma ou mais rotinas para o dia selecionado"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col gap-4 min-h-0"
        >
          <div className="space-y-2">
            <Label htmlFor="day" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Dia da semana
            </Label>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {DAYS.map((day, index) => (
                  <SelectItem key={day} value={index.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="flex-1 max-h-[400px] pr-4 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {routines.map((routine, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-muted/50 rounded-lg p-4 mb-4"
                >
                  <div className="absolute right-2 top-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeRoutine(index)}
                      disabled={routines.length === 1}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover item da rotina</span>
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${index}`}>Título</Label>
                      <Input
                        id={`title-${index}`}
                        value={routine.title}
                        onChange={(e) =>
                          updateRoutine(index, "title", e.target.value)
                        }
                        placeholder="Digite o título do item da rotina"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor={`time-${index}`}
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        Horário
                      </Label>
                      <Input
                        id={`time-${index}`}
                        type="time"
                        value={routine.time}
                        onChange={(e) =>
                          updateRoutine(index, "time", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none"
              onClick={addRoutine}
              disabled={isSubmitting}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar outro item
            </Button>
            {routines.length > 1 && (
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none"
                onClick={sortRoutinesByTime}
                disabled={isSubmitting}
              >
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Ordenar por horário
              </Button>
            )}
            <div className="flex-1 sm:flex-none flex justify-end gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Salvando..."
                  : initialData
                  ? "Salvar alterações"
                  : "Adicionar item(s)"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
