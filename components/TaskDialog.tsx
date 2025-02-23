"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { Clock, Calendar, User, Tag, AlertTriangle, BarChart2 } from "lucide-react"
import type { Task } from "@/types"

const CHAR_LIMITS = {
  title: 50,
  description: 200,
  category: 30,
  assignedTo: 30,
}

type TaskDialogProps = {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void
}

export default function TaskDialog({ isOpen, onClose, onAddTask }: TaskDialogProps) {
  const { data: session } = useSession()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [status, setStatus] = useState<Task["status"]>("Pendente")
  const [priority, setPriority] = useState<Task["priority"]>("Média")
  const [importance, setImportance] = useState<Task["importance"]>("Média")
  const [assignedTo, setAssignedTo] = useState(session?.user?.name ?? "User")
  const [estimatedHours, setEstimatedHours] = useState(0)

  useEffect(() => {
    if (session?.user?.name) {
      setAssignedTo(session.user.name)
    }
  }, [session?.user?.name])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && description && category && startDate && dueDate) {
      const newTask: Omit<Task, "id" | "createdAt"> = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        startDate,
        dueDate,
        status,
        priority,
        importance,
        assignedTo,
        estimatedHours,
      }
      onAddTask(newTask)
      // Reset form
      setTitle("")
      setDescription("")
      setCategory("")
      setStartDate("")
      setDueDate("")
      setStatus("Pendente")
      setPriority("Média")
      setImportance("Média")
      setAssignedTo(session?.user?.name ?? "User")
      setEstimatedHours(0)
    }
  }

  const getCharacterCount = (value: string, limit: number) => {
    return `${value.length}/${limit}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Criar nova tarefa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">Título</Label>
              <span className="text-xs text-muted-foreground">{getCharacterCount(title, CHAR_LIMITS.title)}</span>
            </div>
            <Input
              id="title"
              placeholder="Digite o título da tarefa"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, CHAR_LIMITS.title))}
              required
              maxLength={CHAR_LIMITS.title}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descrição</Label>
              <span className="text-xs text-muted-foreground">
                {getCharacterCount(description, CHAR_LIMITS.description)}
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Digite a descrição da tarefa"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, CHAR_LIMITS.description))}
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
                  {getCharacterCount(category, CHAR_LIMITS.category)}
                </span>
              </div>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="category"
                  placeholder="Digite a categoria"
                  value={category}
                  onChange={(e) => setCategory(e.target.value.slice(0, CHAR_LIMITS.category))}
                  required
                  maxLength={CHAR_LIMITS.category}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="assignedTo">Atribuido a</Label>
                <span className="text-xs text-muted-foreground">
                  {getCharacterCount(assignedTo, CHAR_LIMITS.assignedTo)}
                </span>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="assignedTo"
                  placeholder="Enter assignee"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value.slice(0, CHAR_LIMITS.assignedTo))}
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
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
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
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="w-full pl-10 pr-3 py-2 border rounded-md bg-background"
                  min={startDate || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as Task["status"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
                  placeholder="Enter hours"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
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
              <Select value={priority} onValueChange={(value) => setPriority(value as Task["priority"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
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
              <Label htmlFor="importance">Importance</Label>
              <Select value={importance} onValueChange={(value) => setImportance(value as Task["importance"])}>
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

          <Button type="submit" className="w-full rounded">
            Criar tarefa
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}