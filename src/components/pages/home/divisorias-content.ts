import { DEFAULT_DIVISORIAS_CONTENT } from "@/utils/default-content";
import { fetchCmsContent } from "@/lib/cms-fetch";

export interface DivisoriaData {
  text: string;
  backgroundImage: string;
}

export async function getDivisoriasContent(): Promise<DivisoriaData[]> {
  return fetchCmsContent({
    endpoint: "divisorias",
    cacheTag: "divisorias-content",
    fallback: defaultQuotes,
    parser: (data) => {
      if (!data.content || !data.content.divisorias) return defaultQuotes;

      const divisorias = data.content.divisorias;

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
  });
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
