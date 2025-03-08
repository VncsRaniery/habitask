import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = session.user.id;

  const { searchParams } = new URL(request.url);
  const routineId = searchParams.get("routineId");
  const dateStr = searchParams.get("date");

  if (!routineId || !dateStr) {
    return NextResponse.json(
      { error: "routineId e date são parâmetros obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const date = new Date(dateStr);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const historyEntry = await db.routineHistory.findFirst({
      where: {
        routineId: routineId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        routine: {
          userId: userId,
        },
      },
    });

    if (historyEntry) {
      return NextResponse.json({
        exists: true,
        id: historyEntry.id,
      });
    } else {
      return NextResponse.json({
        exists: false,
      });
    }
  } catch (error) {
    console.error("Falha ao verificar o histórico de rotina:", error);
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao verificar o histórico de rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}