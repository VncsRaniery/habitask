"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import type { RoutineHistory } from "@/types"

interface HistoryTableProps {
  history: RoutineHistory[]
}

export function HistoryTable({ history }: HistoryTableProps) {
  const [filter, setFilter] = useState<"all" | "completed" | "missed">("all")

  const filteredHistory = history.filter((entry) => {
    if (filter === "all") return true
    if (filter === "completed") return entry.completed
    return !entry.completed
  })

  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold">História</CardTitle>
          <CardDescription className="text-base">Registro detalhado de suas conclusões e erros de rotina</CardDescription>
        </div>
        <Select value={filter} onValueChange={(value: "all" | "completed" | "missed") => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter history" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as entradas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="missed">Perdidas</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Rotina</TableHead>
                <TableHead>Tempo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={entry.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">{format(new Date(entry.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{entry.routine.title}</TableCell>
                  <TableCell>{format(new Date(`2000-01-01T${entry.routine.time}`), "h:mm a")}</TableCell>
                  <TableCell>
                    <Badge
                      variant={entry.completed ? "default" : "secondary"}
                      className={`${
                        entry.completed ? "bg-emerald-500 hover:bg-emerald-600" : "hover:bg-muted-foreground/20"
                      } transition-colors`}
                    >
                      {entry.completed ? "Completed" : "Missed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

