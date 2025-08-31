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

export const AvaliacoesContentServer = async () => {
  const content: AvaliacoesContentData = await fetchCmsContent({
    endpoint: "avaliacoes",
    cacheTag: "avaliacoes-content",
    fallback: DEFAULT_CONTENT,
    parser: (data) => {
      if (data.content && Object.keys(data.content).length > 0) {
        let processedContent: AvaliacoesContentData = DEFAULT_CONTENT;

        // Verificar estrutura do PageEditor (data.content.avaliacoes)
        if (data.content.avaliacoes) {
          processedContent = {
            title: data.content.avaliacoes.title || DEFAULT_CONTENT.title,
            description: data.content.avaliacoes.description || DEFAULT_CONTENT.description,
            cards: data.content.avaliacoes.testModalities || DEFAULT_CONTENT.cards
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
    <div className="w-full py-16 overflow-hidden relative z-0 min-h-screen">
      <div className="content-container">
        <div className="relative z-10">
          <div className="section-header">
            <h2 className="section-title">{content.title}</h2>
            <p className="section-description">{content.description}</p>
          </div>

          <div className="grid-pages-2col z-content">
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