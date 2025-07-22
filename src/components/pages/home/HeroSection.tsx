"use client";

import { Button } from "@/components/ui/button";
import useScrollToSection from "@/hooks/useScrollToSection";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

const heroSubtitles = {
  text1:
    "Já pensou em como seria ter uma vida mais tranquila e leve, com menos ansiedade? Lidar com isso pode ser difícil, mas você não precisa enfrentar tudo sozinho. Como psicólogo, estou aqui para te ouvir, acolher e ajudar a encontrar caminhos que tragam mais calma e equilíbrio ao seu dia a dia. Cada passo nessa jornada é importante, e eu estarei ao seu lado para apoiar você em cada um deles!",
};

export const HeroSection = () => {
  const scrollToSaibaMais = useScrollToSection("saiba-mais");

  return (
    <section
      id="hero"
      className="hero-section bg-[url('/assets/horizonte.jpg')]"
    >
      <div className="hero-overlay section-padding">
        <div className="content-container">
          <div className="hero-content">
            <h1 className="hero-text">
              {heroSubtitles.text1}
              <div className="mt-4">
                Agende sua consulta e comece a reescrever sua história hoje
                mesmo:
              </div>
              <Link href="/agendamento">
                <Button className="my-10 hover:opacity-80">
                  Agende sua Consulta!
                </Button>
              </Link>
              <div className="italic text-lg font-light">
                *Atendimentos a partir de 20 anos de idade
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
