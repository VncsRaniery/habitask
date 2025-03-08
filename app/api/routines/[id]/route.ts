import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { auth } from "@/auth";

const routineSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Este título é muito longo"),
  dayOfWeek: z.number().min(0).max(6),
  time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de data inválido"),
  completed: z.boolean(),
});

export async function PUT(request: Request) {
  try {
    const session = await auth();
        if (!session?.user) {
          return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
        }

    const data = await request.json();

    const validatedData = routineSchema.parse(data);

    const existingRoutine = await db.routineItem.findUnique({
      where: { id: validatedData.id },
    });

    if (!existingRoutine) {
      return NextResponse.json(
        { error: "Item da rotina não encontrado" },
        { status: 404 }
      );
    }

    const routine = await db.routineItem.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title.trim(),
        dayOfWeek: validatedData.dayOfWeek,
        time: validatedData.time,
        completed: validatedData.completed,
      },
    });

    return NextResponse.json(routine);
  } catch (error) {
    console.error("Falha ao atualizar item da rotina:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados do item da rotina são inválidos",
          details: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao atualizar a rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const routineId = url.pathname.split("/").pop();

    if (!routineId) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    await db.routineItem.delete({
      where: { id: routineId },
    });
    return NextResponse.json({
      message: "Item da rotina excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir item da rotina:", error);
    return NextResponse.json(
      { error: "Falha ao excluir item da rotina" },
      { status: 500 }
    );
  }
}