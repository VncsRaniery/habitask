import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const subjectId = formData.get("subjectId") as string

    if (!file || !name || !subjectId) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase() || ""
    const allowedExtensions = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "gif",
      "zip",
      "rar",
      "doc",
      "docx",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
    ]

    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json({ error: "Tipo de arquivo não suportado" }, { status: 400 })
    }

    // Lê o arquivo como um array de bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const resource = await db.studyResource.create({
      data: {
        name,
        description,
        fileContent: buffer,
        fileType: fileExtension,
        subjectId,
        userId: session.user.id
      },
      include: {
        subject: true,
      },
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error("Erro ao carregar arquivo:", error)
    return NextResponse.json({ error: "Falha ao carregar arquivo" }, { status: 500 })
  }
}