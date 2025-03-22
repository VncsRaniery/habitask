import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const studySession = await db.studySession.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        subject: true,
      },
    });

    if (!studySession) {
      return NextResponse.json(
        { error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(studySession);
  } catch (error) {
    console.error("Falha ao buscar sessão:", error);
    return NextResponse.json(
      { error: "Falha ao buscar sessão" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const id = request.url.split("/").pop();
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const data = await request.json();
    const session = await db.studySession.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        completed: data.completed,
      },
      include: {
        subject: true,
      },
    });
    return NextResponse.json(session);
  } catch (error) {
    console.error("Falha ao atualizar sessão:", error);
    return NextResponse.json({ error: "Falha ao atualizar sessão" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const studySessionId = url.pathname.split("/").pop();

    if (!studySessionId) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.studySession.delete({
      where: { id: studySessionId },
    });
    return NextResponse.json({ message: "Sessão deletada com sucesso" });
  } catch (error) {
    console.error("Falha ao deletar sessão:", error);
    return NextResponse.json(
      { error: "Falha ao deletar sessão" },
      { status: 500 }
    );
  }
}
