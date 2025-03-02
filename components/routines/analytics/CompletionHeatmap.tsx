"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format, eachDayOfInterval, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import type { RoutineHistory } from "@/types"

interface CompletionHeatmapProps {
  history: RoutineHistory[]
  days?: number
}

export function CompletionHeatmap({ history, days = 90 }: CompletionHeatmapProps) {
  const endDate = new Date()
  const startDate = subDays(endDate, days)
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const completionsByDate = history.reduce(
    (acc, entry) => {
      const date = format(new Date(entry.date), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = { total: 0, completed: 0 }
      }
      acc[date].total++
      if (entry.completed) acc[date].completed++
      return acc
    },
    {} as Record<string, { total: number; completed: number }>,
  )

  const getColor = (completion: number) => {
    if (completion === 0) return "bg-muted hover:bg-muted/80"
    if (completion < 0.3)
      return "bg-emerald-200/80 dark:bg-emerald-900/80 hover:bg-emerald-300 dark:hover:bg-emerald-800"
    if (completion < 0.7)
      return "bg-emerald-400/80 dark:bg-emerald-700/80 hover:bg-emerald-500 dark:hover:bg-emerald-600"
    return "bg-emerald-600/80 dark:bg-emerald-500/80 hover:bg-emerald-700 dark:hover:bg-emerald-400"
  }

  return (
    <Card className="backdrop-blur-sm bg-card/50">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Mapa de conclusão</CardTitle>
        <CardDescription className="text-base">Veja seus padrões de conclusão de rotina ao longo do tempo</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-[auto_1fr] gap-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            {["Mon", "Wed", "Fri", "Sun"].map((day) => (
              <div key={day} className="h-8 flex items-center">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,20px)] gap-1">
            {dateRange.map((date, i) => {
              const key = format(date, "yyyy-MM-dd", { locale: ptBR })
              const data = completionsByDate[key] || { total: 0, completed: 0 }
              const completion = data.total > 0 ? data.completed / data.total : 0

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: i * 0.005 }}
                  className={`
                    h-5 w-5 rounded-sm
                    ${getColor(completion)}
                    transition-colors duration-200
                    hover:ring-2 hover:ring-primary/20
                    group relative
                  `}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    <div className="bg-popover text-popover-foreground text-xs rounded-md px-2 py-1 whitespace-nowrap shadow-lg">
                      <div>{format(date, "MMM d, yyyy", { locale: ptBR })}</div>
                      <div>
                        {data.completed} de {data.total} concluídos
                        {data.total > 0 && ` (${Math.round(completion * 100)}%)`}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

