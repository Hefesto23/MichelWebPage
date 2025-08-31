// src/app/api/admin/content/[page]/route.ts
import { validateAuthHeader } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export const dynamic = 'force-dynamic';

// GET - Buscar conteúdo salvo para uma página (público para o site)
export async function GET(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    // GET é público para permitir que o site carregue o conteúdo
    // Não precisa de autenticação para buscar

    const { page } = params;

    // Buscar conteúdos JSON da página (approach otimizado)
    const contents = await prisma.content.findMany({
      where: {
        page: page,
        key: "content", // Buscar apenas registros com key="content"
        type: "json",
        isActive: true,
      },
    });

    if (contents.length === 0) {
      return NextResponse.json(
        { content: null, message: "Conteúdo não encontrado, usando padrões" },
        { status: 200 }
      );
    }

    // Organizar conteúdos por seção (cada item.value já é o JSON completo da seção)
    const organizedContent: Record<string, Record<string, string>> = {};
    contents.forEach(item => {
      try {
        organizedContent[item.section] = JSON.parse(item.value);
      } catch (error) {
        console.error(`Erro ao parsear JSON da seção ${item.section}:`, error);
        // Fallback: manter estrutura vazia para a seção
        organizedContent[item.section] = {};
      }
    });

    return NextResponse.json(
      { content: organizedContent },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao buscar conteúdo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Salvar conteúdo de uma página
export async function POST(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    const { page } = params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Conteúdo é obrigatório" },
        { status: 400 }
      );
    }

    // APPROACH OTIMIZADO: Um único registro por seção com JSON
    const savedItems = [];
    
    for (const section in content) {
      const sectionContent = content[section];
      
      // Salvar toda a seção como um único registro JSON
      const savedItem = await prisma.content.upsert({
        where: {
          page_section_key: {
            page: page,
            section: section,
            key: "content", // Chave única para toda a seção
          },
        },
        update: {
          value: JSON.stringify(sectionContent),
          type: "json",
          updatedAt: new Date(),
        },
        create: {
          page: page,
          section: section,
          key: "content",
          type: "json",
          value: JSON.stringify(sectionContent),
        },
      });
      
      savedItems.push(savedItem);
    }

    // Revalidar cache específico baseado na página
    if (page === 'home') {
      revalidateTag('hero-content');
      revalidateTag('welcome-content');
      revalidateTag('services-content');
      revalidateTag('clinic-content');
    } else if (page === 'divisorias') {
      revalidateTag('divisorias-content');
    } else if (page === 'about') {
      revalidateTag('about-content');
    } else if (page === 'avaliacoes') {
      revalidateTag('avaliacoes-content');
    } else if (page === 'terapias') {
      revalidateTag('terapias-content');
    }

    return NextResponse.json(
      { 
        message: "Conteúdo salvo com sucesso",
        records: savedItems.length 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao salvar conteúdo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Resetar conteúdo para padrões
export async function DELETE(
  request: NextRequest,
  { params }: { params: { page: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    const { page } = params;

    // Deletar todos os registros personalizados da página
    const deletedItems = await prisma.content.deleteMany({
      where: {
        page: page,
        key: "content",
        type: "json",
      },
    });

    return NextResponse.json(
      { 
        message: "Conteúdo resetado para padrões com sucesso",
        deleted: deletedItems.count 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erro ao resetar conteúdo:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}