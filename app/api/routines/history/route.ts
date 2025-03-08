import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getWeekNumber } from "@/lib/utils";
import { auth } from "@/auth";

interface HistoryQuery {
  routine: {
    userId: string;
  };
  weekNumber?: number;
  yearNumber?: number;
  date?: {
    gte?: Date;
    lte?: Date;
  };
  routineId?: string;
  AND?: Array<{
    date?: {
      gte?: Date;
      lte?: Date;
    };
  }>;
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";
  const routineId = searchParams.get("routineId");
  const dayOfWeek = searchParams.get("dayOfWeek");

  try {
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();
    const historyQuery: HistoryQuery = {
      routine: { userId: session.user.id },
    };

    if (period === "week") {
      historyQuery.weekNumber = currentWeek;
      historyQuery.yearNumber = currentYear;
    } else if (period === "month") {
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      historyQuery.date = { gte: fourWeeksAgo };
    } else if (period === "year") {
      historyQuery.yearNumber = currentYear;
    }

    if (routineId) {
      historyQuery.routineId = routineId;
    }

    if (dayOfWeek) {
      const dayOfWeekInt = Number.parseInt(dayOfWeek);
      if (!isNaN(dayOfWeekInt)) {
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0); // Início do dia (00:00)
        startOfDay.setDate(startOfDay.getDate() - startOfDay.getDay() + dayOfWeekInt);

        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        historyQuery.AND = [
          ...(historyQuery.AND || []),
          { date: { gte: startOfDay, lte: endOfDay } },
        ];
      }
    }

    const history = await db.routineHistory.findMany({
      where: historyQuery,
      include: {
        routine: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Falha ao buscar histórico de rotina:", error);
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao buscar o histórico de rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const data = await request.json();
    const { routineId, completed, date } = data;
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

    const routine = await db.routineItem.findUnique({
      where: { id: routineId },
    });

    if (!routine) {
      return NextResponse.json(
        { error: "Rotina não encontrada" },
        { status: 404 }
      );
    }

    if (routine.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    const existingEntry = await db.routineHistory.findFirst({
      where: {
        routineId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingEntry) {
      const updatedEntry = await db.routineHistory.update({
        where: { id: existingEntry.id },
        data: { completed },
      });
      return NextResponse.json(updatedEntry);
    }

    const weekNumber = getWeekNumber(dateObj);
    const yearNumber = dateObj.getFullYear();

    const history = await db.routineHistory.create({
      data: {
        routineId,
        completed,
        date: dateObj,
        weekNumber,
        yearNumber,
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Falha ao criar histórico de rotina:", error);
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao criar o histórico de rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}