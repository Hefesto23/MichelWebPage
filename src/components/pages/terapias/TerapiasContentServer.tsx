import { createPageContentFetcher } from "@/lib/cms-direct";
import { TerapiasWithPagination } from "./TerapiasWithPagination";

interface Card {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  active: boolean;
}

interface TerapiasContentData {
  title: string;
  description: string;
  cards: Card[];
}

const DEFAULT_CONTENT: TerapiasContentData = {
  title: "Modalidades de Atendimentos",
  description: "Os atendimentos são realizados dentro da visão teórica da Análise do Comportamento, buscando compreender e transformar comportamentos para uma melhor qualidade de vida.",
  cards: [
    {
      id: 1,
      title: "Psicoterapia individual - Presencial",
      description: "Modalidade de atendimento de um paciente através de técnicas personalizadas em encontros presenciais no consultório.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/presencial",
      active: true
    },
    {
      id: 2,
      title: "Psicoterapia individual - On-line",
      description: "Modalidade de terapia que permite o atendimento feito à distância, com todo o conforto e privacidade que você precisa.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/online",
      active: true
    },
    {
      id: 3,
      title: "Plantão Psicológico",
      description: "Serviço de atendimento rápido e pontual, oferecido para pessoas que precisam de suporte emocional imediato e urgente.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/plantao",
      active: true
    }
  ]
};

/**
 * ✅ MIGRADO: Agora usa Prisma direto ao invés de HTTP fetch
 * - Funciona durante build (SSG)
 * - Cache infinito com revalidate: false
 * - Revalidação instantânea via revalidateTag('terapias-content')
 */
export const TerapiasContentServer = async () => {
  const fetcher = createPageContentFetcher<any>("terapias", "terapias-content");
  const rawContent = await fetcher();

  let content: TerapiasContentData = DEFAULT_CONTENT;

  if (rawContent && Object.keys(rawContent).length > 0) {
    // Extrair title e description da seção terapias
    const title = rawContent.terapias?.title || DEFAULT_CONTENT.title;
    const description = rawContent.terapias?.description || DEFAULT_CONTENT.description;

    // Processar cards das seções card_* (formato do banco de dados)
    const therapyModalities: Card[] = [];

    Object.keys(rawContent).forEach(key => {
      if (key.startsWith('card_')) {
        try {
          // rawContent[key] é um objeto { data: "JSON string" }
          const cardSection = rawContent[key];
          const cardDataString = cardSection.data || cardSection;
          const cardData = typeof cardDataString === 'string'
            ? JSON.parse(cardDataString)
            : cardDataString;
          therapyModalities.push(cardData);
        } catch (e) {
          console.error('Error parsing therapy card data:', e);
        }
      }
    });

    // Verificar se existem cards no formato PageEditor (therapyModalities direto)
    if (rawContent.terapias?.therapyModalities && Array.isArray(rawContent.terapias.therapyModalities)) {
      content = {
        title,
        description,
        cards: rawContent.terapias.therapyModalities
      };
    }
    // Usar cards processados das seções card_*
    else if (therapyModalities.length > 0) {
      content = {
        title,
        description,
        cards: therapyModalities
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
    <TerapiasWithPagination
      title={content.title}
      description={content.description}
      cards={content.cards}
    />
  );
};