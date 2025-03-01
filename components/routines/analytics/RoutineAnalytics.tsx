"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"
import { StreakCard } from "./StreakCard"
import { CompletionHeatmap } from "./CompletionHeatmap"
import { TimeDistributionChart } from "./TimeDistributionChart"
import { DayAnalysisChart } from "./DayAnalysisChart"
import { HistoryTable } from "./HistoryTable"
import { calculateStreaks, calculateDayStats, calculateTimeDistribution } from "@/lib/utils"
import type { RoutineHistory } from "@/types"
import { AnalyticsSkeleton } from "./AnalyticsSkeleton"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function RoutineAnalytics() {
  const [history, setHistory] = useState<RoutineHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await fetch("/api/routines/history?days=90")
      if (!response.ok) throw new Error("Failed to fetch history")
      const data = await response.json()
      setHistory(data)
    } catch (error) {
      console.error("Error fetching routine history:", error)
      toast.error("Failed to load routine history")
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    const data = JSON.stringify(history, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `routine-history-${format(new Date(), "yyyy-MM-dd")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isLoading) return <AnalyticsSkeleton />

  const streakData = calculateStreaks(history)
  const dayStats = calculateDayStats(history)
  const timeDistribution = calculateTimeDistribution(history)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Análise de rotina</h1>
              <p className="text-lg text-muted-foreground">
              Acompanhe a conclusão da sua rotina e analise seus hábitos ao longo do tempo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/rotinas">
                <Button variant="outline" size="lg" className="h-11">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Voltar as rotinas
                </Button>
              </Link>
              <Button size="lg" className="h-11" onClick={exportData}>
                <Download className="mr-2 h-5 w-5" />
                Exportar Dados
              </Button>
            </div>
          </div>

          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            <motion.div variants={itemVariants}>
              <StreakCard data={streakData} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CompletionHeatmap history={history} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="grid gap-6 md:grid-cols-2">
                <TimeDistributionChart data={timeDistribution} />
                <DayAnalysisChart data={dayStats} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <HistoryTable history={history} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

