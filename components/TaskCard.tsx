"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, User } from "lucide-react";
import type { Task } from "@/types";

type TaskCardProps = {
  task: Task;
  onClick: () => void;
  isDone: boolean;
};

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(
  ({ task, onClick, isDone }: TaskCardProps, ref) => {
    const [{ isDragging }, drag] = useDrag({
      type: "TASK",
      item: { id: task.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const priorityColors = {
      Baixa:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
      Média:
        "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
      Alta: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
    };

    const cardVariants = {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      hover: { scale: 1.02 },
      tap: { scale: 0.98 },
    };

    const divRef = useRef<HTMLDivElement>(null);

    // Expondo o drag como a referência para o div
    useImperativeHandle(ref, () => divRef.current as HTMLDivElement);

    return (
      <motion.div
        ref={(node) => {
          drag(node); // associando o drag ao elemento
          divRef.current = node; // armazenando o node para o uso imperativo
        }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        whileTap="tap"
        style={{
          opacity: isDragging ? 0.5 : 1,
        }}
        className="touch-none select-none"
      >
        <Card
          onClick={onClick}
          className={`group relative overflow-hidden transition-all duration-300 
          ${isDone ? "opacity-60 hover:opacity-80 blur-[0.5px]" : ""}
          hover:shadow-lg dark:hover:shadow-primary/10
          active:scale-95 transform-gpu
          touch-manipulation`}
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 
            opacity-0 group-hover:opacity-100 transition-opacity
            touch-none pointer-events-none"
          />

          <CardHeader className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold leading-none tracking-tight line-clamp-1 flex-1">
                {task.title}
              </h3>
              <Badge className={`shrink-0 ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 break-words">
              {task.description}
            </p>
          </CardHeader>

          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
              {task.assignedTo && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">
                    {task.assignedTo}
                  </span>
                </div>
              )}
              {task.estimatedHours > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimatedHours} horas</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }
);

TaskCard.displayName = "TaskCard"

export default TaskCard