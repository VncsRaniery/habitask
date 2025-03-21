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
import type { Professor } from "@/types";

interface ProfessorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    professor: Omit<Professor, "id" | "createdAt" | "updatedAt">
  ) => Promise<boolean>;
  initialData?: Professor;
}

export default function ProfessorDialog({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ProfessorDialogProps) {
  const [formData, setFormData] = useState<
    Omit<Professor, "id" | "createdAt" | "updatedAt">
  >({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
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
        email: "",
        phone: "",
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Professor" : "Adicionar Novo Professor"}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? "Atualize os detalhes do seu professor."
              : "Adicione um novo professor ao seu plano de estudo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Professor</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Dr. João da Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Opcional)</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="professor@universidade.com.br"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone (Opcional)</Label>
            <Input
              id="phone"
              value={formData.phone || ""}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+55 (11) 99999-9999"
            />
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
                ? "Atualizar Professor"
                : "Adicionar Professor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
