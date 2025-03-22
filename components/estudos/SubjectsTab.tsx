"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, MoreHorizontal, User, BookOpen } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import type { Subject, Professor } from "@/types"
import SubjectDialog from "./SubjectDialog"
import { SubjectsTabSkeleton } from "@/components/skeletons/SubjectsTabSkeleton"

interface SubjectsTabProps {
  subjects: Subject[]
  professors: Professor[]
  onDelete: (id: string) => Promise<void>
  onUpdate: (subject: Subject) => Promise<boolean>
  isLoading: boolean
}

export default function SubjectsTab({ subjects, professors, onDelete, onUpdate, isLoading }: SubjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const filteredSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleEditSubject = async (subject: Omit<Subject, "id" | "createdAt" | "updatedAt">) => {
    if (!editingSubject) return false

    const updatedSubject = {
      ...editingSubject,
      ...subject
    }

    const success = await onUpdate(updatedSubject)
    return success
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

  if (isLoading) {
    return <SubjectsTabSkeleton />
  }

  return (
    <>
      <div className="mb-6">
        <Input
          placeholder="Pesquisar matérias..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhuma matéria encontrada</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Adicione sua primeira matéria para começar a usar o seu plano de estudo.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredSubjects.map((subject) => (
              <motion.div key={subject.id} variants={itemVariants} layout>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md group">
                  <div className="h-2" style={{ backgroundColor: subject.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{subject.name}</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingSubject(subject)
                              setIsEditDialogOpen(true)
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
                                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Isso irá deletar permanentemente a matéria de {subject.name} e todos os recursos e sessões associados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(subject.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Deletar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {subject.description && (
                      <CardDescription className="line-clamp-2">{subject.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pb-2">
                    {subject.professor && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-2 h-4 w-4" />
                        <span>{subject.professor.name}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`/dashboard/estudos/assuntos/${subject.id}`}>Ver Detalhes</a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {editingSubject && (
        <SubjectDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setEditingSubject(null)
          }}
          onSubmit={handleEditSubject}
          professors={professors}
          initialData={editingSubject}
        />
      )}
    </>
  )
}

