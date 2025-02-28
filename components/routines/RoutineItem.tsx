"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/alert-dialog"
import { MoreVertical, Pencil, Trash2, Clock } from "lucide-react"
import { useState } from "react"
import type { RoutineItem as RoutineItemType } from "./RoutineManager"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RoutineItemProps {
  routine: RoutineItemType
  onEdit: (routine: RoutineItemType) => void
  onDelete: (id: string) => void
  onToggleComplete: (id: string) => void
}

export function RoutineItem({ routine, onEdit, onDelete, onToggleComplete }: RoutineItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return time
    }
  }

  const handleDelete = () => {
    onDelete(routine.id)
    setIsDeleteDialogOpen(false)
  }

  const isToday = new Date().getDay() === routine.dayOfWeek

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 30 }}
      className="group"
    >
      <Card
        className={`transition-all duration-200 hover:shadow-md
        ${routine.completed ? "bg-muted/50" : "hover:bg-accent"}`}
      >
        <CardContent className="p-3 flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Checkbox
                    checked={routine.completed}
                    onCheckedChange={() => onToggleComplete(routine.id)}
                    className={`transition-transform data-[state=checked]:scale-110
                    ${!isToday ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={!isToday}
                    aria-label={isToday ? "Toggle routine completion" : "Can only complete routines for today"}
                  />
                </div>
              </TooltipTrigger>
              {!isToday && (
                <TooltipContent>
                  <p>You can only mark routines as complete on their scheduled day</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium leading-none mb-1
              ${routine.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {routine.title}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatTime(routine.time)}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem onClick={() => onEdit(routine)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
            Isso excluirá permanentemente a rotina. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}