import { DEFAULT_WELCOME_CONTENT } from "@/utils/default-content";
import { createCachedContentFetcher } from "@/lib/cms-direct";

export interface WelcomeContent {
  title: string;
  content: string;
  profileImage: string;
}

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('welcome-content')
 */
export async function getWelcomeContent(): Promise<WelcomeContent> {
  const fetcher = createCachedContentFetcher<Partial<WelcomeContent>>(
    "home",
    "welcome",
    "welcome-content"
  );

  const content = await fetcher();

  // Merge com valores padrão
  return {
    title: content.title || DEFAULT_WELCOME_CONTENT.title,
    content: content.content || DEFAULT_WELCOME_CONTENT.content,
    profileImage: content.profileImage || DEFAULT_WELCOME_CONTENT.profileImage,
  };
}
