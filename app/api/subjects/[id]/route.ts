import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const data = await request.json();
    const { id } = data;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const subject = await db.subject.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        professor: true,
        resources: true,
        sessions: {
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Assunto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Falha ao buscar assunto:", error);
    return NextResponse.json(
      { error: "Falha ao buscar assunto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, name, description, color, professorId } = data;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const subject = await db.subject.update({
      where: { id },
      data: { name, description, color, professorId },
      include: { professor: true },
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Falha ao atualizar assunto:", error);
    return NextResponse.json({ error: "Falha ao atualizar assunto" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const subjectId = url.pathname.split('/').pop()

    if (!subjectId) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 })
    }

    await db.subject.delete({
      where: { id: subjectId },
    })
    return NextResponse.json({ message: "Assunto excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error)
    return NextResponse.json({ error: "Falha ao excluir tarefa" }, { status: 500 })
  }
}