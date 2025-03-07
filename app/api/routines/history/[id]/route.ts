import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const url = new URL(request.url)
    const id = url.pathname.split("/").pop() 

    if (!id) {
      return NextResponse.json(
        { error: "ID não encontrado na URL" },
        { status: 400 },
      )
    }

    const historyEntry = await db.routineHistory.update({
      where: { id },
      data: {
        completed: data.completed,
      },
    })

    return NextResponse.json(historyEntry)
  } catch (error) {
    console.error("Falha ao atualizar o histórico de rotina:", error)
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao atualizar o histórico de rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 },
    )
  }
}
