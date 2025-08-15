/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/admin/upload/route.ts

import { verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CloudinaryUploadService } from "@/lib/upload-cloudinary";
import { NextRequest, NextResponse } from "next/server";

const uploadService = new CloudinaryUploadService();

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const alt = formData.get("alt") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado" },
        { status: 400 }
      );
    }

    // Upload e otimização
    const uploadResult = await uploadService.uploadImage(file);

    // Salvar no banco
    const upload = await prisma.upload.create({
      data: {
        filename: uploadResult.filename,
        originalName: uploadResult.originalName,
        path: uploadResult.path,
        mimeType: uploadResult.mimeType,
        size: uploadResult.size,
        width: uploadResult.width,
        height: uploadResult.height,
        category: category || null,
        alt: alt || null,
      },
    });

    return NextResponse.json({
      success: true,
      upload: {
        id: upload.id,
        ...uploadResult,
        url: uploadResult.url,
      },
    });
  } catch (error: any) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = { isActive: true };
    if (category) where.category = category;

    const uploads = await prisma.upload.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(uploads);
  } catch (error) {
    console.error("Erro ao buscar uploads:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // Buscar upload no banco
    const upload = await prisma.upload.findUnique({
      where: { id: parseInt(id) },
    });

    if (!upload) {
      return NextResponse.json(
        { error: "Upload não encontrado" },
        { status: 404 }
      );
    }

    // Deletar arquivo físico
    await uploadService.deleteImage(upload.path);

    // Marcar como inativo no banco (soft delete)
    await prisma.upload.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar upload:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
