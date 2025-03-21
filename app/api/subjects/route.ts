import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const subjects = await db.subject.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        professor: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
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
    const subject = await db.subject.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color,
        professorId: data.professorId,
        userId: session.user.id,
      },
      include: {
        professor: true,
      },
    });
    return NextResponse.json(subject);
  } catch (error) {
    console.error("Failed to create subject:", error);
    return NextResponse.json(
      { error: "Failed to create subject" },
      { status: 500 }
    );
  }
}
