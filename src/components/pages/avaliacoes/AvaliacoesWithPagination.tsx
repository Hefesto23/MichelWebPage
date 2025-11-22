'use client';

import { CardPagination } from '@/components/shared/pagination/CardPagination';
import { ImageLargeCard } from '@/components/shared/cards/BaseCard';

interface Card {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  active: boolean;
}

interface AvaliacoesWithPaginationProps {
  title: string;
  description: string;
  cards: Card[];
}

export const AvaliacoesWithPagination: React.FC<AvaliacoesWithPaginationProps> = ({
  title,
  description,
  cards
}) => {
  const activeCards = cards.filter(card => card.active);

  return (
    <div className="w-full py-6 sm:py-10 md:py-16 overflow-hidden relative z-0 min-h-screen">
      <div className="content-container">
        <div className="relative z-10">
          <div className="section-header">
            <h2 className="section-title text-lg sm:text-xl md:text-2xl">{title}</h2>
            <p className="section-description text-sm sm:text-base md:text-lg lg:text-xl">{description}</p>
          </div>

          <CardPagination
            items={activeCards}
            pageSize={6}
            gridClassName="grid-pages-2col z-content"
            renderItem={(card) => (
              <ImageLargeCard
                key={card.id}
                imageUrl={card.imageUrl}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};