import { DEFAULT_DIVISORIAS_CONTENT } from "@/utils/default-content";
import { createPageContentFetcher } from "@/lib/cms-direct";

export interface DivisoriaData {
  text: string;
  backgroundImage: string;
}

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('divisorias-content')
 */
export async function getDivisoriasContent(): Promise<DivisoriaData[]> {
  const fetcher = createPageContentFetcher<any>("divisorias", "divisorias-content");
  const rawContent = await fetcher();

  if (!rawContent || !rawContent.divisorias) {
    return defaultQuotes;
  }

  const divisorias = rawContent.divisorias;

  return [
    {
      text: divisorias.divisoria_1?.text || defaultQuotes[0].text,
      backgroundImage: divisorias.divisoria_1?.backgroundImage || defaultQuotes[0].backgroundImage,
    },
    {
      text: divisorias.divisoria_2?.text || defaultQuotes[1].text,
      backgroundImage: divisorias.divisoria_2?.backgroundImage || defaultQuotes[1].backgroundImage,
    },
    {
      text: divisorias.divisoria_3?.text || defaultQuotes[2].text,
      backgroundImage: divisorias.divisoria_3?.backgroundImage || defaultQuotes[2].backgroundImage,
    },
    {
      text: divisorias.divisoria_4?.text || defaultQuotes[3].text,
      backgroundImage: divisorias.divisoria_4?.backgroundImage || defaultQuotes[3].backgroundImage,
    },
    {
      text: divisorias.divisoria_5?.text || defaultQuotes[4].text,
      backgroundImage: divisorias.divisoria_5?.backgroundImage || defaultQuotes[4].backgroundImage,
    },
    {
      text: divisorias.divisoria_6?.text || defaultQuotes[5].text,
      backgroundImage: divisorias.divisoria_6?.backgroundImage || defaultQuotes[5].backgroundImage,
    },
  ];
}

// Dados padrão como fallback
const defaultQuotes: DivisoriaData[] = [
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_1.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_1.backgroundImage,
  },
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_2.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_2.backgroundImage,
  },
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_3.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_3.backgroundImage,
  },
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_4.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_4.backgroundImage,
  },
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_5.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_5.backgroundImage,
  },
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_6.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_6.backgroundImage,
  },
];
