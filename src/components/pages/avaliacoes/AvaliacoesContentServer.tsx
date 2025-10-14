import { createPageContentFetcher } from "@/lib/cms-direct";
import { AvaliacoesWithPagination } from "./AvaliacoesWithPagination";

interface Card {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  active: boolean;
}

interface AvaliacoesContentData {
  title: string;
  description: string;
  cards: Card[];
}

const DEFAULT_CONTENT: AvaliacoesContentData = {
  title: "Testes Psicológicos",
  description: "Instrumentos técnicos e científicos que auxiliam na compreensão de aspectos específicos da saúde mental e cognitiva. Cada teste oferece insights importantes sobre diferentes dimensões psicológicas.",
  cards: [
    {
      id: 1,
      title: "Teste de Ansiedade - Escala BAI",
      description: "A Escala de Ansiedade de Beck (BAI) é um instrumento de avaliação que ajuda a identificar e medir a severidade dos sintomas de ansiedade. Composta por 21 questões, permite uma análise rápida e objetiva do estado atual de ansiedade do indivíduo.",
      imageUrl: "/assets/terapias1.jpg",
      href: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
      active: true
    },
    {
      id: 2,
      title: "Teste de Inteligência WAIS III",
      description: "A Escala Wechsler de Inteligência (WAIS III) é um instrumento completo para avaliação cognitiva, composto por subtestes que analisam diferentes aspectos da inteligência, como compreensão verbal, raciocínio perceptual, memória de trabalho e velocidade de processamento.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/wais-iii",
      active: true
    }
  ]
};

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('avaliacoes-content')
 */
export const AvaliacoesContentServer = async () => {
  const fetcher = createPageContentFetcher<any>("avaliacoes", "avaliacoes-content");
  const rawContent = await fetcher();

  let content: AvaliacoesContentData = DEFAULT_CONTENT;

  if (rawContent && Object.keys(rawContent).length > 0) {
    // Extrair title e description da seção avaliacoes
    const title = rawContent.avaliacoes?.title || DEFAULT_CONTENT.title;
    const description = rawContent.avaliacoes?.description || DEFAULT_CONTENT.description;

    // Processar cards das seções card_* (formato do banco de dados)
    const testModalities: Card[] = [];

    Object.keys(rawContent).forEach(key => {
      if (key.startsWith('card_')) {
        try {
          // rawContent[key] é um objeto { data: "JSON string" }
          const cardSection = rawContent[key];
          const cardDataString = cardSection.data || cardSection;
          const cardData = typeof cardDataString === 'string'
            ? JSON.parse(cardDataString)
            : cardDataString;
          testModalities.push(cardData);
        } catch (e) {
          console.error('Error parsing avaliacoes card data:', e);
        }
      }
    });

    // Verificar se existem cards no formato PageEditor (testModalities direto)
    if (rawContent.avaliacoes?.testModalities && Array.isArray(rawContent.avaliacoes.testModalities)) {
      content = {
        title,
        description,
        cards: rawContent.avaliacoes.testModalities
      };
    }
    // Usar cards processados das seções card_*
    else if (testModalities.length > 0) {
      content = {
        title,
        description,
        cards: testModalities
      };
    }
    // Fallback para default
    else {
      content = {
        title,
        description,
        cards: DEFAULT_CONTENT.cards
      };
    }
  }

  return (
    <AvaliacoesWithPagination
      title={content.title}
      description={content.description}
      cards={content.cards}
    />
  );
};