import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getWeekNumber } from "@/lib/utils";

type HistoryQuery = {
  AND?: { weekNumber: number; yearNumber: number }[];
  date?: { gte?: Date; dayOfWeek?: number };
  yearNumber?: number;
  routineId?: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";
  const routineId = searchParams.get("routineId");
  const dayOfWeek = searchParams.get("dayOfWeek");

  try {
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();
    const historyQuery: HistoryQuery = {};

    if (period === "week") {
      historyQuery.AND = [{ weekNumber: currentWeek, yearNumber: currentYear }];
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
        historyQuery.date = {
          ...historyQuery.date,
          dayOfWeek: dayOfWeekInt,
        };
      }
    }

    const history = await db.routineHistory.findMany({
      where: historyQuery,
      include: {
        routine: true,
      },
      orderBy: {
        date: "desc",
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
    const data = await request.json();
    const { routineId, completed, date } = data;
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);

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
