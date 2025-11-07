// src/app/api/admin/content/divisorias/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";
import { DEFAULT_DIVISORIAS_CONTENT } from '@/utils/default-content';

export async function GET() {
  try {
    console.log("🔄 API: Buscando conteúdo da página Divisórias...");

    // Buscar todos os conteúdos da página divisorias
    const contentItems = await prisma.content.findMany({
      where: {
        page: "divisorias",
        isActive: true
      },
      orderBy: { updatedAt: "desc" }
    });

    console.log(`📥 API: ${contentItems.length} itens encontrados para a página divisorias`);

    if (contentItems.length === 0) {
      console.log("⚠️  API: Nenhum conteúdo encontrado, usando padrão");
      return NextResponse.json({
        content: {
          divisorias: DEFAULT_DIVISORIAS_CONTENT
        }
      });
    }

    // Organizar conteúdo por seção
    const organizedContent: Record<string, any> = {};

    // Processar cada item de conteúdo
    contentItems.forEach(item => {
      const { section, key, value } = item;

      if (!organizedContent[section]) {
        organizedContent[section] = {};
      }

      organizedContent[section][key] = value;
    });

    // Merge com valores padrão
    const finalContent = {
      ...DEFAULT_DIVISORIAS_CONTENT,
      ...organizedContent
    };

    console.log("✅ API: Conteúdo organizado e retornado");
    return NextResponse.json({
      content: {
        divisorias: finalContent
      }
    });

  } catch (error) {
    console.error("❌ API: Erro ao buscar conteúdo da página divisorias:", error);

    return NextResponse.json({
      error: "Erro interno do servidor",
      content: {
        divisorias: DEFAULT_DIVISORIAS_CONTENT
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 API: POST request received for divisorias content");

    const authHeader = request.headers.get("authorization");
    console.log("🔑 API: Auth header present:", authHeader ? 'Sim' : 'Não');

    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("✅ API: Autenticação válida, payload:", payload);
    console.log("🔄 API: Salvando conteúdo da página Divisórias...");

    const requestBody = await request.json();
    console.log("📥 API: Request body completo:", JSON.stringify(requestBody, null, 2));

    const { content } = requestBody;
    console.log("📥 API: Conteúdo extraído:", JSON.stringify(content, null, 2));

    // Preparar dados para salvar no banco
    const itemsToSave: Array<{
      page: string;
      section: string;
      key: string;
      value: string;
      type: string;
      isActive: boolean;
    }> = [];

    // Processar cada divisória
    if (content.divisorias) {
      Object.entries(content.divisorias).forEach(([sectionKey, sectionValue]) => {
        if (sectionKey === 'maxCharacters') return; // Skip maxCharacters

        if (typeof sectionValue === 'object' && sectionValue !== null) {
          Object.entries(sectionValue as Record<string, any>).forEach(([key, value]) => {
            itemsToSave.push({
              page: "divisorias",
              section: sectionKey,
              key,
              value: String(value),
              type: key === 'backgroundImage' ? 'image' : 'text',
              isActive: true
            });
          });
        }
      });
    }

    console.log(`📝 API: Preparando ${itemsToSave.length} itens para salvar`);

    // Identificar quais seções estão sendo alteradas
    const sectionsBeingUpdated = Array.from(new Set(itemsToSave.map(item => item.section)));
    console.log(`📝 API: Seções sendo atualizadas:`, sectionsBeingUpdated);

    // Iniciar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      // Desativar APENAS os registros das seções sendo alteradas
      if (sectionsBeingUpdated.length > 0) {
        await tx.content.updateMany({
          where: {
            page: "divisorias",
            section: { in: sectionsBeingUpdated },
            isActive: true
          },
          data: {
            isActive: false
          }
        });
        console.log(`🗑️ API: Desativados registros das seções:`, sectionsBeingUpdated);
      }

      // Criar ou atualizar registros usando upsert
      for (const item of itemsToSave) {
        await tx.content.upsert({
          where: {
            page_section_key: {
              page: item.page,
              section: item.section,
              key: item.key
            }
          },
          update: {
            value: item.value,
            type: item.type,
            isActive: item.isActive,
            updatedAt: new Date()
          },
          create: item
        });
      }
      console.log(`✅ API: Upsert concluído para ${itemsToSave.length} itens`);
    });

    // Revalidar cache da página divisorias e de todas as páginas que usam divisórias
    try {
      revalidateTag('divisorias-content');
      // Revalidar todas as páginas que usam divisórias
      revalidateTag('home-content');        // usa divisoria_1, divisoria_2, divisoria_3
      revalidateTag('about-content');       // usa divisoria_4
      revalidateTag('terapias-content');    // usa divisoria_5
      revalidateTag('avaliacoes-content');  // usa divisoria_6
      revalidateTag('contact-content');     // usa divisoria_6
      console.log("🔄 API: Cache de divisórias e páginas relacionadas revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API: Conteúdo salvo com sucesso");
    return NextResponse.json({
      message: "Conteúdo salvo com sucesso"
    });

  } catch (error) {
    console.error("❌ API: Erro ao salvar conteúdo:", error);
    return NextResponse.json({
      error: "Erro interno do servidor"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("📡 API: DELETE request received for divisorias content");

    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    // Verificar se tem query param de seção específica
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      console.log(`🔄 API: Resetando seção "${section}" da página Divisórias...`);

      // Desativar apenas a seção específica
      await prisma.content.updateMany({
        where: {
          page: "divisorias",
          section: section,
          isActive: true
        },
        data: {
          isActive: false
        }
      });

      console.log(`✅ API: Seção "${section}" resetada com sucesso`);
    } else {
      console.log("🔄 API: Resetando TODA a página Divisórias...");

      // Desativar todos os registros desta página
      await prisma.content.updateMany({
        where: {
          page: "divisorias",
          isActive: true
        },
        data: {
          isActive: false
        }
      });

      console.log("✅ API: Página Divisórias resetada com sucesso");
    }

    // Revalidar cache da página divisorias e de todas as páginas que usam divisórias
    try {
      revalidateTag('divisorias-content');
      // Revalidar todas as páginas que usam divisórias
      revalidateTag('home-content');        // usa divisoria_1, divisoria_2, divisoria_3
      revalidateTag('about-content');       // usa divisoria_4
      revalidateTag('terapias-content');    // usa divisoria_5
      revalidateTag('avaliacoes-content');  // usa divisoria_6
      revalidateTag('contact-content');     // usa divisoria_6
      console.log("🔄 API: Cache de divisórias e páginas relacionadas revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API: Conteúdo resetado com sucesso");
    return NextResponse.json({
      message: "Conteúdo resetado com sucesso"
    });

  } catch (error) {
    console.error("❌ API: Erro ao resetar conteúdo:", error);
    return NextResponse.json({
      error: "Erro interno do servidor"
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}