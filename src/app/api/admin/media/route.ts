// src/app/api/admin/media/route.ts
import { withAuth } from "@/lib/api-helpers";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

// GET - Listar todos os arquivos de mídia
export const GET = withAuth(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Construir filtros
    const where: { isActive: boolean; category?: string } = {
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = category;
    }

    // Buscar arquivos
    const [files, total] = await Promise.all([
      prisma.upload.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.upload.count({ where }),
    ]);

    // Mapear para incluir URL completa (agora só Cloudinary)
    const filesWithUrl = files.map(file => ({
      ...file,
      url: file.path, // file.path já contém a URL completa do Cloudinary
    }));

    return Response.json({
      files: filesWithUrl,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar arquivos:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
});