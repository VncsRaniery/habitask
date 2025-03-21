"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { PlusCircle, BookOpen, Users, FileText, Clock } from "lucide-react";
import SubjectsTab from "@/components/estudos/SubjectsTab";
import ProfessorsTab from "@/components/estudos/ProfessorsTab";
import SessionsTab from "@/components/estudos/SessionsTab";
import SubjectDialog from "@/components/estudos/SubjectDialog";
import ProfessorDialog from "@/components/estudos/ProfessorDialog";
import type { Subject, Professor } from "@/types";

export default function StudyPlanner() {
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isProfessorDialogOpen, setIsProfessorDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [subjectsResponse, professorsResponse] = await Promise.all([
          fetch("/api/subjects"),
          fetch("/api/professors"),
        ]);

        if (!subjectsResponse.ok || !professorsResponse.ok) {
          throw new Error("Falha ao buscar dados");
        }

        const subjectsData = await subjectsResponse.json();
        const professorsData = await professorsResponse.json();

        setSubjects(subjectsData);
        setProfessors(professorsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        toast.error("Falha ao carregar dados");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddSubject = async (
    subject: Omit<Subject, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subject),
      });

      if (!response.ok) {
        throw new Error("Falha ao adicionar matéria");
      }

      const newSubject = await response.json();
      setSubjects((prev) => [newSubject, ...prev]);
      toast.success("Matéria adicionada com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar matéria:", error);
      toast.error("Falha ao adicionar matéria");
      return false;
    }
  };

  const handleAddProfessor = async (
    professor: Omit<Professor, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await fetch("/api/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(professor),
      });

      if (!response.ok) {
        throw new Error("Falha ao adicionar professor");
      }

      const newProfessor = await response.json();
      setProfessors((prev) => [...prev, newProfessor]);
      toast.success("Professor adicionado com sucesso");
      return true;
    } catch (error) {
      console.error("Erro ao adicionar professor:", error);
      toast.error("Falha ao adicionar professor");
      return false;
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao deletar matéria");
      }

      setSubjects((prev) => prev.filter((subject) => subject.id !== id));
      toast.success("Matéria deletada com sucesso");
    } catch (error) {
      console.error("Erro ao deletar matéria:", error);
      toast.error("Falha ao deletar matéria");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Toaster position="bottom-right" />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Plano de Estudos
              </h1>
              <p className="text-muted-foreground mt-2">
                Organize suas matérias, professores e materiais de estudo
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeTab === "subjects" && (
                <Button onClick={() => setIsSubjectDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Matéria
                </Button>
              )}
              {activeTab === "professors" && (
                <Button onClick={() => setIsProfessorDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Professor
                </Button>
              )}
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div variants={itemVariants}>
            <Tabs
              defaultValue="subjects"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger
                  value="subjects"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">Matérias</span>
                </TabsTrigger>
                <TabsTrigger
                  value="professors"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Professores</span>
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Recursos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="sessions"
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden sm:inline">Sessões</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="subjects">
                <SubjectsTab
                  subjects={subjects}
                  professors={professors}
                  onDelete={handleDeleteSubject}
                  isLoading={isLoading}
                />
              </TabsContent>

              <TabsContent value="professors">
                <ProfessorsTab professors={professors} isLoading={isLoading} />
              </TabsContent>

              <TabsContent value="resources">Em Breve...</TabsContent>

              <TabsContent value="sessions">
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
  );
}
