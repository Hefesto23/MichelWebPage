import { DEFAULT_CLINIC_CONTENT } from "@/utils/default-content";
import { createCachedContentFetcher } from "@/lib/cms-direct";

export interface ClinicImage {
  id: number;
  original: string;
  thumbnail: string; // Será igual ao original para simplificar
  originalAlt: string;
  originalTitle: string;
  description: string;
  order: number;
  active: boolean;
}

export interface ClinicContent {
  title: string;
  description: string;
  images: ClinicImage[];
}

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('clinic-content')
 */
export async function getClinicContent(): Promise<ClinicContent> {
  const fetcher = createCachedContentFetcher<Partial<ClinicContent>>(
    "home",
    "clinic",
    "clinic-content"
  );

  const content = await fetcher();

  // Merge com valores padrão
  return {
    title: content.title || DEFAULT_CLINIC_CONTENT.title,
    description: content.description || DEFAULT_CLINIC_CONTENT.description,
    images: content.images || DEFAULT_CLINIC_CONTENT.images,
  };
}
