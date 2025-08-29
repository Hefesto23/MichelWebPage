import { DEFAULT_HERO_CONTENT } from "@/utils/default-content";

export interface HeroContent {
  mainText: string;
  ctaText: string;
  disclaimer: string;
  backgroundImage: string;
}

export async function getHeroContent(): Promise<HeroContent> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/admin/content/home`,
      {
        next: {
          tags: ["hero-content"],
          revalidate: false, // Cache infinito até revalidateTag
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      if (data.content?.hero) {
        return {
          mainText: data.content.hero.mainText || DEFAULT_HERO_CONTENT.mainText,
          ctaText: data.content.hero.ctaText || DEFAULT_HERO_CONTENT.ctaText,
          disclaimer: data.content.hero.disclaimer || DEFAULT_HERO_CONTENT.disclaimer,
          backgroundImage:
            data.content.hero.backgroundImage || DEFAULT_HERO_CONTENT.backgroundImage,
        };
      }
    }
  } catch (error) {
    // Log detalhado do erro para debugging
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Hero content fetch timeout (3s) - using fallback");
      } else {
        console.error("Hero content fetch error:", error.message);
      }
    } else {
      console.error("Unknown error fetching hero content:", error);
    }
  }

  // Fallback para conteúdo padrão
  return DEFAULT_HERO_CONTENT;
}
