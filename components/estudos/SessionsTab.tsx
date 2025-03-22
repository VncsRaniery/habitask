"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns"
import { Clock, Calendar, BookOpen, CheckCircle, XCircle, Plus, Trash2, AlarmClock, Pencil } from "lucide-react"
import { toast } from "sonner"
import type { Subject, StudySession } from "@/types"
import { SessionsTabSkeleton } from "@/components/skeletons/SessionsTabSkeleton"
import { ptBR } from "date-fns/locale"

interface SessionsTabProps {
  subjects: Subject[]
  isLoading: boolean
}

export default function SessionsTab({ subjects, isLoading }: SessionsTabProps) {
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [viewMode, setViewMode] = useState<"all" | "upcoming" | "past" | "completed">("all")
  const [editingSession, setEditingSession] = useState<StudySession | null>(null)

  // Form state
  const [sessionTitle, setSessionTitle] = useState("")
  const [sessionDescription, setSessionDescription] = useState("")
  const [sessionSubject, setSessionSubject] = useState("")
  const [sessionStartTime, setSessionStartTime] = useState("")
  const [sessionEndTime, setSessionEndTime] = useState("")
  const [sessionCompleted, setSessionCompleted] = useState(false)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoadingSessions(true)
        const response = await fetch("/api/sessions-study")
        if (!response.ok) {
          throw new Error("Falha ao buscar sessões")
        }
        const data = await response.json()
        setSessions(data)
      } catch (error) {
        console.error("Erro ao buscar sessões:", error)
        toast.error("Falha ao carregar sessões")
      } finally {
        setIsLoadingSessions(false)
      }
    }

    fetchSessions()
  }, [])

  const getFilteredSessions = () => {
    let filtered = sessions

    if (searchQuery) {
      filtered = filtered.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if (selectedSubject) {
      filtered = filtered.filter((session) => session.subjectId === selectedSubject)
    }

    switch (viewMode) {
      case "upcoming":
        filtered = filtered.filter((session) => {
          const sessionDate = parseISO(session.startTime)
          return !session.completed && !isPast(sessionDate)
        })
        break
      case "past":
        filtered = filtered.filter((session) => {
          const sessionDate = parseISO(session.startTime)
          return isPast(sessionDate) && !session.completed
        })
        break
      case "completed":
        filtered = filtered.filter((session) => session.completed)
        break
    }

    return filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }

  const filteredSessions = getFilteredSessions()

  const handleEditSession = (session: StudySession) => {
    setEditingSession(session)
    setSessionTitle(session.title)
    setSessionDescription(session.description || "")
    setSessionSubject(session.subjectId)
    setSessionStartTime(new Date(session.startTime).toISOString().slice(0, 16))
    setSessionEndTime(new Date(session.endTime).toISOString().slice(0, 16))
    setSessionCompleted(session.completed)
    setIsDialogOpen(true)
  }

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sessionTitle || !sessionSubject || !sessionStartTime || !sessionEndTime) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      if (editingSession) {
        // Update existing session
        const response = await fetch(`/api/sessions-study/${editingSession.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: sessionTitle,
            description: sessionDescription,
            subjectId: sessionSubject,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            completed: sessionCompleted,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to update session")
        }

        const updatedSession = await response.json()
        setSessions((prev) => prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)))
        toast.success("Sessão de estudo atualizada com sucesso")
      } else {
        // Add new session
        const response = await fetch("/api/sessions-study", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: sessionTitle,
            description: sessionDescription,
            subjectId: sessionSubject,
            startTime: sessionStartTime,
            endTime: sessionEndTime,
            completed: sessionCompleted,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to add session")
        }

        const newSession = await response.json()
        setSessions((prev) => [newSession, ...prev])
        toast.success("Sessão de estudo adicionada com sucesso")
      }

      // Reset form
      setSessionTitle("")
      setSessionDescription("")
      setSessionSubject("")
      setSessionStartTime("")
      setSessionEndTime("")
      setSessionCompleted(false)
      setEditingSession(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error(`Erro ${editingSession ? "atualizando" : "adicionando"} sessão:`, error)
      toast.error(`Falha ao ${editingSession ? "atualizar" : "adicionar"} sessão de estudo`)
    }
  }

  const handleDeleteSession = async (id: string) => {
    try {
      const response = await fetch(`/api/sessions-study/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete session")
      }

      setSessions((prev) => prev.filter((session) => session.id !== id))
      toast.success("Session deleted successfully")
    } catch (error) {
      console.error("Error deleting session:", error)
      toast.error("Failed to delete session")
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const session = sessions.find((s) => s.id === id)
      if (!session) return

      const response = await fetch(`/api/sessions-study/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...session,
          completed: !completed,
        }),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar sessão")
      }

      const updatedSession = await response.json()
      setSessions((prev) => prev.map((s) => (s.id === id ? updatedSession : s)))

      toast.success(`Sessão marcada como ${!completed ? "concluída" : "incompleta"}`)
    } catch (error) {
      console.error("Erro ao atualizar sessão:", error)
      toast.error("Falha ao atualizar sessão")
    }
  }

  const getSessionStatusBadge = (session: StudySession) => {
    const sessionDate = parseISO(session.startTime)

    if (session.completed) {
      return (
        <div className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-xs font-medium">
          Completed
        </div>
      )
    } else if (isToday(sessionDate)) {
      return (
        <div className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 text-xs font-medium">
          Today
        </div>
      )
    } else if (isTomorrow(sessionDate)) {
      return (
        <div className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 text-xs font-medium">
          Tomorrow
        </div>
      )
    } else if (isPast(sessionDate)) {
      return (
        <div className="px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 text-xs font-medium">
          Missed
        </div>
      )
    } else {
      return (
        <div className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-xs font-medium">
          Upcoming
        </div>
      )
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const handleDialogClose = () => {
    setSessionTitle("")
    setSessionDescription("")
    setSessionSubject("")
    setSessionStartTime("")
    setSessionEndTime("")
    setSessionCompleted(false)
    setEditingSession(null)
    setIsDialogOpen(false)
  }

  if (isLoading || isLoadingSessions) {
    return <SessionsTabSkeleton />
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar sessões de estudo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por disciplina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as disciplinas</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Sessão
          </Button>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={viewMode === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("all")}
          className="rounded-full"
        >
          Todas as Sessões
        </Button>
        <Button
          variant={viewMode === "upcoming" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("upcoming")}
          className="rounded-full"
        >
          Agendadas
        </Button>
        <Button
          variant={viewMode === "past" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("past")}
          className="rounded-full"
        >
          Perdidas
        </Button>
        <Button
          variant={viewMode === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("completed")}
          className="rounded-full"
        >
          Concluídas
        </Button>
      </div>

      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlarmClock className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhuma sessão de estudo encontrada</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {viewMode === "all"
              ? "Adicione sua primeira sessão de estudo para começar a usar o seu planeador de estudo."
              : `Nenhuma sessão ${viewMode} encontrada. Tente alterar seus filtros.`}
          </p>
          <Button onClick={() => setIsDialogOpen(true)} className="mt-4 bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Sessão
          </Button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence>
            {filteredSessions.map((session) => (
              <motion.div key={session.id} variants={itemVariants} layout>
                <Card
                  className={`h-full overflow-hidden transition-all hover:shadow-md group ${
                    session.completed ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="h-2" style={{ backgroundColor: session.subject.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className={`text-lg ${session.completed ? "line-through opacity-70" : ""}`}>
                          {session.title}
                        </CardTitle>
                        <div className="mt-2">{getSessionStatusBadge(session)}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleToggleComplete(session.id, session.completed)}
                        >
                          {session.completed ? (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditSession(session)
                          }}
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {session.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{session.subject.name}</span>
                    </div>
                    <div className="flex flex-col gap-2 text-sm p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(parseISO(session.startTime), "EEEE, MMMM d, yyyy", { locale: ptBR })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(parseISO(session.startTime), "h:mm a", { locale: ptBR })} -{" "}
                          {format(parseISO(session.endTime), "h:mm a", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingSession ? "Editar Sessão de Estudo" : "Adicionar Sessão de Estudo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSession} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Sessão</Label>
              <Input
                id="title"
                value={sessionTitle}
                onChange={(e) => setSessionTitle(e.target.value)}
                placeholder="e.g., Revisão do Semestre, Estudo do Capítulo 5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={sessionDescription}
                onChange={(e) => setSessionDescription(e.target.value)}
                placeholder="Adicione detalhes sobre esta sessão de estudo..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina</Label>
              <Select value={sessionSubject} onValueChange={setSessionSubject} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora de Início</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={sessionStartTime}
                  onChange={(e) => setSessionStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Hora de Término</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={sessionEndTime}
                  onChange={(e) => setSessionEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="completed"
                checked={sessionCompleted}
                onCheckedChange={(checked) => setSessionCompleted(checked as boolean)}
              />
              <Label htmlFor="completed">Marcar como concluído</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleDialogClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                {editingSession ? "Atualizar Sessão" : "Adicionar Sessão"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

