// src/app/api/admin/content/home/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";
import {
  DEFAULT_HERO_CONTENT,
  DEFAULT_WELCOME_CONTENT,
  DEFAULT_SERVICES_CONTENT,
  DEFAULT_CLINIC_CONTENT
} from '@/utils/default-content';

export async function GET() {
  try {
    console.log("🔄 API: Buscando conteúdo da página Home...");

    // Buscar todos os conteúdos da página home
    const contentItems = await prisma.content.findMany({
      where: {
        page: "home",
        isActive: true
      },
      orderBy: { updatedAt: "desc" }
    });

    console.log(`📥 API: ${contentItems.length} itens encontrados para a página home`);

    if (contentItems.length === 0) {
      console.log("⚠️  API: Nenhum conteúdo encontrado, usando padrão");
      return NextResponse.json({
        content: {
          hero: DEFAULT_HERO_CONTENT,
          welcome: DEFAULT_WELCOME_CONTENT,
          services: DEFAULT_SERVICES_CONTENT,
          clinic: DEFAULT_CLINIC_CONTENT
        }
      });
    }

    // Organizar conteúdo por seção
    const organizedContent: Record<string, any> = {
      hero: {},
      welcome: {},
      services: {},
      clinic: {}
    };

    // Processar cada item de conteúdo
    contentItems.forEach(item => {
      const { section, key, value } = item;

      if (organizedContent[section]) {
        // Para campos JSON (como cards, images), fazer parse
        if (key === 'cards' || key === 'images') {
          try {
            organizedContent[section][key] = JSON.parse(value);
          } catch {
            organizedContent[section][key] = value;
          }
        } else {
          organizedContent[section][key] = value;
        }
      }
    });

    // Merge com valores padrão
    const finalContent = {
      hero: { ...DEFAULT_HERO_CONTENT, ...organizedContent.hero },
      welcome: { ...DEFAULT_WELCOME_CONTENT, ...organizedContent.welcome },
      services: { ...DEFAULT_SERVICES_CONTENT, ...organizedContent.services },
      clinic: { ...DEFAULT_CLINIC_CONTENT, ...organizedContent.clinic }
    };

    console.log("✅ API: Conteúdo organizado e retornado");
    return NextResponse.json({
      content: finalContent
    });

  } catch (error) {
    console.error("❌ API: Erro ao buscar conteúdo da página home:", error);

    return NextResponse.json({
      error: "Erro interno do servidor",
      content: {
        hero: DEFAULT_HERO_CONTENT,
        welcome: DEFAULT_WELCOME_CONTENT,
        services: DEFAULT_SERVICES_CONTENT,
        clinic: DEFAULT_CLINIC_CONTENT
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 API: POST request received for home content");

    const authHeader = request.headers.get("authorization");
    console.log("🔑 API: Auth header present:", authHeader ? 'Sim' : 'Não');

    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      console.log("❌ API: Token inválido ou ausente");
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("✅ API: Autenticação válida, payload:", payload);
    console.log("🔄 API: Salvando conteúdo da página Home...");

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

    // Processar cada seção
    ['hero', 'welcome', 'services', 'clinic'].forEach(sectionName => {
      if (content[sectionName]) {
        Object.entries(content[sectionName]).forEach(([key, value]) => {
          // Para arrays/objects (cards, images), salvar como JSON
          const stringValue = (typeof value === 'object')
            ? JSON.stringify(value)
            : String(value);

          itemsToSave.push({
            page: "home",
            section: sectionName,
            key,
            value: stringValue,
            type: typeof value === 'object' ? 'json' : 'text',
            isActive: true
          });
        });
      }
    });

    console.log(`📝 API: Preparando ${itemsToSave.length} itens para salvar`);

    // Deletar todos os registros existentes (hard delete)
    await prisma.content.deleteMany({
      where: { page: "home" }
    });

    // Criar novos registros
    if (itemsToSave.length > 0) {
      await prisma.content.createMany({
        data: itemsToSave
      });
    }

    // Revalidar cache das seções da home
    try {
      revalidateTag('hero-content');
      revalidateTag('welcome-content');
      revalidateTag('services-content');
      revalidateTag('clinic-content');
      console.log("🔄 API: Cache revalidado com sucesso");
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
    const authHeader = request.headers.get("authorization");
    const payload = validateAuthHeader(authHeader);

    if (!payload) {
      return NextResponse.json(
        { error: "Token inválido" },
        { status: 401 }
      );
    }

    console.log("🔄 API: Resetando conteúdo da página Home...");

    // Deletar todos os registros desta página (hard delete)
    await prisma.content.deleteMany({
      where: { page: "home" }
    });

    // Revalidar cache das seções da home
    try {
      revalidateTag('hero-content');
      revalidateTag('welcome-content');
      revalidateTag('services-content');
      revalidateTag('clinic-content');
      console.log("🔄 API: Cache revalidado com sucesso");
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