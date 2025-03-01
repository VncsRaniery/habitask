import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { RoutineHistory, StreakData, DayStats, TimeDistribution } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateStreaks(history: RoutineHistory[]): StreakData {
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  let currentStreak = 0
  let longestStreak = 0
  let totalCompletions = 0
  const totalRoutines = history.length

  let currentDate = new Date()
  for (const entry of sortedHistory) {
    const entryDate = new Date(entry.date)
    if (entry.completed) {
      if (isSameDay(currentDate, entryDate) || isConsecutiveDay(currentDate, entryDate)) {
        currentStreak++
        currentDate = entryDate
      } else {
        break
      }
    }
  }
  
  let tempStreak = 0
  let lastDate: Date | null = null

  sortedHistory.forEach((entry) => {
    if (entry.completed) {
      totalCompletions++
      const entryDate = new Date(entry.date)

      if (!lastDate || isConsecutiveDay(lastDate, entryDate)) {
        tempStreak++
      } else {
        tempStreak = 1
      }

      longestStreak = Math.max(longestStreak, tempStreak)
      lastDate = entryDate
    }
  })

  const averageCompletionRate = (totalCompletions / totalRoutines) * 100

  return {
    currentStreak,
    longestStreak,
    totalCompletions,
    averageCompletionRate,
  }
}

export function calculateDayStats(history: RoutineHistory[]): DayStats[] {
  const dayStats = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    completions: 0,
    total: 0,
    rate: 0,
  }))

  history.forEach((entry) => {
    const stats = dayStats[entry.dayOfWeek]
    if (entry.completed) stats.completions++
    stats.total++
  })

  return dayStats.map((stats) => ({
    ...stats,
    rate: stats.total > 0 ? (stats.completions / stats.total) * 100 : 0,
  }))
}

export function calculateTimeDistribution(history: RoutineHistory[]): TimeDistribution[] {
  const timeStats = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    completions: 0,
    total: 0,
    rate: 0,
  }))

  history.forEach((entry) => {
    const hour = Number.parseInt(entry.routine.time.split(":")[0])
    const stats = timeStats[hour]
    if (entry.completed) stats.completions++
    stats.total++
  })

  return timeStats.map((stats) => ({
    ...stats,
    rate: stats.total > 0 ? (stats.completions / stats.total) * 100 : 0,
  }))
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

function isConsecutiveDay(date1: Date, date2: Date): boolean {
  const diffTime = Math.abs(date1.getTime() - date2.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

