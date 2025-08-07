"use client";

import { Button } from "@/components/shared/ui/button";
import useScrollToSection from "@/hooks/useScrollToSection";
import { DEFAULT_HERO_CONTENT } from "@/utils/default-content";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const scrollToSaibaMais = useScrollToSection("saiba-mais");
  const [heroText, setHeroText] = useState(DEFAULT_HERO_CONTENT.mainText);
  const [ctaText, setCtaText] = useState(DEFAULT_HERO_CONTENT.ctaText);
  const [disclaimer, setDisclaimer] = useState(DEFAULT_HERO_CONTENT.disclaimer);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar conteúdo personalizado do banco
    const fetchHeroContent = async () => {
      try {
        console.log("🔄 HeroSection: Buscando conteúdo...");
        const response = await fetch('/api/admin/content/home');
        
        if (response.ok) {
          const data = await response.json();
          console.log("📥 HeroSection: Dados recebidos:", data);
          
          if (data.content?.hero) {
            console.log("✅ HeroSection: Usando conteúdo personalizado");
            
            // Atualizar mainText se existir
            if (data.content.hero.mainText) {
              setHeroText(data.content.hero.mainText);
            }
            
            // Atualizar ctaText se existir
            if (data.content.hero.ctaText) {
              setCtaText(data.content.hero.ctaText);
            }
            
            // Atualizar disclaimer se existir
            if (data.content.hero.disclaimer) {
              setDisclaimer(data.content.hero.disclaimer);
            }
          } else {
            console.log("ℹ️ HeroSection: Usando conteúdo padrão (nenhum salvo)");
          }
        } else {
          console.log("⚠️ HeroSection: Resposta não OK, usando padrão");
        }
      } catch (error) {
        console.log("❌ HeroSection: Erro ao buscar, usando padrão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <section
      id="hero"
      className="hero-section bg-[url('/assets/horizonte.jpg')]"
    >
      <div className="hero-overlay section-padding">
        <div className="content-container">
          <div className="hero-content">
            <h1 className="hero-text">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Carregando...</span>
                </div>
              ) : (
                heroText
              )}
              <div className="mt-4">
                {ctaText}
              </div>
              <Link href="/agendamento">
                <Button className="my-10 hover:opacity-80">
                  Agende sua Consulta!
                </Button>
              </Link>
              <div className="italic text-lg font-light">
                {disclaimer}
              </div>
            </h1>
          </div>
        </div>
        <div className="hero-cta">
          <Button
            variant="outline"
            onClick={scrollToSaibaMais}
            aria-label="Saiba mais sobre o Psicólogo e sua especialidade"
            className="w-16 h-16 rounded-full text-white border-white text-sm flex items-center justify-center shadow-lg focus:outline-none group animate-softBounce"
          >
            <ArrowDown className="w-6 h-6 group-hover:stroke-[3]" />
          </Button>
        </div>
      </div>
    </section>
  );
};
