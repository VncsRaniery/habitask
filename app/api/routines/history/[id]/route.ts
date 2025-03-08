import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const data = await request.json();
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "ID não encontrado na URL" },
        { status: 400 }
      );
    }

    // Busca a entrada de histórico de rotina para verificar o dono
    const historyEntry = await db.routineHistory.findUnique({
      where: { id },
      include: {
        routine: true, // Inclui a rotina associada
      },
    });

    if (!historyEntry) {
      return NextResponse.json(
        { error: "Histórico de rotina não encontrado" },
        { status: 404 }
      );
    }

    // Verifica se o usuário autenticado é o dono da rotina
    if (historyEntry.routine.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Atualiza a entrada de histórico de rotina
    const updatedHistory = await db.routineHistory.update({
      where: { id },
      data: {
        completed: data.completed,
      },
    });

    return NextResponse.json(updatedHistory);
  } catch (error) {
    console.error("Falha ao atualizar o histórico de rotina:", error);
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao atualizar o histórico de rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
