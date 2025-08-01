// src/app/api/admin/content/route.ts

import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const section = searchParams.get("section");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isActive: true };
    if (page) where.page = page;
    if (section) where.section = section;

    const content = await prisma.content.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { page, section, key, type, value, metadata } = body;

    // Validar dados
    if (!page || !section || !key || !type || value === undefined) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // Procurar conteúdo existente
    const existingContent = await prisma.content.findFirst({
      where: {
        page,
        section,
        key,
      },
    });

    let content;

    if (existingContent) {
      // Atualizar conteúdo existente
      content = await prisma.content.update({
        where: { id: existingContent.id },
        data: {
          type,
          value,
          metadata: metadata || undefined,
          updatedAt: new Date(),
        },
      });
    } else {
      // Criar novo conteúdo
      content = await prisma.content.create({
        data: {
          page,
          section,
          key,
          type,
          value,
          metadata: metadata || undefined,
        },
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error("Erro ao salvar conteúdo:", error);
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

    // Soft delete (marcar como inativo)
    const content = await prisma.content.update({
      where: { id: parseInt(id) },
      data: { isActive: false },
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error("Erro ao deletar conteúdo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
