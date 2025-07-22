// ============================================
// src/components/pages/home/ClinicSection.tsx
// ============================================
import { ImageGalleryComponent, clinicImages } from "@/components/shared/media";

export const ClinicSection = () => {
  return (
    <section id="espaco-clinico" className="clinic-section">
      <div className="content-container">
        <div className="clinic-container">
          <div className="section-header">
            <h2 className="section-title">Nosso Espaço</h2>
            <p className="section-description">
              Explore o ambiente projetado para proporcionar conforto,
              privacidade e bem-estar emocional.
            </p>
          </div>
          <div className="mx-auto">
            <ImageGalleryComponent images={clinicImages} />
          </div>
        </div>
      </div>
    </section>
  );
};
