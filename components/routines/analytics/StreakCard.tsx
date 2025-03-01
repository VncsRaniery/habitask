"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Flame, Trophy, CheckCircle2, Percent } from "lucide-react"
import type { StreakData } from "@/types"

interface StreakCardProps {
  data: StreakData
}

export function StreakCard({ data }: StreakCardProps) {
  const stats = [
    {
      title: "Sequência Atual",
      value: data.currentStreak,
      icon: Flame,
      color: "text-orange-500",
      description: "Dias consecutivos de conclusão",
    },
    {
      title: "Sequência mais longa",
      value: data.longestStreak,
      icon: Trophy,
      color: "text-yellow-500",
      description: "Melhor sequência alcançada",
    },
    {
      title: "Total de conclusões",
      value: data.totalCompletions,
      icon: CheckCircle2,
      color: "text-emerald-500",
      description: "Rotinas concluídas em geral",
    },
    {
      title: "Taxa de conclusão",
      value: `${Math.round(data.averageCompletionRate)}%`,
      icon: Percent,
      color: "text-blue-500",
      description: "Taxa média de sucesso",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="backdrop-blur-sm bg-card/50 hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

