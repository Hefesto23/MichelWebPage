// src/app/api/admin/content/about/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
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

const prisma = new PrismaClient();

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
      return NextResponse.json({ 
        success: true, 
        content: { 
          about: DEFAULT_ABOUT_CONTENT 
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
        // Para redes sociais, organizar por networkId
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
    });

    // Merge com valores padrão para garantir que todos os campos existam
    const aboutContent = {
      ...DEFAULT_ABOUT_CONTENT,
      ...organizedContent.about
    };

    // Processar redes sociais
    if (Object.keys(organizedContent.social).length > 1) { // Mais de 1 porque sempre terá pelo menos {}
      const socialMedia = {
        ...DEFAULT_ABOUT_CONTENT.socialMedia,
        title: (organizedContent.social.title as string) || DEFAULT_ABOUT_CONTENT.socialMedia.title,
        description: (organizedContent.social.description as string) || DEFAULT_ABOUT_CONTENT.socialMedia.description,
        networks: DEFAULT_ABOUT_CONTENT.socialMedia.networks.map(defaultNetwork => {
          const customNetwork = organizedContent.social[defaultNetwork.id] as NetworkData;
          if (customNetwork && typeof customNetwork === 'object') {
            return {
              ...defaultNetwork,
              enabled: customNetwork.enabled ?? defaultNetwork.enabled,
              url: customNetwork.url ?? defaultNetwork.url
            };
          }
          return defaultNetwork;
        })
      };
      
      aboutContent.socialMedia = socialMedia;
    }

    console.log("✅ API: Conteúdo organizado e retornado");
    return NextResponse.json({ 
      success: true, 
      content: { 
        about: aboutContent 
      } 
    });

  } catch (error) {
    console.error("❌ API: Erro ao buscar conteúdo da página about:", error);
    
    return NextResponse.json({ 
      success: false, 
      error: "Erro interno do servidor",
      content: { 
        about: DEFAULT_ABOUT_CONTENT 
      } 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    console.log("🔄 API: Salvando conteúdo da página About...");
    
    const { content } = await request.json();
    console.log("📥 API: Dados recebidos:", JSON.stringify(content, null, 2));

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

export async function DELETE() {
  try {
    console.log("🔄 API: Resetando conteúdo da página About...");

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