"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// Add Pencil to the imports
import { FileText, Upload, Download, Trash2, File, BookOpen, Image, FileArchive, FileCode, Pencil } from "lucide-react"
import { toast } from "sonner"
import type { Subject, StudyResource } from "@/types"
import { ResourcesTabSkeleton } from "@/components/skeletons/ResourcesTabSkeleton"

interface ResourcesTabProps {
  subjects: Subject[]
  isLoading: boolean
}

export default function ResourcesTab({ subjects, isLoading }: ResourcesTabProps) {
  const [resources, setResources] = useState<StudyResource[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [resourceName, setResourceName] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isLoadingResources, setIsLoadingResources] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Add editingResource state
  const [editingResource, setEditingResource] = useState<StudyResource | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setIsLoadingResources(true)
        const response = await fetch("/api/resources")
        if (!response.ok) {
          throw new Error("Falha ao buscar recursos")
        }
        const data = await response.json()
        setResources(data)
      } catch (error) {
        console.error("Erro ao buscar recursos:", error)
        toast.error("Falha ao carregar recursos")
      } finally {
        setIsLoadingResources(false)
      }
    }

    fetchResources()
  }, [])

  const filteredResources = resources.filter(
    (resource) =>
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedSubject ? resource.subjectId === selectedSubject : true),
  )

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleEditResource = (resource: StudyResource) => {
    setEditingResource(resource)
    setResourceName(resource.name)
    setResourceDescription(resource.description || "")
    setSelectedSubject(resource.subjectId)
    setIsDialogOpen(true)
  }

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resourceName || !selectedSubject) {
      toast.error("Por favor, forneça um nome e selecione uma disciplina")
      return
    }

    try {
      setIsUploading(true)

      if (editingResource) {
        const response = await fetch(`/api/resources/${editingResource.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: resourceName,
            description: resourceDescription,
          }),
        })

        if (!response.ok) {
          throw new Error("Falha ao atualizar recurso")
        }

        const updatedResource = await response.json()
        setResources((prev) =>
          prev.map((resource) => (resource.id === updatedResource.id ? updatedResource : resource)),
        )

        toast.success("Recurso atualizado com sucesso")
      } else {
        if (!selectedFile) {
          toast.error("Por favor, carregue um arquivo")
          return
        }

        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("name", resourceName)
        formData.append("description", resourceDescription)
        formData.append("subjectId", selectedSubject)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Falha ao carregar recurso")
        }

        const newResource = await response.json()
        setResources((prev) => [newResource, ...prev])

        toast.success("Recurso carregado com sucesso")
      }

      setResourceName("")
      setResourceDescription("")
      setSelectedFile(null)
      setEditingResource(null)
      setIsDialogOpen(false)
    } catch (error) {
      console.error(`Erro ao ${editingResource ? "atualizar" : "adicionar"} recurso:`, error)
      toast.error(`Falha ao ${editingResource ? "atualizar" : "adicionar"} recurso`)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDialogClose = () => {
    setResourceName("")
    setResourceDescription("")
    setSelectedFile(null)
    setEditingResource(null)
    setIsDialogOpen(false)
  }

  const handleDeleteResource = async (id: string) => {
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao deletar recurso")
      }

      setResources((prev) => prev.filter((resource) => resource.id !== id))
      toast.success("Recurso deletado com sucesso")
    } catch (error) {
      console.error("Erro ao deletar recurso:", error)
      toast.error("Falha ao deletar recurso")
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-10 w-10 text-rose-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className="h-10 w-10 text-blue-500" />
      case "zip":
      case "rar":
        return <FileArchive className="h-10 w-10 text-amber-500" />
      case "js":
      case "ts":
      case "html":
      case "css":
        return <FileCode className="h-10 w-10 text-emerald-500" />
      default:
        return <File className="h-10 w-10 text-gray-500" />
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

  if (isLoading || isLoadingResources) {
    return <ResourcesTabSkeleton />
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar recursos..."
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
          <Button
            onClick={() => {
              setEditingResource(null)
              setIsDialogOpen(true)
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Carregar Recurso
          </Button>
        </div>
      </div>

      {filteredResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Nenhum recurso encontrado</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Carregue seu primeiro recurso para começar. Você pode carregar PDFs, imagens e outros materiais de estudo.
          </p>
          <Button
            onClick={() => {
              setEditingResource(null)
              setIsDialogOpen(true)
            }}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Carregar Recurso
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
            {filteredResources.map((resource) => (
              <motion.div key={resource.id} variants={itemVariants} layout>
                <Card className="h-full overflow-hidden transition-all hover:shadow-md group">
                  <div className="h-2" style={{ backgroundColor: resource.subject.color }} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-lg break-words flex-1 max-w-[calc(100%-80px)]">{resource.name}</CardTitle>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleEditResource(resource)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDeleteResource(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4 sm:p-6">
                    {resource.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.subject.name}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2">
                        {getFileIcon(resource.fileType)}
                        <span className="text-xs uppercase font-medium">{resource.fileType}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-xs sm:text-sm whitespace-nowrap"
                        asChild
                      >
                        <a href={`/api/resources/${resource.id}/download`} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </a>
                      </Button>
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
            <DialogTitle>{editingResource ? "Editar Recurso" : "Carregar Recurso de Estudo"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddResource} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Recurso</Label>
              <Input
                id="name"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="e.g., Capítulo 1 Notas, Guia de Estudo do Semestre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                value={resourceDescription}
                onChange={(e) => setResourceDescription(e.target.value)}
                placeholder="Adicione detalhes sobre este recurso..."
                rows={3}
              />
            </div>

            {/* Update the subject selection to be disabled when editing */}
            <div className="space-y-2">
              <Label htmlFor="subject">Disciplina</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject} disabled={!!editingResource} required>
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
              {editingResource && (
                <p className="text-xs text-muted-foreground mt-1">A disciplina não pode ser alterada após o upload</p>
              )}
            </div>

            {!editingResource && (
              <div className="space-y-2">
                <Label>Carregar Arquivo</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
                  } ${selectedFile ? "bg-muted/50" : ""}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.zip,.rar,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  />

                  <div className="flex flex-col items-center justify-center text-center">
                    {selectedFile ? (
                      <>
                        <div className="mb-2">{getFileIcon(selectedFile.name.split(".").pop() || "")}</div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => setSelectedFile(null)}
                        >
                          Alterar Arquivo
                        </Button>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="font-medium">Arraste e solte seu arquivo aqui</p>
                        <p className="text-sm text-muted-foreground mt-1">ou clique para navegar pelos seus arquivos</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Navegar por arquivos
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos suportados: PDF, JPG, PNG, GIF, ZIP, RAR, DOC, DOCX, XLS, XLSX, PPT, PPTX
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleDialogClose} disabled={isUploading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isUploading || (!editingResource && !selectedFile) || !resourceName || !selectedSubject}
              >
                {isUploading ? "Carregando..." : editingResource ? "Atualizar Recurso" : "Carregar Recurso"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

