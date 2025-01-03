"use client";

import { Button } from "@/components/ui/button";
import { ImageCard } from "@/components/ui/cards/ServiceCard";
import {
  DecorativeShapes,
  GalleryDecorativeShapes,
  ServicesDecorativeShapes,
} from "@/components/ui/decorative-shapes";
import Divisor from "@/components/ui/divisor";
import {
  ImageGalleryComponent,
  clinicImages,
} from "@/components/ui/image-grid";
import SectionNavigator from "@/components/ui/section-nav";
import useScrollToSection from "@/hooks/useScrollToSection";
import "@/styles/pages/home.css";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

// Hook personalizado para gerenciar o efeito parallax
// Hook corrigido com tipagem adequada
const useParallaxEffect = () => {
  useEffect(() => {
    const handleParallax = () => {
      const parallaxElements =
        document.querySelectorAll<HTMLElement>(".parallax-bg");
      const viewportHeight = window.innerHeight;
      const scrollPosition = window.scrollY;

      parallaxElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < viewportHeight && rect.bottom > 0;

        if (isInView) {
          // Calcula a posição relativa do elemento em relação ao scroll
          const elementTop = rect.top + scrollPosition;
          const relativeScroll = (scrollPosition - elementTop) * 0.3;

          // Aplica a transformação
          element.style.transform = `translate3d(0, ${relativeScroll}px, 0)`;
        }
      });
    };

    // Adiciona o evento de scroll
    window.addEventListener("scroll", handleParallax, { passive: true });

    // Executa uma vez para inicializar
    handleParallax();

    // Cleanup
    return () => window.removeEventListener("scroll", handleParallax);
  }, []);
};

