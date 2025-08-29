// ============================================
// src/components/pages/home/ServicesSection.tsx
// ============================================

import { getServicesContent } from "@/components/pages/home/services-content";
import { ImageCard } from "@/components/shared/cards/BaseCard";

export const ServicesSection = async () => {
  // Buscar conteúdo no servidor com cache otimizado
  const { title, description, cards } = await getServicesContent();
  return (
    <section id="primeiros-passos" className="services-section">
      <div className="content-container">
        <div className="services-container">
          <div className="services-content">
            <div className="section-header">
              <h2 className="section-title">{title}</h2>
              <p className="section-description">{description}</p>
            </div>

            <div className="grid-services">
              {cards
                .filter((service) => service.active) // Mostrar apenas cards ativos
                .sort((a, b) => a.order - b.order) // Ordenar por ordem
                .map((service, index) => (
                  <ImageCard
                    key={service.id || index}
                    imageUrl={service.imageUrl}
                    title={service.title}
                    description={service.description}
                    href={service.href}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
