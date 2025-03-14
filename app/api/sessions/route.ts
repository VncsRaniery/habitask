import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import type { SessionData } from "@/types"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = session.user.id
    if (!userId) {
      return NextResponse.json({ error: "ID de usuário inválido" }, { status: 400 })
    }

    const data: SessionData = await request.json()

    const pomodoroSession = await prisma.sessionPomodoro.create({
      data: {
        type: data.type,
        startTime: data.startTime,
        isCompleted: data.isCompleted,
        duration: data.duration,
        extraTime: data.extraTime || 0,
        pauseCount: data.pauseCount || 0,
        totalPauseTime: data.totalPauseTime || 0,
        userId: userId,
      },
    })

    return NextResponse.json(pomodoroSession, { status: 201 })
  } catch (error) {
    console.error("Falha ao criar sessão:", error)
    return NextResponse.json({ error: "Falha ao criar sessão" }, { status: 500 })
  }
}
