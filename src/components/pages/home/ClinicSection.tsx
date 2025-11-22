// ============================================
// src/components/pages/home/ClinicSection.tsx
// ============================================

import { getClinicContent } from "@/components/pages/home/clinic-content";
import { ImageGalleryComponent } from "@/components/shared/media";

export const ClinicSection = async () => {
  // Buscar conteúdo no servidor com cache otimizado
  const content = await getClinicContent();

  // Filtrar apenas imagens ativas e ordenar
  const activeImages = content.images
    .filter((image) => image.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="espaco-clinico" className="clinic-section">
      <div className="content-container">
        <div className="clinic-container">
          <div className="section-header">
            <h2 className="section-title text-lg sm:text-xl md:text-2xl">{content.title}</h2>
            <p className="section-description text-sm sm:text-base md:text-lg lg:text-xl">{content.description}</p>
          </div>
          <div className="mx-auto">
            <ImageGalleryComponent images={activeImages} />
          </div>
        </div>
      </div>
    </section>
  );
};
