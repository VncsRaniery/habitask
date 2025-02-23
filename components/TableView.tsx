"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import type { Task } from "@/types"

type SortConfig = {
  key: keyof Task
  direction: "asc" | "desc"
}

type TableViewProps = {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TableView({ tasks, onTaskClick }: TableViewProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "dueDate",
    direction: "asc",
  })

  const columns = useMemo(
    () => [
      { key: "title" as const, label: "Título" },
      { key: "status" as const, label: "Status" },
      { key: "priority" as const, label: "Prioridade" },
      { key: "dueDate" as const, label: "Prazo de entrega" },
      { key: "assignedTo" as const, label: "Atribuído a" },
    ],
    [],
  )

  const sortedTasks = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      if (sortConfig.key === "dueDate") {
        return sortConfig.direction === "asc"
          ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
          : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime()
      }

      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })
    return sorted
  }, [tasks, sortConfig])

  const handleSort = (key: keyof Task) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const getSortIcon = (key: keyof Task) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4 ml-1" />
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
      case "Em Progresso":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
      case "Feita":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
      default:
        return ""
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Baixa":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
      case "Média":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
      case "Alta":
        return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
      default:
        return ""
    }
  }

  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="font-semibold">
                <Button
                  variant="ghost"
                  onClick={() => handleSort(column.key)}
                  className="flex items-center hover:bg-transparent p-0 h-auto font-semibold"
                >
                  {column.label}
                  {getSortIcon(column.key)}
                </Button>
              </TableHead>
            ))}
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow
              key={task.id}
              className="group hover:bg-muted/50 cursor-pointer"
              onClick={() => onTaskClick(task)}
            >
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick(task)
                      }}
                    >
                      Visualizar detalhes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskClick(task)
                      }}
                    >
                      Editar tarefa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}