export default function Home() {
  useParallaxEffect(); // Ativa o efeito parallax
  const services = [
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Terapias",
      description:
        "Descubra as diferentes abordagens terapêuticas para sua saúde mental.",
      href: "/terapias",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Sobre o Psicólogo",
      description: "Conheça minha história, formação e abordagem profissional.",
      href: "/about",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Artigos",
      description: "Insights e informações úteis sobre saúde mental.",
      href: "/artigos",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Agendar Consulta",
      description: "Marque sua primeira sessão de forma rápida e fácil.",
      href: "/agendamento",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Avaliações",
      description: "Saiba mais sobre os processos de avaliação psicológica.",
      href: "/avaliacoes",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Contato",
      description: "Entre em contato para esclarecer todas as suas dúvidas.",
      href: "/contato",
    },
  ];

  const scrollToSaibaMais = useScrollToSection("saiba-mais");

  return (
    <div>
      <SectionNavigator />
      {/* Hero Section */}
      <section
        id="hero"
        className="home-hero-section"
        style={{ backgroundImage: "url('/assets/horizonte.jpg')" }}
      >
        <div className="home-hero-overlay section-padding bg-overlay">
          <div className="home-hero-header">
            <h1 className="home-hero-title">Imagine...</h1>
          </div>

          <div className="home-hero-content">
            {[
              "...Controlar a Ansiedade e seus Efeitos",
              "...Encontrar a Serenidade que você sempre Desejou",
              "...Ter mais Autoconfiança para enfrentar os Desafios",
              "...Aumentar sua Autoestima e Desenvolvimento Pessoal",
            ].map((text, index) => (
              <h1
                key={index}
                className="home-hero-subtitle"
                style={{ animationDelay: `${index * 3}s` }}
              >
                {text}
              </h1>
            ))}
          </div>

          <div className="home-hero-cta">
            <Button
              variant="outline"
              onClick={scrollToSaibaMais}
              aria-label="Saiba mais sobre o Psicólogo e sua especialidade"
              className="home-hero-cta-button transition-transform animate-softBounce animate-infinite"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </section>
      {/* Welcome Section */}
      <section id="saiba-mais" className="home-welcome-section">
        <div className="home-welcome-container">
          <div className="home-welcome-text ">
            <div className="home-welcome-header">
              <h1>Seja Bem-Vindo!</h1>
            </div>
            <div className="home-welcome-content">
              <article>
                <p>
                  Sentir-se sobrecarregado, ansioso ou constantemente em alerta
                  pode parecer um fardo solitário, mas saiba que você não está
                  sozinho. A ansiedade é uma reação natural do corpo, mas,
                  quando começa a afetar sua vida, é hora de buscar ajuda.
                </p>
                <p>
                  A ansiedade pode surgir de muitas formas: preocupações
                  excessivas no trabalho, dificuldades nos relacionamentos,
                  tensões familiares ou até mesmo cobranças que você impõe a si
                  mesmo. Talvez você se reconheça em momentos como:
                </p>

                <ul className="list-disc">
                  <li>
                    Procrastinar por medo de errar ou não ser bom o suficiente.
                  </li>
                  <li>
                    Evitar discussões ou situações sociais por receio de
                    julgamento.
                  </li>
                  <li>
                    Ter dificuldade para dormir devido a pensamentos
                    incessantes.
                  </li>
                  <li>
                    Sentir que o coração acelera ou que o ar parece faltar,
                    mesmo sem motivo aparente.
                  </li>
                </ul>

                <p>
                  Aqui, a psicoterapia é um espaço para você entender e
                  transformar essas sensações. A abordagem que utilizo é a{" "}
                  <strong>Análise do Comportamental</strong> (TCC), uma ciência
                  que busca compreender o impacto das situações e das
                  experiências na sua maneira de agir, pensar e sentir. Juntos,
                  investigaremos como os padrões de comportamento relacionados à
                  ansiedade se formaram e como você pode transformá-los de forma
                  prática e eficaz.
                </p>

                <p>No tratamento, você irá:</p>

                <ul className="list-decimal">
                  <li>
                    Compreender os contextos que desencadeiam sua ansiedade.
                  </li>
                  <li>
                    Aprender formas de lidar com as situações que mais afetam
                    seu bem-estar.
                  </li>
                  <li>
                    Desenvolver habilidades para construir relações mais
                    saudáveis e funcionais.
                  </li>
                  <li>Recuperar a autonomia e a segurança em suas escolhas.</li>
                </ul>

                <p>
                  Você não precisa enfrentar tudo sozinho. Estou aqui para
                  oferecer suporte e ajudá-lo a encontrar novos caminhos.
                </p>

                <p className="font-bold">
                  Dê o primeiro passo e agende uma consulta.
                </p>

                <p className="mb-6">
                  Cuidar da sua saúde emocional é um presente que transforma a
                  maneira como você vive e se relaciona com o mundo.
                </p>
              </article>
            </div>
          </div>
          <DecorativeShapes />
          <div className="home-welcome-image">
            <Image
              src="/assets/michel1.svg"
              alt="Foto de Michel Psicologo Clinico"
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      <Divisor index={0} />
      {/* Services Section */}
      <section id="primeiros-passos" className="home-services-section">
        <div className="home-services-container">
          <ServicesDecorativeShapes />
          <div className="home-services-content">
            <div className="home-services-header">
              <h2>Primeiros Passos</h2>
              <p>
                Navegue pelos serviços e descubra como posso ajudar você em sua
                jornada de bem-estar emocional.
              </p>
            </div>

            <div className="home-services-grid">
              {services.map((service, index) => (
                <ImageCard
                  key={index}
                  imageUrl={service.imageUrl}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <Divisor index={1} />
      {/* Clinic Space Section */}
      <section
        id="espaco-clinico"
        className="home-clinic-section relative z-0 overflow-hidden"
      >
        <GalleryDecorativeShapes />
        <div className="home-clinic-container relative z-[2]">
          {/* Shapes decorativos */}

          <div className="home-clinic-header">
            <h2>Nosso Espaço</h2>
            <p>
              Explore o ambiente projetado para proporcionar conforto,
              privacidade e bem-estar emocional.
            </p>
          </div>
          <div className="home-clinic-grid">
            <ImageGalleryComponent images={clinicImages} />
          </div>
        </div>
      </section>
      <Divisor index={2} />
    </div>
  );
}
