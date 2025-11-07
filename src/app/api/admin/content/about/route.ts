// src/app/api/admin/content/about/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from "next/cache";
import { validateAuthHeader } from "@/lib/auth";
import { DEFAULT_ABOUT_CONTENT } from '@/utils/default-content';

interface NetworkData {
  enabled?: boolean;
  url?: string;
  [key: string]: unknown;
}

interface OrganizedContent {
  about: Record<string, string>;
  social: Record<string, string | NetworkData>;
}

export async function GET() {
  try {
    console.log("🔄 API: Buscando conteúdo da página About...");

    // Buscar todos os conteúdos da página about
    const contentItems = await prisma.content.findMany({
      where: { 
        page: "about",
        isActive: true 
      },
      orderBy: { updatedAt: "desc" }
    });

    console.log(`📥 API: ${contentItems.length} itens encontrados para a página about`);

    if (contentItems.length === 0) {
      console.log("⚠️  API: Nenhum conteúdo encontrado, usando padrão");
      const { socialMedia, ...aboutData } = DEFAULT_ABOUT_CONTENT;
      return NextResponse.json({
        success: true,
        content: {
          about: aboutData,
          social: socialMedia
        }
      });
    }

    // Organizar conteúdo por seção
    const organizedContent: OrganizedContent = {
      about: {},
      social: {}
    };

    // Processar cada item de conteúdo
    contentItems.forEach(item => {
      const { section, key, value } = item;

      if (section === "about") {
        organizedContent.about[key] = value;
      } else if (section === "social") {
        // Verificar se é o campo networks (JSON array completo)
        if (key === "networks") {
          try {
            organizedContent.social.networks = JSON.parse(value);
          } catch {
            console.warn("⚠️ API: Erro ao fazer parse de networks");
          }
        } else {
          // Para redes sociais individuais (campos deprecated)
          const networkMatch = key.match(/network(.+)_(.+)/);
          if (networkMatch) {
            const networkId = networkMatch[1];
            const field = networkMatch[2];

            if (!organizedContent.social[networkId]) {
              organizedContent.social[networkId] = {} as NetworkData;
            }

            const networkData = organizedContent.social[networkId] as NetworkData;

            // Converter string para boolean para o campo enabled
            if (field === "enabled") {
              networkData.enabled = value === "true";
            } else if (field === "url") {
              networkData.url = value;
            } else {
              networkData[field] = value;
            }
          } else {
            // Campos diretos da seção social (title, description)
            organizedContent.social[key] = value;
          }
        }
      }
    });

    // Merge com valores padrão para garantir que todos os campos existam
    const aboutContent = {
      ...DEFAULT_ABOUT_CONTENT,
      ...organizedContent.about
    };

    // Processar redes sociais
    if (Object.keys(organizedContent.social).length > 0) {
      console.log("🌐 API GET: organizedContent.social:", JSON.stringify(organizedContent.social, null, 2));

      const socialData: any = {
        ...DEFAULT_ABOUT_CONTENT.socialMedia,
        title: (organizedContent.social.title as string) || DEFAULT_ABOUT_CONTENT.socialMedia.title,
        description: (organizedContent.social.description as string) || DEFAULT_ABOUT_CONTENT.socialMedia.description,
      };

      // Priorizar campo 'networks' (JSON array) se existir
      if (organizedContent.social.networks && Array.isArray(organizedContent.social.networks)) {
        console.log("✅ API GET: Usando campo networks do banco (JSON array)");
        socialData.networks = organizedContent.social.networks;
      } else {
        console.log("🔧 API GET: Montando networks a partir de campos individuais");
        // Fallback: montar networks a partir dos campos individuais (deprecated)
        socialData.networks = DEFAULT_ABOUT_CONTENT.socialMedia.networks.map(defaultNetwork => {
          const customNetwork = organizedContent.social[defaultNetwork.id] as NetworkData;
          console.log(`  🔍 Verificando ${defaultNetwork.id}:`, customNetwork);
          if (customNetwork && typeof customNetwork === 'object') {
            const mergedNetwork = {
              ...defaultNetwork,
              enabled: customNetwork.enabled ?? defaultNetwork.enabled,
              url: customNetwork.url ?? defaultNetwork.url,
              order: customNetwork.order ? parseInt(String(customNetwork.order)) : defaultNetwork.order
            };
            console.log(`  ✅ Network ${defaultNetwork.id} merge:`, mergedNetwork);
            return mergedNetwork;
          }
          console.log(`  ⚠️ Network ${defaultNetwork.id}: usando default`);
          return defaultNetwork;
        });
      }

      console.log("🌐 API GET: socialData.networks final:", JSON.stringify(socialData.networks, null, 2));
      aboutContent.socialMedia = socialData;
    }

    console.log("✅ API: Conteúdo organizado e retornado");

    // Separar aboutContent.socialMedia para ficar compatível com PageEditor
    const { socialMedia, ...aboutData } = aboutContent;

    return NextResponse.json({
      success: true,
      content: {
        about: aboutData,
        social: socialMedia
      }
    });

  } catch (error) {
    console.error("❌ API: Erro ao buscar conteúdo da página about:", error);

    const { socialMedia, ...aboutData } = DEFAULT_ABOUT_CONTENT;
    return NextResponse.json({
      success: false,
      error: "Erro interno do servidor",
      content: {
        about: aboutData,
        social: socialMedia
      }
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    console.log("📡 API: POST request received for about content");

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
    console.log("🔄 API: Salvando conteúdo da página About...");

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

    // Processar seção about
    if (content.about) {
      Object.entries(content.about).forEach(([key, value]) => {
        itemsToSave.push({
          page: "about",
          section: "about", 
          key,
          value: String(value),
          type: "text",
          isActive: true
        });
      });
    }

    // Processar seção social
    if (content.social) {
      // Campos gerais da seção social
      const { title, description, networks, ...otherFields } = content.social;

      if (title) {
        itemsToSave.push({
          page: "about",
          section: "social",
          key: "title",
          value: String(title),
          type: "text",
          isActive: true
        });
      }

      if (description) {
        itemsToSave.push({
          page: "about",
          section: "social",
          key: "description",
          value: String(description),
          type: "text",
          isActive: true
        });
      }

      // Processar networks se existir
      if (networks && Array.isArray(networks)) {
        // Salvar array completo de networks como JSON
        itemsToSave.push({
          page: "about",
          section: "social",
          key: "networks",
          value: JSON.stringify(networks),
          type: "json",
          isActive: true
        });

        // DEPRECATED: Manter campos individuais para compatibilidade com API GET antiga
        networks.forEach((network: { id: string; enabled: boolean; url?: string; order?: number }) => {
          // Salvar enabled
          itemsToSave.push({
            page: "about",
            section: "social",
            key: `network${network.id}_enabled`,
            value: String(network.enabled),
            type: "boolean",
            isActive: true
          });

          // Salvar url
          if (network.url) {
            itemsToSave.push({
              page: "about",
              section: "social",
              key: `network${network.id}_url`,
              value: String(network.url),
              type: "text",
              isActive: true
            });
          }

          // Salvar order
          if (network.order !== undefined) {
            itemsToSave.push({
              page: "about",
              section: "social",
              key: `network${network.id}_order`,
              value: String(network.order),
              type: "number",
              isActive: true
            });
          }
        });
      }

      // Processar outros campos da seção social
      Object.entries(otherFields).forEach(([key, value]) => {
        itemsToSave.push({
          page: "about",
          section: "social",
          key,
          value: String(value),
          type: "text",
          isActive: true
        });
      });
    }

    console.log(`📝 API: Preparando ${itemsToSave.length} itens para salvar`);

    // Iniciar transação para garantir consistência
    await prisma.$transaction(async (tx) => {
      // Desativar todos os registros existentes desta página
      await tx.content.updateMany({
        where: { 
          page: "about",
          isActive: true 
        },
        data: { 
          isActive: false 
        }
      });

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
    });

    // Revalidar cache da página about
    try {
      revalidateTag('about-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API: Conteúdo salvo com sucesso");
    return NextResponse.json({
      success: true,
      message: "Conteúdo salvo com sucesso"
    });

  } catch (error) {
    console.error("❌ API: Erro ao salvar conteúdo:", error);
    return NextResponse.json({ 
      success: false,
      error: "Erro interno do servidor" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    console.log("📡 API: DELETE request received for about content");

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
      console.log(`🔄 API: Resetando seção "${section}" da página About...`);

      // Desativar apenas a seção específica
      await prisma.content.updateMany({
        where: {
          page: "about",
          section: section,
          isActive: true
        },
        data: {
          isActive: false
        }
      });

      console.log(`✅ API: Seção "${section}" resetada com sucesso`);
      return NextResponse.json({
        success: true,
        message: `Seção "${section}" resetada com sucesso`
      });
    } else {
      console.log("🔄 API: Resetando TODA a página About...");

      // Desativar todos os registros desta página
      await prisma.content.updateMany({
        where: {
          page: "about",
          isActive: true
        },
        data: {
          isActive: false
        }
      });

      console.log("✅ API: Página About resetada com sucesso");
    }

    // Revalidar cache da página about
    try {
      revalidateTag('about-content');
      console.log("🔄 API: Cache revalidado com sucesso");
    } catch (revalidateError) {
      console.warn("⚠️ API: Erro ao revalidar cache:", revalidateError);
      // Não falhar a operação por causa do cache
    }

    console.log("✅ API: Conteúdo resetado com sucesso");
    return NextResponse.json({
      success: true,
      message: "Conteúdo resetado com sucesso"
    });

  } catch (error) {
    console.error("❌ API: Erro ao resetar conteúdo:", error);
    return NextResponse.json({ 
      success: false,
      error: "Erro interno do servidor" 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}