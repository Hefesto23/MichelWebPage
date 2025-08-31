import { ImageLargeCard } from "@/components/shared/cards/BaseCard";
import { fetchCmsContent } from "@/lib/cms-fetch";

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

export const TerapiasContentServer = async () => {
  const content: TerapiasContentData = await fetchCmsContent({
    endpoint: "terapias",
    cacheTag: "terapias-content",
    fallback: DEFAULT_CONTENT,
    parser: (data) => {
      if (data.content && Object.keys(data.content).length > 0) {
        let processedContent: TerapiasContentData = DEFAULT_CONTENT;

        // Verificar estrutura do PageEditor (data.content.terapias)
        if (data.content.terapias) {
          processedContent = {
            title: data.content.terapias.title || DEFAULT_CONTENT.title,
            description: data.content.terapias.description || DEFAULT_CONTENT.description,
            cards: data.content.terapias.therapyModalities || DEFAULT_CONTENT.cards
          };
        } 
        // Estrutura legacy com cards separados
        else {
          processedContent = {
            title: data.content.title || DEFAULT_CONTENT.title,
            description: data.content.description || DEFAULT_CONTENT.description,
            cards: []
          };

          // Processar cards do banco de dados
          const cardKeys = Object.keys(data.content).filter(key => key.startsWith('card_'));
          cardKeys.forEach(key => {
            try {
              const cardData = JSON.parse(data.content[key]);
              processedContent.cards.push(cardData);
            } catch (e) {
              console.error('Error parsing card data:', e);
            }
          });

          // Se não há cards salvos, usar padrão
          if (processedContent.cards.length === 0) {
            processedContent.cards = DEFAULT_CONTENT.cards;
          }
        }

        return processedContent;
      }
      return DEFAULT_CONTENT;
    }
  });

  return (
    <div className="w-full py-16 relative z-0 min-h-screen">
      <div className="content-container">
        <div className="relative z-10">
          <div className="section-header">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-description">{content.description}</p>
          </div>

          <div className="grid-pages relative z-[3]">
            {content.cards
              .filter(card => card.active)
              .map((card) => (
                <ImageLargeCard
                  key={card.id}
                  imageUrl={card.imageUrl}
                  title={card.title}
                  description={card.description}
                  href={card.href}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};