"use client";

import { Button } from "@/components/ui/button";
import useScrollToSection from "@/hooks/useScrollToSection";
import { ArrowDown } from "lucide-react";
import Link from "next/link";
import styles from "./hero.module.css";

const heroSubtitles = {
  text1:
    "Já pensou em como seria ter uma vida mais tranquila e leve, com menos ansiedade? Lidar com isso pode ser difícil, mas você não precisa enfrentar tudo sozinho. Como psicólogo, estou aqui para te ouvir, acolher e ajudar a encontrar caminhos que tragam mais calma e equilíbrio ao seu dia a dia. Cada passo nessa jornada é importante, e eu estarei ao seu lado para apoiar você em cada um deles!",
};

export default function HeroSection() {
  const scrollToSaibaMais = useScrollToSection("saiba-mais");

  return (
    <section
      id="hero"
      className={`bg-[url('/assets/horizonte.jpg')] ${styles.heroSection}`}
    >
      <div className={`${styles.heroOverlay} section-padding bg-overlay`}>
        <div className="content-container">
          <div className={`${styles.heroContent} max-w-2xl mx-auto`}>
            <h1 className={styles.heroText}>
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
        <div className={styles.heroCta}>
          <Button
            variant="outline"
            onClick={scrollToSaibaMais}
            aria-label="Saiba mais sobre o Psicólogo e sua especialidade"
            className={`${styles.heroCtaButton} group animate-softBounce animate-infinite`}
          >
            <ArrowDown className="w-6 h-6 group-hover:stroke-[3] group-hover:stroke-current dark:group-hover:stroke-background" />
          </Button>
        </div>
      </div>
    </section>
  );
}
