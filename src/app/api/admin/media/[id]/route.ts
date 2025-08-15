// src/app/api/admin/media/[id]/route.ts
import { withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { CloudinaryUploadService } from "@/lib/upload-cloudinary";
import { NextRequest } from "next/server";

const uploadService = new CloudinaryUploadService();

// DELETE - Deletar arquivo específico
export const DELETE = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split("/").pop() || "0");

    if (!id) {
      return Response.json(
        { error: "ID do arquivo é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar arquivo no banco
    const file = await prisma.upload.findUnique({
      where: { id },
    });

    if (!file) {
      return Response.json(
        { error: "Arquivo não encontrado" },
        { status: 404 }
      );
    }

    // Deletar do Cloudinary
    try {
      await uploadService.deleteImage(file.path);
      console.log(`✅ Arquivo deletado do Cloudinary: ${file.path}`);
    } catch (error) {
      console.error("❌ Erro ao deletar do Cloudinary:", error);
      // Continua mesmo se não conseguir deletar do Cloudinary
    }

    // Marcar como inativo no banco (soft delete)
    await prisma.upload.update({
      where: { id },
      data: { isActive: false },
    });

    return Response.json({
      message: "Arquivo deletado com sucesso",
      fileId: id,
    });
  } catch (error) {
    console.error("Erro ao deletar arquivo:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
});

// GET - Buscar arquivo específico
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const id = parseInt(url.pathname.split("/").pop() || "0");

    if (!id) {
      return Response.json(
        { error: "ID do arquivo é obrigatório" },
        { status: 400 }
      );
    }

    const file = await prisma.upload.findUnique({
      where: { 
        id,
        isActive: true,
      },
    });

    if (!file) {
      return Response.json(
        { error: "Arquivo não encontrado" },
        { status: 404 }
      );
    }

    // URL já está completa no path (Cloudinary)
    const fileWithUrl = {
      ...file,
      url: file.path,
    };

    return Response.json(fileWithUrl);
  } catch (error) {
    console.error("Erro ao buscar arquivo:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
});