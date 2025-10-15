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
      revalidate: false // Cache infinito até revalidateTag ser chamado
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
      revalidate: false
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
      revalidate: false // Cache infinito até revalidateTag
    }
  );
}
