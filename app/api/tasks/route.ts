import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const tasks = await db.task.findMany({
      where: {
        userId: session.user.id,
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Falha ao buscar tarefas:", error)
    return NextResponse.json({ error: "Falha ao buscar tarefas" }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })
    }

    const data = await request.json()
    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        startDate: new Date(data.startDate),
        dueDate: new Date(data.dueDate),
        status: data.status,
        priority: data.priority,
        importance: data.importance,
        assignedTo: data.assignedTo,
        estimatedHours: data.estimatedHours,
        userId: session.user.id, // Agora garantido como string
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Falha ao criar tarefa:", error)
    return NextResponse.json({ error: "Falha ao criar tarefa" }, { status: 500 })
  }
}