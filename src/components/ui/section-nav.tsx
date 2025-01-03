"use client";

import { useEffect, useState } from "react";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "hero", label: "Início" },
  { id: "saiba-mais", label: "Seja Bem-Vindo" },
  { id: "primeiros-passos", label: "Primeiros Passos" },
  { id: "espaco-clinico", label: "Nosso Espaço" },
];

const SectionNavigator = () => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      // Pega a altura da seção hero
      const heroSection = document.querySelector(".home-hero-section");
      if (!heroSection) return;

      // Define a visibilidade baseada na posição do scroll
      const shouldShow = window.scrollY > heroSection.clientHeight;
      setIsVisible(shouldShow);

      // Atualiza a seção ativa
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    // Adiciona o event listener
    window.addEventListener("scroll", checkScroll);
    // Checa a posição inicial
    checkScroll();

    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`
      fixed right-6 top-1/2 -translate-y-1/2
      z-50
      flex flex-col items-center
      py-4 px-2
      rounded-full
      bg-black/35
      border border-black/50
      shadow-lg
      dark:bg-white/45
      dark:border-white/50
      backdrop-blur-sm
      transition-all duration-300
      ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"}
    `}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative"
          aria-label={`Ir para seção ${section.label}`}
        >
          {/* Tooltip */}
          <span
            className="
            absolute right-8 top-1/2 -translate-y-1/2
            px-3 py-1
            rounded-md
            bg-[var(--foreground)]
            text-[var(--background)]
            text-sm
            whitespace-nowrap
            opacity-0 group-hover:opacity-100
            pointer-events-none
            transition-opacity duration-300
            dark:bg-[var(--btn)]
            dark:text-[var(--btn-fg)]
          "
          >
            {section.label}
          </span>

          {/* Dot */}
          <div
            className={`
            m-2 
            w-3 h-3
            rounded-full
            transition-all duration-300
            ${
              activeSection === section.id
                ? "bg-[var(--btn)] dark:bg-primary scale-125"
                : "bg-[var(--foreground)] dark:bg-[#ffbf9e] hover:scale-110"
            }
          `}
          />
        </button>
      ))}
    </nav>
  );
};

export default SectionNavigator;
