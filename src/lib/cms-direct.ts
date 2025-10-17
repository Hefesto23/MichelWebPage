// src/lib/cms-direct.ts
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * ✅ SOLUÇÃO CORRETA: Acesso direto ao Prisma em Server Components
 *
 * Benefícios:
 * - ✅ Funciona durante SSG/build (não precisa de HTTP)
 * - ✅ Cache infinito com revalidate: false
 * - ✅ Invalidação instantânea via revalidateTag nos admin APIs
 * - ✅ Sem overhead de HTTP fetch
 * - ✅ Type-safe com Prisma
 */

/**
 * Helper genérico para buscar conteúdo do CMS diretamente do banco
 *
 * @param page - Nome da página (ex: "home", "terapias", "avaliacoes")
 * @param section - Nome da seção (opcional, ex: "hero", "welcome")
 * @param cacheTag - Tag para invalidação de cache
 * @returns Conteúdo organizado por seção e chave
 */
async function fetchContentFromDatabase(
  page: string,
  section?: string
): Promise<Record<string, any>> {
  try {
    console.log(`🔄 CMS Direct: Buscando ${page}${section ? `/${section}` : ''} do banco...`);

    const whereClause: any = {
      page,
      isActive: true
    };

    if (section) {
      whereClause.section = section;
    }

    const contentItems = await prisma.content.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" }
    });

    console.log(`📥 CMS Direct: ${contentItems.length} itens encontrados`);

    if (contentItems.length === 0) {
      console.log("⚠️  CMS Direct: Nenhum conteúdo encontrado");
      return {};
    }

    // Organizar conteúdo por seção (se não especificada) ou diretamente
    const organizedContent: Record<string, any> = {};

    contentItems.forEach(item => {
      const { section: itemSection, key, value } = item;

      // Se não especificamos seção, organizar por seção
      if (!section) {
        if (!organizedContent[itemSection]) {
          organizedContent[itemSection] = {};
        }

        // Parse JSON para campos especiais (arrays e objetos)
        if (key === 'cards' || key === 'images' || key === 'networks') {
          try {
            const parsedValue = JSON.parse(value);
            organizedContent[itemSection][key] = parsedValue;
            console.log(`🔧 CMS Direct: Parsed ${key} em ${itemSection}:`, parsedValue);
          } catch (e) {
            console.warn(`⚠️ CMS Direct: Erro ao fazer parse de ${key}:`, e);
            organizedContent[itemSection][key] = value;
          }
        } else {
          organizedContent[itemSection][key] = value;
        }
      } else {
        // Se especificamos seção, retornar diretamente
        if (key === 'cards' || key === 'images' || key === 'networks') {
          try {
            const parsedValue = JSON.parse(value);
            organizedContent[key] = parsedValue;
            console.log(`🔧 CMS Direct: Parsed ${key}:`, parsedValue);
          } catch (e) {
            console.warn(`⚠️ CMS Direct: Erro ao fazer parse de ${key}:`, e);
            organizedContent[key] = value;
          }
        } else {
          organizedContent[key] = value;
        }
      }
    });

    console.log(`✅ CMS Direct: Conteúdo organizado para ${page}:`, JSON.stringify(organizedContent, null, 2));
    return organizedContent;

  } catch (error) {
    console.error(`❌ CMS Direct: Erro ao buscar ${page}:`, error);
    return {};
  }
}

/**
 * Cria uma função cacheada para buscar conteúdo específico
 *
 * @param page - Nome da página
 * @param section - Nome da seção (opcional)
 * @param cacheTag - Tag para revalidação
 * @returns Função cacheada que retorna conteúdo
 */
export function createCachedContentFetcher<T>(
  page: string,
  section: string | undefined,
  cacheTag: string
) {
  return unstable_cache(
    async (): Promise<T> => {
      const content = await fetchContentFromDatabase(page, section);
      return content as T;
    },
    [cacheTag], // Cache key
    {
      tags: [cacheTag], // Tag para revalidação
      revalidate: 3600 // ISR: regenera a cada 1 hora (revalidateTag ainda tem prioridade)
    }
  );
}

/**
 * Busca conteúdo de múltiplas seções de uma página
 *
 * @param page - Nome da página
 * @param sections - Array de seções para buscar
 * @param cacheTags - Tags de cache correspondentes
 * @param defaultValues - Valores padrão para cada seção
 * @returns Objeto com conteúdo de todas as seções
 */
export async function fetchMultipleSections<T extends Record<string, any>>(
  page: string,
  sections: string[],
  cacheTags: string[],
  defaultValues: T
): Promise<T> {
  const result: any = {};

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const cacheTag = cacheTags[i];
    const defaultValue = defaultValues[section];

    const fetcher = createCachedContentFetcher<Partial<typeof defaultValue>>(page, section, cacheTag);
    const content = await fetcher();

    result[section] = {
      ...(defaultValue || {}),
      ...(content || {})
    };
  }

  return result as T;
}

