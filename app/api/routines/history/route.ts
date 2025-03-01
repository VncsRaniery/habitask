import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = Number(searchParams.get("days")) || 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await db.routineHistory.findMany({
      where: {
        routine: {
          userId: session.user.id,
        },
        date: {
          gte: startDate,
        },
      },
      include: {
        routine: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to fetch routine history:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching routine history" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const data = await request.json();
    const routine = await db.routineItem.findFirst({
      where: {
        id: data.routineId,
        userId: session.user.id,
      },
    });

    if (!routine) {
      return NextResponse.json({ error: "Rotina não encontrada ou não pertence a você" }, { status: 403 });
    }

    const history = await db.routineHistory.create({
      data: {
        routineId: data.routineId,
        completed: data.completed,
        date: new Date(data.date),
        dayOfWeek: data.dayOfWeek,
      },
    });
    return NextResponse.json(history);
  } catch (error) {
    console.error("Failed to create routine history:", error);
    return NextResponse.json(
      { error: "An error occurred while creating routine history" },
      { status: 500 }
    );
  }
}
