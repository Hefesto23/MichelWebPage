// src/app/api/admin/media/[id]/route.ts
import { withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { unlink } from "fs/promises";
import { NextRequest } from "next/server";
import path from "path";

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

    // Tentar deletar arquivo físico
    try {
      const filePath = path.join(process.cwd(), "public", "uploads", file.filename);
      await unlink(filePath);
    } catch (error) {
      console.error("Erro ao deletar arquivo físico:", error);
      // Continua mesmo se não conseguir deletar o arquivo físico
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

    // Adicionar URL completa
    const fileWithUrl = {
      ...file,
      url: `/uploads/${file.filename}`,
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