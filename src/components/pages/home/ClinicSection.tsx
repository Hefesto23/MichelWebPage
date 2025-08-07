// ============================================
// src/components/pages/home/ClinicSection.tsx
// ============================================
"use client";

import { ImageGalleryComponent } from "@/components/shared/media";
import { DEFAULT_CLINIC_CONTENT } from "@/utils/default-content";
import { useEffect, useState } from "react";

interface ClinicImage {
  id: number;
  original: string;
  thumbnail: string;
  originalAlt: string;
  originalTitle: string;
  description: string;
  order: number;
  active: boolean;
}

interface ClinicContent {
  title: string;
  description: string;
  images: ClinicImage[];
}

export const ClinicSection = () => {
  const [content, setContent] = useState<ClinicContent>(DEFAULT_CLINIC_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/admin/content/home");
        
        if (response.ok) {
          const data = await response.json();
          const savedContent = data.content;
          
          if (savedContent?.clinic) {
            const clinicData = savedContent.clinic;
            
            // Parse das imagens se vier como string JSON
            let clinicImages = DEFAULT_CLINIC_CONTENT.images;
            if (clinicData.images) {
              try {
                clinicImages = typeof clinicData.images === 'string' 
                  ? JSON.parse(clinicData.images)
                  : clinicData.images;
              } catch {
                clinicImages = DEFAULT_CLINIC_CONTENT.images;
              }
            }
            
            setContent({
              title: clinicData.title || DEFAULT_CLINIC_CONTENT.title,
              description: clinicData.description || DEFAULT_CLINIC_CONTENT.description,
              images: clinicImages
            });
          } else {
            // Se não há dados salvos, usar conteúdo padrão completo
            setContent(DEFAULT_CLINIC_CONTENT);
          }
        } else {
          // Se a resposta não for OK, usar conteúdo padrão
          setContent(DEFAULT_CLINIC_CONTENT);
        }
      } catch (error) {
        console.error("Erro ao carregar conteúdo da clínica:", error);
        // Em caso de erro, usar conteúdo padrão
        setContent(DEFAULT_CLINIC_CONTENT);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Filtrar apenas imagens ativas e ordenar
  const activeImages = content.images
    .filter(image => image.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="espaco-clinico" className="clinic-section">
      <div className="content-container">
        <div className="clinic-container">
          <div className="section-header">
            <h2 className="section-title">
              {isLoading ? (
                <span className="inline-flex items-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current inline-block"></span>
                  <span>Carregando...</span>
                </span>
              ) : (
                content.title
              )}
            </h2>
            <p className="section-description">
              {isLoading ? (
                <span className="inline-flex items-center space-x-2">
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-current inline-block"></span>
                  <span>Carregando descrição...</span>
                </span>
              ) : (
                content.description
              )}
            </p>
          </div>
          <div className="mx-auto">
            {isLoading ? (
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Carregando galeria...</span>
              </div>
            ) : (
              <ImageGalleryComponent images={activeImages} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
