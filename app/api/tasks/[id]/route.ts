import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, title, description, category, startDate, dueDate, status, importance } = data

    const task = await db.task.update({
      where: { id },
      data: {
        title,
        description,
        category,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        status,
        importance,
      },
    })
    return NextResponse.json(task)
  } catch (error) {
    console.error("Erro ao atualizar a tarefa:", error)
    return NextResponse.json({ error: "Falha ao atualizar a tarefa" }, { status: 500 })
  }
}


export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const taskId = url.pathname.split('/').pop()

    if (!taskId) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    await db.task.delete({
      where: { id: taskId },
    })
    return NextResponse.json({ message: "Tarefa excluída com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error)
    return NextResponse.json({ error: "Falha ao excluir tarefa" }, { status: 500 })
  }
}