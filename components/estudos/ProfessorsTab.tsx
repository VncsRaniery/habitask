"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  Pencil,
  Trash2,
  MoreHorizontal,
  GraduationCap,
} from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Professor } from "@/types";
import { ProfessorsTabSkeleton } from "@/components/skeletons/ProfessorsTabSkeleton";
import { toast } from "sonner";
import ProfessorDialog from "./ProfessorDialog";

interface ProfessorsTabProps {
  professors: Professor[];
  isLoading: boolean;
  onUpdate: () => void;
}

export default function ProfessorsTab({
  professors,
  isLoading,
  onUpdate,
}: ProfessorsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProfessor = async (id: string) => {
    try {
      const response = await fetch(`/api/professors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Falha ao deletar professor");
      }

      toast.success("Professor deletado com sucesso");
      onUpdate();
    } catch (error) {
      console.error("Erro ao deletar professor:", error);
      toast.error("Falha ao deletar professor");
    }
  };

  const handleUpdateProfessor = async (data: Omit<Professor, "id" | "createdAt" | "updatedAt">) => {
    if (!editingProfessor) return false;

    try {
      const response = await fetch(`/api/professors/${editingProfessor.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar professor");
      }

      toast.success("Professor atualizado com sucesso");
      onUpdate();
      return true;
    } catch (error) {
      console.error("Erro ao atualizar professor:", error);
      toast.error("Falha ao atualizar professor");
      return false;
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
      transition: { duration: 0.3 },
    },
  };

  if (isLoading) {
    return <ProfessorsTabSkeleton />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Professores</h2>
          <p className="text-sm text-muted-foreground">
            Gerencie seus professores aqui
          </p>
        </div>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar professores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredProfessors.length === 0 ? (
        <div className="text-center py-10">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum professor encontrado</h3>
          <p className="text-sm text-muted-foreground">
            Comece adicionando um novo professor ao seu plano de estudos.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredProfessors.map((professor) => (
              <motion.div key={professor.id} variants={itemVariants} layout>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                      {professor.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingProfessor(professor);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Deletar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Tem certeza?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Isso irá deletar permanentemente o professor {professor.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProfessor(professor.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Deletar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    {professor.email && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{professor.email}</span>
                      </div>
                    )}
                    {professor.phone && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Phone className="h-4 w-4" />
                        <span>{professor.phone}</span>
                      </div>
                    )}
                    {!professor.email && !professor.phone && (
                      <div className="text-sm text-muted-foreground">
                        Nenhuma informação de contato disponível
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {editingProfessor && (
        <ProfessorDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingProfessor(null);
          }}
          onSubmit={handleUpdateProfessor}
          initialData={editingProfessor}
        />
      )}
    </>
  );
}
