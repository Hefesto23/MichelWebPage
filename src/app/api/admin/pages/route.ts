// src/app/api/admin/pages/route.ts
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// GET - Listar todas as páginas dinâmicas
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const pages = await prisma.dynamicPage.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    console.error("Erro ao buscar páginas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar páginas" },
      { status: 500 }
    );
  }
}

// POST - Criar nova página
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const { slug, title, bannerImage, content, isActive } = body;

    // Validação
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: "Slug, título e conteúdo são obrigatórios" },
        { status: 400 }
      );
    }

    // Validar slug (apenas letras, números e hífens)
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { error: "Slug deve conter apenas letras minúsculas, números e hífens" },
        { status: 400 }
      );
    }

    // Verificar se slug já existe
    const existingPage = await prisma.dynamicPage.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Já existe uma página com este slug" },
        { status: 400 }
      );
    }

    const page = await prisma.dynamicPage.create({
      data: {
        slug,
        title,
        bannerImage: bannerImage || null,
        content,
        isActive: isActive ?? true,
      },
    });

    // Revalidar cache
    revalidateTag("dynamic-pages");
    revalidateTag(`page-${slug}`);

    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar página:", error);
    return NextResponse.json(
      { error: "Erro ao criar página" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar página
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const { id, slug, title, bannerImage, content, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID da página é obrigatório" },
        { status: 400 }
      );
    }

    // Verificar se página existe
    const existingPage = await prisma.dynamicPage.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    // Se mudou o slug, verificar se novo slug já existe
    if (slug && slug !== existingPage.slug) {
      const slugExists = await prisma.dynamicPage.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Já existe uma página com este slug" },
          { status: 400 }
        );
      }
    }

    const page = await prisma.dynamicPage.update({
      where: { id: Number(id) },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(bannerImage !== undefined && { bannerImage: bannerImage || null }),
        ...(content && { content }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    // Revalidar cache
    revalidateTag("dynamic-pages");
    revalidateTag(`page-${existingPage.slug}`);
    if (slug && slug !== existingPage.slug) {
      revalidateTag(`page-${slug}`);
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    console.error("Erro ao atualizar página:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar página" },
      { status: 500 }
    );
  }
}

// DELETE - Deletar página
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID da página é obrigatório" },
        { status: 400 }
      );
    }

    const existingPage = await prisma.dynamicPage.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: "Página não encontrada" },
        { status: 404 }
      );
    }

    await prisma.dynamicPage.delete({
      where: { id: Number(id) },
    });

    // Revalidar cache
    revalidateTag("dynamic-pages");
    revalidateTag(`page-${existingPage.slug}`);

    return NextResponse.json({ success: true, message: "Página deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar página:", error);
    return NextResponse.json(
      { error: "Erro ao deletar página" },
      { status: 500 }
    );
  }
}
