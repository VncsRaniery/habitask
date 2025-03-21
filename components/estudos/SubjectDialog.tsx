"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subject, Professor } from "@/types";

interface SubjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    subject: Omit<Subject, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  professors: Professor[];
  initialData?: Subject;
}

export default function SubjectDialog({
  isOpen,
  onClose,
  onSubmit,
  professors,
  initialData,
}: SubjectDialogProps) {
  const [formData, setFormData] = useState<
    Omit<Subject, "id" | "createdAt" | "updatedAt">
  >({
    name: initialData?.name || "",
    description: initialData?.description || "",
    color: initialData?.color || "#4f46e5",
    professorId: initialData?.professorId || null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData);
    setIsSubmitting(false);

    if (success) {
      setFormData({
        name: "",
        description: "",
        color: "#4f46e5",
        professorId: null,
      });
      onClose();
    }
  };

  const colors = [
    { name: "Indigo", value: "#4f46e5" },
    { name: "Rose", value: "#e11d48" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Emerald", value: "#10b981" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Purple", value: "#9333ea" },
    { name: "Pink", value: "#ec4899" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Matéria" : "Adicionar Nova Matéria"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Atualize os detalhes da sua matéria."
              : "Adicione uma nova matéria ao seu plano de estudos."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Matéria</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Matemática, Física, História"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Adicione detalhes sobre esta matéria..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <div
                    key={color.value}
                    className={`h-8 w-8 rounded-full cursor-pointer transition-all ${
                      formData.color === color.value
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() =>
                      setFormData({ ...formData, color: color.value })
                    }
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professor">Professor (Opcional)</Label>
              <Select
                value={formData.professorId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, professorId: value || null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um professor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {professors.map((professor) => (
                    <SelectItem key={professor.id} value={professor.id}>
                      {professor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name}>
              {isSubmitting
                ? "Salvando..."
                : initialData
                ? "Atualizar Matéria"
                : "Adicionar Matéria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
