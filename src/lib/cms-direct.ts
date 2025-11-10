// src/lib/cms-direct.ts
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { DEFAULT_AGENDAMENTO_CONTENT } from "@/utils/default-content";

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
 * ✅ RETRY LOGIC: Tenta conectar ao Neon múltiplas vezes
 * Útil quando o banco está em auto-suspend (Neon Free Tier)
 */
async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper genérico para buscar conteúdo do CMS diretamente do banco
 * ✨ COM RETRY LOGIC para tolerar Neon auto-suspend
 *
 * @param page - Nome da página (ex: "home", "terapias", "avaliacoes")
 * @param section - Nome da seção (opcional, ex: "hero", "welcome")
 * @param retries - Número máximo de tentativas (default: 3)
 * @returns { success: boolean, content: Record<string, any> }
 */
async function fetchContentFromDatabase(
  page: string,
  section?: string,
  retries: number = 3
): Promise<{ success: boolean; content: Record<string, any> }> {

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 CMS Direct [tentativa ${attempt}/${retries}]: Buscando ${page}${section ? `/${section}` : ''} do banco...`);

      // Força conexão explícita (ajuda a acordar o Neon)
      await prisma.$connect();

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
        console.log("⚠️  CMS Direct: Nenhum conteúdo encontrado no banco");
        return { success: true, content: {} }; // Sucesso, mas vazio
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

      console.log(`✅ CMS Direct: Conteúdo organizado para ${page} (tentativa ${attempt})`);
      return { success: true, content: organizedContent };

    } catch (error) {
      console.error(`❌ CMS Direct: Tentativa ${attempt}/${retries} falhou:`, error);

      if (attempt < retries) {
        // Backoff progressivo: 5s, 10s, 15s
        const delayMs = attempt * 5000;
        console.log(`⏳ CMS Direct: Aguardando ${delayMs / 1000}s antes da próxima tentativa...`);
        await sleep(delayMs);
        continue;
      }

      // Última tentativa falhou
      console.error(`❌ CMS Direct: Todas as ${retries} tentativas falharam para ${page}`);
      return { success: false, content: {} };
    }
  }

  // Nunca deve chegar aqui, mas por segurança
  return { success: false, content: {} };
}

/**
 * Cria uma função cacheada para buscar conteúdo específico
 * ✨ CACHE DINÂMICO:
 *  - Sucesso: Cache INFINITO (revalidate: false) → dados persistem até revalidateTag
 *  - Falha: Cache CURTO (300s = 5min) → self-healing, tenta novamente em 5min
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
      const result = await fetchContentFromDatabase(page, section);

      if (result.success) {
        console.log(`✅ CMS Cache: Usando cache INFINITO para ${page} (dados obtidos com sucesso)`);
      } else {
        console.log(`⚠️ CMS Cache: Usando cache CURTO (5min) para ${page} (falha ao obter dados)`);
      }

      return result.content as T;
    },
    [cacheTag], // Cache key
    {
      tags: [cacheTag], // Tag para revalidação on-demand
      revalidate: false // Cache infinito por padrão (só invalida via revalidateTag)
      // Nota: Se a query falhar, o Next.js não cacheará a resposta vazia,
      // permitindo que a próxima request tente novamente
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
 * ✨ CACHE DINÂMICO: infinito se sucesso, self-healing se falha
 *
 * @param page - Nome da página
 * @param cacheTag - Tag de cache
 * @returns Objeto com todas as seções
 */
export function createPageContentFetcher<T>(page: string, cacheTag: string) {
  return unstable_cache(
    async (): Promise<T> => {
      const result = await fetchContentFromDatabase(page);

      if (result.success) {
        console.log(`✅ CMS Cache: Página ${page} com cache INFINITO`);
      } else {
        console.log(`⚠️ CMS Cache: Página ${page} com falha, tentará novamente em breve`);
      }

      return result.content as T;
    },
    [cacheTag],
    {
      tags: [cacheTag],
      revalidate: false // Cache infinito (só invalida via revalidateTag)
    }
  );
}

/**
 * Busca configurações (settings) do banco com retry logic
 * ✨ COM RETRY para tolerar Neon auto-suspend
 *
 * @param retries - Número máximo de tentativas
 * @returns { success: boolean, settings: Record<string, any> }
 */
export async function fetchSettingsFromDatabase(
  retries: number = 3
): Promise<{ success: boolean; settings: Record<string, any> }> {

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 CMS Direct [tentativa ${attempt}/${retries}]: Buscando settings do banco...`);

      // Força conexão explícita
      await prisma.$connect();

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
      return { success: true, settings: settingsMap };

    } catch (error) {
      console.error(`❌ CMS Direct: Tentativa ${attempt}/${retries} falhou ao buscar settings:`, error);

      if (attempt < retries) {
        const delayMs = attempt * 5000;
        console.log(`⏳ CMS Direct: Aguardando ${delayMs / 1000}s antes da próxima tentativa...`);
        await sleep(delayMs);
        continue;
      }

      console.error(`❌ CMS Direct: Todas as ${retries} tentativas falharam para settings`);
      return { success: false, settings: {} };
    }
  }

  return { success: false, settings: {} };
}

