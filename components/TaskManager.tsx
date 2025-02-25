"use client"

import { useState, useEffect, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Toaster } from "sonner"
import { toast } from "sonner"
import TaskDialog from "./TaskDialog"
import TaskColumn from "./TaskColumn"
import TaskDetailDialog from "./TaskDetailDialog"
import TaskFilters, { type TaskFilters as TaskFiltersType } from "./TaskFilters"
import { NotificationSheet } from "./NotificationSheet"
import { ViewSelector } from "./ViewSelector"
import { TableView } from "./TableView"
import { Card, CardContent } from "@/components/ui/card"
import { TaskManagerSkeleton } from "./skeletons/TaskManagerSkeleton"
import type { Task } from "@/types"

export default function TaskManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: "",
    status: [],
    priority: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<"column" | "table" | "calendar">("column")
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/tasks")
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred"
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    let filtered = tasks

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          task.category.toLowerCase().includes(searchLower) ||
          task.assignedTo.toLowerCase().includes(searchLower),
      )
    }

    if (filters.status.length > 0) {
      filtered = filtered.filter((task) => filters.status.includes(task.status))
    }

    if (filters.priority.length > 0) {
      filtered = filtered.filter((task) => filters.priority.includes(task.priority))
    }

    setFilteredTasks(filtered)
  }, [filters, tasks])

  const addTask = async (task: Omit<Task, "id" | "createdAt">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })
      if (!response.ok) {
        throw new Error("Falha ao adicionar tarefa")
      }
      const newTask = await response.json()
      setTasks((prev) => [...prev, newTask])
      setIsDialogOpen(false)
      toast.success("Tarefa adicionada com sucesso")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao adicionar tarefa"
      toast.error(message)
    }
  }

  const updateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })
      if (!response.ok) {
        throw new Error("Falha ao atualizar tarefa")
      }
      const updatedTaskData = await response.json()
      setTasks((prev) => prev.map((task) => (task.id === updatedTaskData.id ? updatedTaskData : task)))
      setSelectedTask(null)
      toast.success("Tarefa atualizada com sucesso")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao atualizar tarefa"
      toast.error(message)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error("Falha ao deletar tarefa")
      }
      setTasks((prev) => prev.filter((task) => task.id !== taskId))
      setSelectedTask(null)
      toast.success("Tarefa deletada com sucesso")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao deletar tarefa"
      toast.error(message)
    }
  }

  const moveTask = async (taskId: string, newStatus: Task["status"]) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId)
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      await updateTask({ ...taskToUpdate, status: newStatus })
      toast.success(`Tarefa agora está ${newStatus}`)
    }
  }

  const handleFilterChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return <TaskManagerSkeleton />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <header className="flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de tarefas</h1>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <NotificationSheet tasks={tasks} />
              <Button onClick={() => setIsDialogOpen(true)} className="flex-1 sm:flex-none" size="lg">
                <PlusIcon className="mr-2 h-4 w-4" /> Adicionar tarefa
              </Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TaskFilters onFilterChange={handleFilterChange} />
            <ViewSelector currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>

        <AnimatePresence mode="wait">
          {error ? (
            <Card className="bg-destructive/10 border-destructive">
              <CardContent className="flex items-center justify-center p-6">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          ) : (
            <motion.div
              key={currentView}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="touch-pan-y"
            >
              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  {currentView === "column" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 touch-pan-y">
                      {["Pendente", "Em Progresso", "Feita"].map((status) => (
                        <TaskColumn
                          key={status}
                          title={status}
                          tasks={filteredTasks.filter((task) => task.status === status)}
                          onTaskClick={setSelectedTask}
                          onTaskMove={moveTask}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  )}
                  {currentView === "table" && (
                    <div className="overflow-x-auto -mx-4 px-4">
                      <div className="min-w-[768px]">
                        <TableView tasks={filteredTasks} onTaskClick={setSelectedTask} />
                      </div>
                    </div>
                  )}
                  {/*
                  {currentView === "calendar" && (
                    <div className="overflow-x-auto -mx-4 px-4">
                      <div className="min-w-[768px]">
                        <CalendarView tasks={filteredTasks} onTaskClick={setSelectedTask} />
                      </div>
                    </div>
                  )}
                    */}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <TaskDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} onAddTask={addTask} />

        {selectedTask && (
          <TaskDetailDialog
            task={selectedTask}
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={updateTask}
            onDelete={deleteTask}
          />
        )}
      </div>
      <Toaster position="bottom-right" className="sm:pb-4 sm:pr-4" />
    </DndProvider>
  )
}

