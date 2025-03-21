import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const professors = await db.professor.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(professors);
  } catch (error) {
    console.error("Falha ao buscar professores:", error);
    return NextResponse.json(
      { error: "Falha ao buscar professores" },
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
    const professor = await db.professor.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        userId: session.user.id,
      },
    });
    return NextResponse.json(professor);
  } catch (error) {
    console.error("Falha ao criar professor:", error);
    return NextResponse.json(
      { error: "Falha ao criar professor" },
      { status: 500 }
    );
  }
}
