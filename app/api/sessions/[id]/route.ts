import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { auth } from "@/auth"

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const userId = session.user.id
    const id = request.nextUrl.pathname.split("/").pop()
    const data = await request.json()

    const existingSession = await prisma.sessionPomodoro.findUnique({
      where: { id },
    })

    if (!existingSession) {
      return NextResponse.json({ error: "Sessão não encontrada" }, { status: 404 })
    }

    if (existingSession.userId !== userId) {
      return NextResponse.json({ error: "Acesso não autorizado" }, { status: 403 })
    }

    const updatedSession = await prisma.sessionPomodoro.update({
      where: { id },
      data: {
        isCompleted: data.isCompleted,
        endTime: data.endTime,
        extraTime: data.extraTime,
        pauseCount: data.pauseCount,
        totalPauseTime: data.totalPauseTime,
      },
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error("Falha ao atualizar a sessão:", error)
    return NextResponse.json({ error: "Falha ao atualizar a sessão" }, { status: 500 })
  }
}