/**
 * Busca todo o conteúdo de uma página (todas as seções)
 *
 * @param page - Nome da página
 * @param cacheTag - Tag de cache
 * @returns Objeto com todas as seções
 */
export function createPageContentFetcher<T>(page: string, cacheTag: string) {
  return unstable_cache(
    async (): Promise<T> => {
      const content = await fetchContentFromDatabase(page);
      return content as T;
    },
    [cacheTag],
    {
      tags: [cacheTag],
      revalidate: 3600 // ISR: regenera a cada 1 hora (revalidateTag ainda tem prioridade)
    }
  );
}

/**
 * Busca configurações (settings) do banco com cache infinito
 *
 * @returns Settings com cache até revalidateTag('settings-content')
 */
export async function fetchSettingsFromDatabase(): Promise<Record<string, any>> {
  try {
    console.log("🔄 CMS Direct: Buscando settings do banco...");

    const settings = await prisma.settings.findMany();

    // Converter para formato organizado
    const settingsMap: Record<string, any> = {};

    settings.forEach((setting: any) => {
      try {
        settingsMap[setting.key] = JSON.parse(setting.value);
      } catch {
        settingsMap[setting.key] = setting.value;
      }
    });

    console.log(`✅ CMS Direct: ${Object.keys(settingsMap).length} settings encontradas`);
    return settingsMap;

  } catch (error) {
    console.error("❌ CMS Direct: Erro ao buscar settings:", error);
    return {};
  }
}

/**
 * Cria função cacheada para buscar settings
 *
 * @returns Função que retorna settings com cache infinito
 */
export function createSettingsFetcher() {
  return unstable_cache(
    async (): Promise<Record<string, any>> => {
      const settings = await fetchSettingsFromDatabase();
      return settings;
    },
    ['settings-cache'],
    {
      tags: ['settings-content'],
      revalidate: 3600 // ISR: regenera a cada 1 hora (revalidateTag ainda tem prioridade)
    }
  );
}

/**
 * Busca conteúdo da página de Agendamento com cache
 * Usado em Server Components para renderização otimizada
 *
 * @returns Conteúdo de agendamento (título, descrição, cards)
 */
export async function getAgendamentoContent() {
  const fetcher = unstable_cache(
    async () => {
      console.log("🔄 CMS Direct: Buscando agendamento do banco...");

      const content = await prisma.content.findMany({
        where: {
          page: "agendamento",
          isActive: true,
        },
        orderBy: { updatedAt: "desc" },
      });

      console.log(`📥 CMS Direct: ${content.length} itens encontrados`);

      // Processar dados do banco para o formato esperado
      const contentMap: any = { agendamento: {} };
      const cardsData: Record<number, { id: number; title?: string; content?: string; order: number }> = {};

      content.forEach((item: { section: string; key: string; value: string }) => {
        if (item.section === "agendamento") {
          // Check if it's a card field (card_1_title, card_1_content, etc)
          const cardMatch = item.key.match(/card_(\d+)_(title|content)/);
          if (cardMatch) {
            const cardId = parseInt(cardMatch[1]);
            const field = cardMatch[2] as "title" | "content";

            if (!cardsData[cardId]) {
              cardsData[cardId] = { id: cardId, order: cardId };
            }
            cardsData[cardId][field] = item.value;
          } else {
            // Regular fields (title, description)
            contentMap.agendamento[item.key] = item.value;
          }
        }
      });

      // Convert cardsData object to array
      let infoCards = Object.values(cardsData).sort((a, b) => a.order - b.order);

      // ✅ FALLBACK: Se não houver cards no banco, usar cards padrão
      if (infoCards.length === 0) {
        console.log("⚠️  CMS Direct: Nenhum card encontrado no banco, usando conteúdo padrão");
        infoCards = [
          {
            id: 1,
            title: "Preparando-se para sua consulta",
            content: "Para a primeira consulta, recomendo chegar 10 minutos antes do horário marcado. Traga suas dúvidas e expectativas para conversarmos.",
            order: 1
          },
          {
            id: 2,
            title: "Política de Cancelamento",
            content: "Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência. Caso contrário, a sessão será cobrada integralmente.",
            order: 2
          },
          {
            id: 3,
            title: "Consulta Online",
            content: "Para consultas online, utilize um local tranquilo e privado. Verifique sua conexão com a internet antes da sessão.",
            order: 3
          }
        ];
      }

      const result = {
        title: contentMap.agendamento.title || "Agendamento de Consultas",
        description: contentMap.agendamento.description || "Agende sua consulta de forma rápida e segura.",
        infoCards: infoCards.map((card) => ({
          id: card.id,
          title: card.title || "",
          content: card.content || "",
          order: card.order,
        })),
      };

      console.log(`✅ CMS Direct: Conteúdo de agendamento processado (${result.infoCards.length} cards)`);
      return result;
    },
    ["agendamento-content-cache"],
    {
      tags: ["agendamento-content"],
      revalidate: 3600, // ISR: regenera a cada 1 hora
    }
  );

  return fetcher();
}
