"use client"

import { useRef } from "react"
import { useDrop } from "react-dnd"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import TaskCard from "./TaskCard"
import { TaskCardSkeleton } from "./TaskCardSkeleton"
import type { Task } from "@/types"

type TaskColumnProps = {
  title: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void
  isLoading: boolean
}

export default function TaskColumn({ title, tasks, onTaskClick, onTaskMove, isLoading }: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => {
      onTaskMove(item.id, title as Task["status"])
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
      case "Em Progresso":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
      case "Feita":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"
    }
  }

  const divRef = useRef<HTMLDivElement>(null)

  return (
    <Card
    ref={(node) => {
        drop(node)
        divRef.current = node
      }}
      className={`transition-colors duration-300 h-[calc(100vh-280px)] flex flex-col
        ${isOver ? "bg-muted/60 ring-2 ring-primary/20" : ""}`}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="secondary" className={getStatusColor(title)}>
            {tasks.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-2">
        <ScrollArea className="h-full pr-4">
          <AnimatePresence mode="popLayout">
            <motion.div
              className="space-y-3"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
              }}
            >
              {isLoading ? (
                [...Array(3)].map((_, index) => (
                  <motion.div
                    key={`skeleton-${index}`}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <TaskCardSkeleton />
                  </motion.div>
                ))
              ) : tasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-32 text-center p-4"
                >
                  <p className="text-sm text-muted-foreground">Sem tarefas</p>
                  <p className="text-xs text-muted-foreground">Arraste tarefas aqui ou adicione uma nova</p>
                </motion.div>
              ) : (
                tasks.map((task) => (
                  <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} isDone={title === "Feita"} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}