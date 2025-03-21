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
    const subjectId = searchParams.get("subjectId");

    const whereClause = {
      userId: session.user.id,
      ...(subjectId ? { subjectId } : {}),
    };

    const resources = await db.studyResource.findMany({
      where: whereClause,
      include: {
        subject: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
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
    const resource = await db.studyResource.create({
      data: {
        name: data.name,
        description: data.description,
        fileUrl: data.fileUrl,
        fileKey: data.fileKey,
        fileType: data.fileType,
        subjectId: data.subjectId,
        userId: session.user.id,
      },
      include: {
        subject: true,
      },
    });
    return NextResponse.json(resource);
  } catch (error) {
    console.error("Failed to create resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
