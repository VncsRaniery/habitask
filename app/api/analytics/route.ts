import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import type { AnalyticsData } from "@/types"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = session.user.id
    const searchParams = request.nextUrl.searchParams
    const timeframe = (searchParams.get("timeframe") as "day" | "week") || "day"

    const startDate = new Date()
    if (timeframe === "day") {
      startDate.setHours(0, 0, 0, 0)
    } else {
      const day = startDate.getDay()
      startDate.setDate(startDate.getDate() - day)
      startDate.setHours(0, 0, 0, 0)
    }

    const sessions = await prisma.sessionPomodoro.findMany({
      where: {
        startTime: {
          gte: startDate,
        },
        userId: userId,
      },
    })

    const pomodoroSessions = sessions.filter((s) => s.type === "pomodoro")
    const completedPomodoroSessions = pomodoroSessions.filter((s) => s.isCompleted)
    const incompletePomodoroSessions = pomodoroSessions.filter((s) => !s.isCompleted)

    const completedSessions = completedPomodoroSessions.length
    const incompleteSessions = incompletePomodoroSessions.length
    const totalSessions = pomodoroSessions.length
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0

    const shortBreaks = sessions.filter((s) => s.isCompleted && s.type === "shortBreak")
    const longBreaks = sessions.filter((s) => s.isCompleted && s.type === "longBreak")
    const shortBreakCount = shortBreaks.length
    const longBreakCount = longBreaks.length
    const breaksTaken = shortBreakCount + longBreakCount

    const totalFocusTime = completedPomodoroSessions.reduce((total, session) => {
      const baseTime = Math.round(session.duration / 60)
      const extraTime = Math.round((session.extraTime || 0) / 60)
      return total + baseTime + extraTime
    }, 0)

    const totalIncompleteFocusTime = incompletePomodoroSessions.reduce((total, session) => {
      if (session.endTime) {
        const timeSpent = Math.round((session.endTime.getTime() - session.startTime.getTime()) / 60000)
        return total + timeSpent
      }
      return total + Math.round(session.duration / 60 / 2)
    }, 0)

    const completedVsIncompleteRatio =
      incompleteSessions > 0
        ? Number.parseFloat((completedSessions / incompleteSessions).toFixed(2))
        : completedSessions > 0
          ? Number.POSITIVE_INFINITY
          : 0

    const timeCompletedVsIncompleteRatio =
      totalIncompleteFocusTime > 0
        ? Number.parseFloat((totalFocusTime / totalIncompleteFocusTime).toFixed(2))
        : totalFocusTime > 0
          ? Number.POSITIVE_INFINITY
          : 0

    const totalBreakTime = sessions
      .filter((s) => (s.type === "shortBreak" || s.type === "longBreak") && s.isCompleted)
      .reduce((total, session) => {
        const baseTime = Math.round(session.duration / 60)
        const extraTime = Math.round((session.extraTime || 0) / 60)
        return total + baseTime + extraTime
      }, 0)

    const sessionsWithExtraTime = sessions.filter((s) => s.isCompleted && (s.extraTime || 0) > 0)
    const totalExtraTime = sessionsWithExtraTime.reduce((total, session) => total + (session.extraTime || 0), 0)
    const avgExtraTime =
      sessionsWithExtraTime.length > 0 ? Math.round(totalExtraTime / sessionsWithExtraTime.length / 60) : 0

    const totalPauseCount = sessions.reduce((total, session) => total + (session.pauseCount || 0), 0)
    const totalPauseTime = Math.round(
      sessions.reduce((total, session) => total + (session.totalPauseTime || 0), 0) / 60,
    )
    const avgPausesPerSession = completedSessions > 0 ? (totalPauseCount / completedSessions).toFixed(1) : "0"

    const analyticsData: AnalyticsData = {
      completedSessions,
      incompleteSessions,
      sessionsPerTimeframe: totalSessions,
      completionRate,
      breaksTaken,
      totalFocusTime,
      totalBreakTime,
      totalIncompleteFocusTime,
      completedVsIncompleteRatio,
      timeCompletedVsIncompleteRatio,
      avgExtraTime,
      totalPauseCount,
      avgPausesPerSession: Number(avgPausesPerSession),
      totalPauseTime,
      shortBreakCount,
      longBreakCount,
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Falha ao obter análise:", error instanceof Error ? error.message : "Erro desconhecido")
    return NextResponse.json({ error: "Falha ao obter análise" }, { status: 500 })
  }
}

