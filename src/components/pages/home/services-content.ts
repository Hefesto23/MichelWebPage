import { DEFAULT_SERVICES_CONTENT } from "@/utils/default-content";
import { createCachedContentFetcher } from "@/lib/cms-direct";

export interface ServiceCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  order: number;
  active: boolean;
}

export interface ServicesContent {
  title: string;
  description: string;
  cards: ServiceCard[];
}

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('services-content')
 */
export async function getServicesContent(): Promise<ServicesContent> {
  const fetcher = createCachedContentFetcher<Partial<ServicesContent>>(
    "home",
    "services",
    "services-content"
  );

  const content = await fetcher();

  // Merge com valores padrão
  return {
    title: content.title || DEFAULT_SERVICES_CONTENT.title,
    description: content.description || DEFAULT_SERVICES_CONTENT.description,
    cards: content.cards || DEFAULT_SERVICES_CONTENT.cards,
  };
}
