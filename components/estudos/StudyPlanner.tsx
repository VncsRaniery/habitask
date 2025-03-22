"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { PlusCircle, BookOpen, Users, FileText, Clock, LayoutDashboard } from "lucide-react"
import SubjectsTab from "./SubjectsTab"
import ProfessorsTab from "./ProfessorsTab"
import ResourcesTab from "./ResourcesTab"
import SessionsTab from "./SessionsTab"
import DashboardTab from "./DashboardTab"
import SubjectDialog from "./SubjectDialog"
import ProfessorDialog from "./ProfessorDialog"
import type { Subject, Professor } from "@/types"

export default function StudyPlanner() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [professors, setProfessors] = useState<Professor[]>([])
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false)
  const [isProfessorDialogOpen, setIsProfessorDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [subjectsResponse, professorsResponse] = await Promise.all([
        fetch("/api/subjects"),
        fetch("/api/professors"),
      ])

      if (!subjectsResponse.ok || !professorsResponse.ok) {
        throw new Error("Falha ao buscar dados")
      }

      const subjectsData = await subjectsResponse.json()
      const professorsData = await professorsResponse.json()

      setSubjects(subjectsData)
      setProfessors(professorsData)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast.error("Falha ao carregar dados")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddSubject = async (subject: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
      })

      if (!response.ok) {
        throw new Error("Falha ao adicionar a matéria")
      }

      const newSubject = await response.json()
      setSubjects((prev) => [newSubject, ...prev])
      toast.success("Matéria adicionada com sucesso")
      return true
    } catch (error) {
      console.error("Erro ao adicionar a matéria:", error)
      toast.error("Falha ao adicionar a matéria")
      return false
    }
  }

  const handleAddProfessor = async (data: Omit<Professor, "id" | "createdAt" | "updatedAt">) => {
    try {
      const response = await fetch("/api/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao adicionar professor")
      }

      await fetchData()
      toast.success("Professor adicionado com sucesso")
      return true
    } catch (error) {
      console.error("Erro ao adicionar professor:", error)
      toast.error("Falha ao adicionar professor")
      return false
    }
  }

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao deletar a matéria")
      }

      setSubjects((prev) => prev.filter((subject) => subject.id !== id))
      toast.success("Matéria deletada com sucesso")
    } catch (error) {
      console.error("Erro ao deletar a matéria:", error)
      toast.error("Falha ao deletar a matéria")
    }
  }

  const handleUpdateSubject = async (updatedSubject: Subject) => {
    try {
      const response = await fetch(`/api/subjects/${updatedSubject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSubject),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar a matéria")
      }

      const updated = await response.json()
      setSubjects((prev) => 
        prev.map((subject) => 
          subject.id === updated.id ? updated : subject
        )
      )
      toast.success("Matéria atualizada com sucesso")
      return true
    } catch (error) {
      console.error("Erro ao atualizar a matéria:", error)
      toast.error("Falha ao atualizar a matéria")
      return false
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
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Toaster position="bottom-right" />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Planilha de Estudos
              </h1>
              <p className="text-muted-foreground mt-2">Organize sua jornada acadêmica com elegância e eficiência</p>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "subjects" && (
                <Button onClick={() => setIsSubjectDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Matéria
                </Button>
              )}
              {activeTab === "professors" && (
                <Button onClick={() => setIsProfessorDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Professor
                </Button>
              )}
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 mb-8 p-1 bg-muted/50 backdrop-blur-sm rounded-xl">
                <TabsTrigger
                  value="dashboard"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger
                  value="subjects"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Matérias</span>
                </TabsTrigger>
                <TabsTrigger
                  value="professors"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Professores</span>
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Recursos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sessions"
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Sessões</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard" className="mt-0">
                <DashboardTab subjects={subjects} professors={professors} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="subjects" className="mt-0">
                <SubjectsTab
                  subjects={subjects}
                  professors={professors}
                  onDelete={handleDeleteSubject}
                  onUpdate={handleUpdateSubject}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="professors" className="mt-0">
                <ProfessorsTab 
                  professors={professors} 
                  isLoading={isLoading} 
                  onUpdate={fetchData}
                />
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <ResourcesTab subjects={subjects} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="sessions" className="mt-0">
                <SessionsTab subjects={subjects} isLoading={isLoading} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>

      <SubjectDialog
        isOpen={isSubjectDialogOpen}
        onClose={() => setIsSubjectDialogOpen(false)}
        onSubmit={handleAddSubject}
        professors={professors}
      />

      <ProfessorDialog
        isOpen={isProfessorDialogOpen}
        onClose={() => setIsProfessorDialogOpen(false)}
        onSubmit={handleAddProfessor}
      />
    </div>
  )
}

