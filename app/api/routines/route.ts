import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

const routineSchema = z.object({
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

const routinesSchema = z.array(routineSchema);

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const routines = await db.routineItem.findMany({
      where: { userId: session.user.id }, // Filtra pelo ID do usuário autenticado
      orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }],
    });

    return NextResponse.json(routines);
  } catch (error) {
    console.error("Falha ao buscar itens das rotinas:", error);
    return NextResponse.json(
      { error: "Falha ao buscar itens das rotinas" },
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

    const userId = session.user.id;
    const data = await request.json();

    // Validar rotina única ou conjunto de rotinas
    const routines = Array.isArray(data) ? data : [data];
    const validatedData = routinesSchema.parse(routines);

    // Usando uma transação para garantir que todas as rotinas sejam criadas ou nenhuma seja criada
    const createdRoutines = await db.$transaction(
      validatedData.map((routine) =>
        db.routineItem.create({
          data: {
            title: routine.title.trim(),
            dayOfWeek: routine.dayOfWeek,
            time: routine.time,
            completed: routine.completed,
            userId: userId, // Agora o userId está garantido como string
          },
        })
      )
    );

    return NextResponse.json(createdRoutines);
  } catch (error) {
    console.error("Falha ao criar itens de rotinas:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Dados inválidos para o item da rotina",
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
        error: "Ocorreu um erro ao criar itens da rotina",
        details: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}
