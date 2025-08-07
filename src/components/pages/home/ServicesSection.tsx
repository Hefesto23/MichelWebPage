// ============================================
// src/components/pages/home/ServicesSection.tsx
// ============================================
"use client";

import { ImageCard } from "@/components/shared/cards/BaseCard";
import { DEFAULT_SERVICES_CONTENT } from "@/utils/default-content";
import { useEffect, useState } from "react";

export const ServicesSection = () => {
  const [title, setTitle] = useState(DEFAULT_SERVICES_CONTENT.title);
  const [description, setDescription] = useState(DEFAULT_SERVICES_CONTENT.description);
  const [services, setServices] = useState(DEFAULT_SERVICES_CONTENT.cards);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar conteúdo personalizado do banco
    const fetchServicesContent = async () => {
      try {
        console.log("🔄 ServicesSection: Buscando conteúdo...");
        const response = await fetch('/api/admin/content/home');
        
        if (response.ok) {
          const data = await response.json();
          console.log("📥 ServicesSection: Dados recebidos:", data);
          
          if (data.content?.services) {
            console.log("✅ ServicesSection: Usando conteúdo personalizado");
            
            // Atualizar title se existir
            if (data.content.services.title) {
              setTitle(data.content.services.title);
            }
            
            // Atualizar description se existir
            if (data.content.services.description) {
              setDescription(data.content.services.description);
            }
            
            // Atualizar services se existir
            if (data.content.services.cards) {
              setServices(data.content.services.cards);
            }
          } else {
            console.log("ℹ️ ServicesSection: Usando conteúdo padrão (nenhum salvo)");
          }
        } else {
          console.log("⚠️ ServicesSection: Resposta não OK, usando padrão");
        }
      } catch (error) {
        console.log("❌ ServicesSection: Erro ao buscar, usando padrão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicesContent();
  }, []);
  return (
    <section id="primeiros-passos" className="services-section">
      <div className="content-container">
        <div className="services-container">
          <div className="services-content">
            <div className="section-header">
              <h2 className="section-title">
                {isLoading ? (
                  <span className="inline-flex items-center space-x-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground inline-block"></span>
                    <span>Carregando...</span>
                  </span>
                ) : (
                  title
                )}
              </h2>
              <p className="section-description">
                {isLoading ? (
                  <span className="inline-block animate-pulse bg-gray-300 h-4 rounded w-3/4"></span>
                ) : (
                  description
                )}
              </p>
            </div>

            <div className="grid-services">
              {isLoading ? (
                // Loading skeleton para os 6 cards
                [...Array(6)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-3 rounded w-3/4"></div>
                  </div>
                ))
              ) : (
                services
                  .filter(service => service.active) // Mostrar apenas cards ativos
                  .sort((a, b) => a.order - b.order) // Ordenar por ordem
                  .map((service, index) => (
                    <ImageCard
                      key={service.id || index}
                      imageUrl={service.imageUrl}
                      title={service.title}
                      description={service.description}
                      href={service.href}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
