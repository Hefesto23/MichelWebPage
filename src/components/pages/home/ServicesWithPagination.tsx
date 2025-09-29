'use client';

import { CardPagination } from '@/components/shared/pagination/CardPagination';
import { ImageCard } from '@/components/shared/cards/BaseCard';
import { ServiceCard } from './services-content';

interface ServicesWithPaginationProps {
  title: string;
  description: string;
  cards: ServiceCard[];
}

export const ServicesWithPagination: React.FC<ServicesWithPaginationProps> = ({
  title,
  description,
  cards
}) => {
  const activeCards = cards
    .filter((service) => service.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="primeiros-passos" className="services-section">
      <div className="content-container">
        <div className="services-container">
          <div className="services-content">
            <div className="section-header">
              <h2 className="section-title">{title}</h2>
              <p className="section-description">{description}</p>
            </div>

            <CardPagination
              items={activeCards}
              pageSize={6}
              gridClassName="grid-services"
              renderItem={(service) => (
                <ImageCard
                  key={service.id}
                  imageUrl={service.imageUrl}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                />
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
};