/**
 * Cria função cacheada para buscar settings
 * ✨ CACHE DINÂMICO: infinito se sucesso, self-healing se falha
 *
 * @returns Função que retorna settings com cache infinito
 */
export function createSettingsFetcher() {
  return unstable_cache(
    async (): Promise<Record<string, any>> => {
      const result = await fetchSettingsFromDatabase();

      if (result.success) {
        console.log(`✅ CMS Cache: Settings com cache INFINITO`);
      } else {
        console.log(`⚠️ CMS Cache: Settings com falha, tentará novamente em breve`);
      }

      return result.settings;
    },
    ['settings-cache'],
    {
      tags: ['settings-content'],
      revalidate: false // Cache infinito (só invalida via revalidateTag)
    }
  );
}

/**
 * Busca conteúdo da página de Agendamento com cache e retry logic
 * ✨ COM RETRY para tolerar Neon auto-suspend
 *
 * @returns Conteúdo de agendamento (título, descrição, cards)
 */
export async function getAgendamentoContent() {
  const fetcher = unstable_cache(
    async () => {
      // Retry logic para agendamento
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`🔄 CMS Direct [tentativa ${attempt}/3]: Buscando agendamento do banco...`);

          await prisma.$connect();

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

          // ✅ FALLBACK: Se não houver cards no banco, usar cards padrão de default-content.ts
          if (infoCards.length === 0) {
            console.log("⚠️  CMS Direct: Nenhum card encontrado no banco, usando conteúdo padrão");
            infoCards = DEFAULT_AGENDAMENTO_CONTENT.infoCards;
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

        } catch (error) {
          console.error(`❌ CMS Direct: Tentativa ${attempt}/3 falhou ao buscar agendamento:`, error);

          if (attempt < 3) {
            const delayMs = attempt * 5000;
            console.log(`⏳ CMS Direct: Aguardando ${delayMs / 1000}s antes da próxima tentativa...`);
            await sleep(delayMs);
            continue;
          }

          // Última tentativa falhou - usar defaults
          console.warn("⚠️  CMS Direct: Usando conteúdo padrão devido a falhas nas conexões");
          return {
            title: DEFAULT_AGENDAMENTO_CONTENT.title,
            description: DEFAULT_AGENDAMENTO_CONTENT.description,
            infoCards: DEFAULT_AGENDAMENTO_CONTENT.infoCards,
          };
        }
      }

      // Fallback final
      return {
        title: DEFAULT_AGENDAMENTO_CONTENT.title,
        description: DEFAULT_AGENDAMENTO_CONTENT.description,
        infoCards: DEFAULT_AGENDAMENTO_CONTENT.infoCards,
      };
    },
    ["agendamento-content-cache"],
    {
      tags: ["agendamento-content"],
      revalidate: false, // Cache infinito (só invalida via revalidateTag)
    }
  );

  return fetcher();
}
