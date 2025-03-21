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

    const professor = await db.professor.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        subjects: true,
      },
    });

    if (!professor) {
      return NextResponse.json(
        { error: "Professor não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(professor);
  } catch (error) {
    console.error("Falha ao buscar professor:", error);
    return NextResponse.json(
      { error: "Falha ao buscar professor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    const data = await request.json();
    const professor = await db.professor.update({
      where: {
        id: id,
        userId: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });
    return NextResponse.json(professor);
  } catch (error) {
    console.error("Falha ao atualizar professor:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar professor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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

    const professor = await db.professor.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!professor) {
      return NextResponse.json(
        { error: "Professor não encontrado" },
        { status: 404 }
      );
    }

    await db.professor.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    });
    return NextResponse.json({ message: "Professor deletado com sucesso" });
  } catch (error) {
    console.error("Falha ao deletar professor:", error);
    return NextResponse.json(
      { error: "Falha ao deletar professor" },
      { status: 500 }
    );
  }
}
