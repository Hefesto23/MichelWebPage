import { DEFAULT_HERO_CONTENT } from "@/utils/default-content";
import { fetchCmsContent } from "@/lib/cms-fetch";

export interface HeroContent {
  mainText: string;
  ctaText: string;
  disclaimer: string;
  backgroundImage: string;
}

export async function getHeroContent(): Promise<HeroContent> {
  return fetchCmsContent({
    endpoint: "home",
    cacheTag: "hero-content", 
    fallback: DEFAULT_HERO_CONTENT,
    parser: (data) => {
      if (!data.content?.hero) return DEFAULT_HERO_CONTENT;
      
      return {
        mainText: data.content.hero.mainText || DEFAULT_HERO_CONTENT.mainText,
        ctaText: data.content.hero.ctaText || DEFAULT_HERO_CONTENT.ctaText,
        disclaimer: data.content.hero.disclaimer || DEFAULT_HERO_CONTENT.disclaimer,
        backgroundImage: data.content.hero.backgroundImage || DEFAULT_HERO_CONTENT.backgroundImage,
      };
    }
  });
}
