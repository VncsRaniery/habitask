"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  Calendar,
  Clock,
  User,
  Tag,
  BarChart2,
  AlertTriangle,
} from "lucide-react";
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
import EditTaskDialog from "./EditTaskDialog";
import type { Task } from "@/types";

type TaskDetailDialogProps = {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

export default function TaskDetailDialog({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (updatedTask: Task) => {
    onEdit(updatedTask);
    setIsEditDialogOpen(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Em Progresso":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Feita":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Baixa":
        return "text-green-600";
      case "Média":
        return "text-yellow-600";
      case "Alta":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "Baixa":
        return "text-green-600";
      case "Média":
        return "text-yellow-600";
      case "Alta":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {task.title}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(task.status)} px-2 py-1`}>
                  {task.status}
                </Badge>
                <Badge variant="outline" className="px-2 py-1">
                  ID: {task.id.slice(0, 8)}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Descrição
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {task.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Categoria
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {task.category}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Atribuído a
                  </h3>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {task.assignedTo}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Prioridade
                  </h3>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle
                      className={`w-4 h-4 ${getPriorityColor(task.priority)}`}
                    />
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      {task.priority}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Data de início
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatDate(task.startDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Prazo de entrega
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Importância
                  </h3>
                  <div className="flex items-center space-x-2">
                    <BarChart2
                      className={`w-4 h-4 ${getImportanceColor(
                        task.importance
                      )}`}
                    />
                    <p className="text-gray-700 dark:text-gray-300 capitalize">
                      {task.importance}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tempo estimado: {task.estimatedHours} horas
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Criado em: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2">
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                variant="outline"
                className="w-full flex items-center justify-center"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar tarefa
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar tarefa
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza de que deseja excluir esta tarefa?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá
                      permanentemente a tarefa.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <EditTaskDialog
        task={task}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onEdit={handleEdit}
      />
    </>
  );
}
