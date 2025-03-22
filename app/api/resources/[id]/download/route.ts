import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/auth"

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const url = new URL(request.url);
    const resourceId = url.pathname.split("/")[3];

    if (!resourceId) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const resource = await db.studyResource.findUnique({
      where: {
        id: resourceId,
        userId: session.user.id,
      },
    });

    if (!resource) {
      return NextResponse.json({ error: "Recurso não encontrado" }, { status: 404 });
    }

    // Cria um blob com o conteúdo do arquivo
    const blob = new Blob([resource.fileContent], { type: getMimeType(resource.fileType) });

    // Retorna o arquivo como resposta
    return new NextResponse(blob, {
      headers: {
        "Content-Type": getMimeType(resource.fileType),
        "Content-Disposition": `attachment; filename="${resource.name}.${resource.fileType}"`,
      },
    });
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    return NextResponse.json({ error: "Falha ao baixar arquivo" }, { status: 500 });
  }
}

function getMimeType(fileType: string): string {
  const mimeTypes: { [key: string]: string } = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    zip: "application/zip",
    rar: "application/x-rar-compressed",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  };

  return mimeTypes[fileType.toLowerCase()] || "application/octet-stream";
} 