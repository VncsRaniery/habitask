"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Clock, Calendar, User, Tag, AlertTriangle, BarChart2 } from "lucide-react"
import type { Task } from "@/types"

const CHAR_LIMITS = {
  title: 50,
  description: 200,
  category: 30,
  assignedTo: 30,
}

type EditTaskDialogProps = {
  task: Task
  isOpen: boolean
  onClose: () => void
  onEdit: (task: Task) => void
}

export default function EditTaskDialog({ task, isOpen, onClose, onEdit }: EditTaskDialogProps) {
  const [editedTask, setEditedTask] = useState<Task>(task)

  useEffect(() => {
    setEditedTask(task)
  }, [task])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      editedTask.title &&
      editedTask.description &&
      editedTask.category &&
      editedTask.startDate &&
      editedTask.dueDate
    ) {
      onEdit({
        ...editedTask,
        title: editedTask.title.trim(),
        description: editedTask.description.trim(),
        category: editedTask.category.trim(),
        assignedTo: editedTask.assignedTo.trim(),
      })
    }
  }

  const getCharacterCount = (value: string, limit: number) => {
    return `${value.length}/${limit}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Editar tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Título</Label>
              <span className="text-xs text-muted-foreground">
                {getCharacterCount(editedTask.title, CHAR_LIMITS.title)}
              </span>
            </div>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              value={editedTask.title}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  title: e.target.value.slice(0, CHAR_LIMITS.title),
                })
              }
              required
              maxLength={CHAR_LIMITS.title}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descrição</Label>
              <span className="text-xs text-muted-foreground">
                {getCharacterCount(editedTask.description, CHAR_LIMITS.description)}
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Digite a descrição da tarefa"
              value={editedTask.description}
              onChange={(e) =>
                setEditedTask({
                  ...editedTask,
                  description: e.target.value.slice(0, CHAR_LIMITS.description),
                })
              }
              required
              maxLength={CHAR_LIMITS.description}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="category">Categoria</Label>
                <span className="text-xs text-muted-foreground">
                  {getCharacterCount(editedTask.category, CHAR_LIMITS.category)}
                </span>
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="category"
                  placeholder="Digite a categoria"
                  value={editedTask.category}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      category: e.target.value.slice(0, CHAR_LIMITS.category),
                    })
                  }
                  required
                  maxLength={CHAR_LIMITS.category}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="assignedTo">Atribuído a</Label>
                <span className="text-xs text-muted-foreground">
                  {getCharacterCount(editedTask.assignedTo, CHAR_LIMITS.assignedTo)}
                </span>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="assignedTo"
                  placeholder="Digite o nome do responsável"
                  value={editedTask.assignedTo}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      assignedTo: e.target.value.slice(0, CHAR_LIMITS.assignedTo),
                    })
                  }
                  readOnly // Campo não editável
                  maxLength={CHAR_LIMITS.assignedTo}
                  className="pl-10 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data de início</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="date"
                  id="startDate"
                  value={new Date(editedTask.startDate).toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      startDate: e.target.value,
                    })
                  }
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md bg-background"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Prazo de entrega</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="date"
                  id="dueDate"
                  value={new Date(editedTask.dueDate).toISOString().split("T")[0]}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      dueDate: e.target.value,
                    })
                  }
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md bg-background"
                  min={editedTask.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedTask.status}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    status: value as Task["status"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                  <SelectItem value="Feita">Feita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Horas estimadas</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="number"
                  id="estimatedHours"
                  placeholder="Digite as horas estimadas"
                  value={editedTask.estimatedHours}
                  onChange={(e) =>
                    setEditedTask({
                      ...editedTask,
                      estimatedHours: Number(e.target.value),
                    })
                  }
                  min="0"
                  step="0.5"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select
                value={editedTask.priority}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    priority: value as Task["priority"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-emerald-500" />
                      Baixa
                    </div>
                  </SelectItem>
                  <SelectItem value="Média">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                      Média
                    </div>
                  </SelectItem>
                  <SelectItem value="Alta">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-rose-500" />
                      Alta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="importance">Importância</Label>
              <Select
                value={editedTask.importance}
                onValueChange={(value) =>
                  setEditedTask({
                    ...editedTask,
                    importance: value as Task["importance"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select importance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Baixa">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4 text-emerald-500" />
                      Baixa
                    </div>
                  </SelectItem>
                  <SelectItem value="Média">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4 text-amber-500" />
                      Média
                    </div>
                  </SelectItem>
                  <SelectItem value="Alta">
                    <div className="flex items-center">
                      <BarChart2 className="mr-2 h-4 w-4 text-rose-500" />
                      Alta
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Salvar alterações
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

