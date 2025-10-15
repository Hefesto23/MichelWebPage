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

  console.log('🔍 getDivisoriasContent - rawContent:', JSON.stringify(rawContent, null, 2));

  if (!rawContent || Object.keys(rawContent).length === 0) {
    console.log('⚠️ getDivisoriasContent - Usando defaults (banco vazio)');
    return defaultQuotes;
  }

  // rawContent vem direto como { divisoria_1: {...}, divisoria_5: {...} }
  const divisorias = rawContent;
  console.log('✅ getDivisoriasContent - Usando dados do banco');

  return [
    // [0] Home - Após Banner Principal
    {
      text: divisorias.divisoria_1?.text || defaultQuotes[0].text,
      backgroundImage: divisorias.divisoria_1?.backgroundImage || defaultQuotes[0].backgroundImage,
    },
    // [1] Home - Após Serviços
    {
      text: divisorias.divisoria_2?.text || defaultQuotes[1].text,
      backgroundImage: divisorias.divisoria_2?.backgroundImage || defaultQuotes[1].backgroundImage,
    },
    // [2] Home - Após Espaço Clínico
    {
      text: divisorias.divisoria_3?.text || defaultQuotes[2].text,
      backgroundImage: divisorias.divisoria_3?.backgroundImage || defaultQuotes[2].backgroundImage,
    },
    // [3] Sobre - Final da Página
    {
      text: divisorias.divisoria_4?.text || defaultQuotes[3].text,
      backgroundImage: divisorias.divisoria_4?.backgroundImage || defaultQuotes[3].backgroundImage,
    },
    // [4] Terapias - Final da Página
    {
      text: divisorias.divisoria_5?.text || defaultQuotes[4].text,
      backgroundImage: divisorias.divisoria_5?.backgroundImage || defaultQuotes[4].backgroundImage,
    },
    // [5] DEPRECATED - Antiga compartilhada (Avaliações, Contato, Agendamento)
    {
      text: divisorias.divisoria_6?.text || defaultQuotes[5].text,
      backgroundImage: divisorias.divisoria_6?.backgroundImage || defaultQuotes[5].backgroundImage,
    },
    // [6] Avaliações - Final da Página
    {
      text: divisorias.divisoria_avaliacoes?.text || defaultQuotes[6].text,
      backgroundImage: divisorias.divisoria_avaliacoes?.backgroundImage || defaultQuotes[6].backgroundImage,
    },
    // [7] Contato - Final da Página
    {
      text: divisorias.divisoria_contato?.text || defaultQuotes[7].text,
      backgroundImage: divisorias.divisoria_contato?.backgroundImage || defaultQuotes[7].backgroundImage,
    },
    // [8] Agendamento - Final da Página
    {
      text: divisorias.divisoria_agendamento?.text || defaultQuotes[8].text,
      backgroundImage: divisorias.divisoria_agendamento?.backgroundImage || defaultQuotes[8].backgroundImage,
    },
    // [9] Genérica - Páginas Personalizadas
    {
      text: divisorias.divisoria_generica?.text || defaultQuotes[9].text,
      backgroundImage: divisorias.divisoria_generica?.backgroundImage || defaultQuotes[9].backgroundImage,
    },
  ];
}

// Dados padrão como fallback
const defaultQuotes: DivisoriaData[] = [
  // [0] Home - Após Banner Principal
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_1.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_1.backgroundImage,
  },
  // [1] Home - Após Serviços
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_2.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_2.backgroundImage,
  },
  // [2] Home - Após Espaço Clínico
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_3.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_3.backgroundImage,
  },
  // [3] Sobre - Final da Página
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_4.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_4.backgroundImage,
  },
  // [4] Terapias - Final da Página
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_5.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_5.backgroundImage,
  },
  // [5] DEPRECATED - Antiga compartilhada
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_6.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_6.backgroundImage,
  },
  // [6] Avaliações - Final da Página
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_avaliacoes.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_avaliacoes.backgroundImage,
  },
  // [7] Contato - Final da Página
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_contato.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_contato.backgroundImage,
  },
  // [8] Agendamento - Final da Página
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_agendamento.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_agendamento.backgroundImage,
  },
  // [9] Genérica - Páginas Personalizadas
  {
    text: DEFAULT_DIVISORIAS_CONTENT.divisoria_generica.text,
    backgroundImage: DEFAULT_DIVISORIAS_CONTENT.divisoria_generica.backgroundImage,
  },
];
