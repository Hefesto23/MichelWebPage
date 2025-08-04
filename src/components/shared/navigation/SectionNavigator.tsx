// ============================================
// src/components/shared/navigation/SectionNavigator.tsx
// ============================================
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

export const SectionNavigator = () => {
  const [activeSection, setActiveSection] = useState<string>(sections[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const heroSection = document.getElementById("hero");
      if (!heroSection) return;

      const shouldShow = window.scrollY > heroSection.clientHeight;
      setIsVisible(shouldShow);

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

    window.addEventListener("scroll", checkScroll);
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
      bg-black border border-border
      dark:bg-card dark:border-card-foreground/40
      shadow-lg backdrop-blur-sm
      transition-all duration-300
      ${isVisible ? "opacity-70 translate-x-0" : "opacity-0 translate-x-full"}
    `}
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative"
          aria-label={`Ir para seção ${section.label}`}
        >
          <span className="absolute right-10 top-1/2 -translate-y-1/2 px-4 py-2 rounded-full bg-black text-card-foreground font-bold dark:bg-secondary dark:text-secondary-foreground text-sm whitespace-nowrap opacity-0 group-hover:opacity-90 pointer-events-none transition-all duration-300 ease-out shadow-xl border border-card/50 dark:border-secondary/50 backdrop-blur-sm transform group-hover:scale-105">
            {section.label}
          </span>

          <div
            className={`
            m-2 
            w-3 h-3
            rounded-full
            transition-all duration-300
            ${
              activeSection === section.id
                ? "bg-primary-foreground hover:bg-primary-foreground opacity-80 scale-125"
                : "bg-foreground opacity-70 hover:bg-foreground hover:scale-110"
            }
          `}
          />
        </button>
      ))}
    </nav>
  );
};
