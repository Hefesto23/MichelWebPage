import { DEFAULT_HERO_CONTENT } from "@/utils/default-content";
import { createCachedContentFetcher } from "@/lib/cms-direct";

export interface HeroContent {
  mainText: string;
  ctaText: string;
  backgroundImage: string;
}

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('hero-content')
 */
export async function getHeroContent(): Promise<HeroContent> {
  const fetcher = createCachedContentFetcher<Partial<HeroContent>>(
    "home",
    "hero",
    "hero-content"
  );

  const content = await fetcher();

  // Merge com valores padrão
  return {
    mainText: content.mainText || DEFAULT_HERO_CONTENT.mainText,
    ctaText: content.ctaText || DEFAULT_HERO_CONTENT.ctaText,
    backgroundImage: content.backgroundImage || DEFAULT_HERO_CONTENT.backgroundImage,
  };
}
