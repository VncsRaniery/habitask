"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Pencil, Trash2, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { RoutineItem as RoutineItemType } from "./RoutineManager";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RoutineItemProps {
  routine: RoutineItemType;
  onEdit: (routine: RoutineItemType) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export function RoutineItem({
  routine,
  onEdit,
  onDelete,
  onToggleComplete,
}: RoutineItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
      return date.toLocaleTimeString("pt-BR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return time;
    }
  };

  const handleDelete = () => {
    onDelete(routine.id);
    setIsDeleteDialogOpen(false);
  };

  const handleToggle = () => {
    if (!isClicked && isToday) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
      onToggleComplete(routine.id);
    } else if (isToday) {
      onToggleComplete(routine.id);
    }
  };

  const isToday = new Date().getDay() === routine.dayOfWeek;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.2,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="group"
      whileTap={{ scale: 0.95 }}
    >
      <Card
        className={`transition-all duration-200 hover:shadow-md
        ${routine.completed ? "bg-muted/50" : "hover:bg-accent"}
        ${isClicked ? "scale-95" : ""}`}
      >
        <CardContent className="p-3 flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <motion.div
                    animate={
                      routine.completed
                        ? {
                            scale: [1, 1.2, 1],
                            opacity: [1, 0.8, 1],
                          }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <Checkbox
                      checked={routine.completed}
                      onCheckedChange={handleToggle}
                      className={`transition-transform duration-300 
                      ${routine.completed ? "bg-primary border-primary" : ""}
                      ${
                        !isToday
                          ? "cursor-not-allowed opacity-50"
                          : "hover:scale-110"
                      }`}
                      disabled={!isToday}
                      aria-label={
                        isToday
                          ? "Alternar conclusão da rotina"
                          : "Só pode completar as rotinas de hoje"
                      }
                    />
                  </motion.div>
                </div>
              </TooltipTrigger>
              {!isToday && (
                <TooltipContent>
                  <p>
                    Você só pode marcar rotinas como concluídas no dia agendado
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <div className="flex-1 min-w-0">
            <motion.p
              className={`text-sm font-medium leading-none mb-1
              ${routine.completed ? "line-through text-muted-foreground" : ""}`}
              animate={
                routine.completed
                  ? {
                      textDecoration: "line-through",
                    }
                  : {
                      textDecoration: "none",
                    }
              }
              transition={{ duration: 0.3 }}
            >
              {routine.title}
            </motion.p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTime(routine.time)}</span>
            </div>
          </div>

          {routine.completed && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-1"
            >
              <CheckCircle className="h-3 w-3 text-green-600" />
            </motion.div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => onEdit(routine)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso excluirá permanentemente essa rotina. Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add("animate-pulse");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove("animate-pulse");
              }}
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
