import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { db } from "@/lib/db"
import { v4 as uuidv4 } from "uuid"
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

    const uniqueId = uuidv4()
    const fileName = `${uniqueId}-${file.name.replace(/\s+/g, "_")}`

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    const fileUrl = `/uploads/${fileName}`

    const resource = await db.studyResource.create({
      data: {
        name,
        description,
        fileUrl,
        fileKey: uniqueId,
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