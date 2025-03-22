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

    const resource = await db.studyResource.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        subject: true,
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Failed to fetch resource:", error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
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
    const resource = await db.studyResource.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
      include: {
        subject: true,
      },
    });
    return NextResponse.json(resource);
  } catch (error) {
    console.error("Falha ao atualizar sessão:", error);
    return NextResponse.json({ error: "Falha ao atualizar sessão" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const studyResourceId = url.pathname.split("/").pop();

    if (!studyResourceId) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.studyResource.delete({
      where: { id: studyResourceId },
    });
    return NextResponse.json({ message: "Recurso deletado com sucesso" });
  } catch (error) {
    console.error("Falha ao deletar recurso:", error);
    return NextResponse.json(
      { error: "Falha ao deletar recurso" },
      { status: 500 }
    );
  }
}
