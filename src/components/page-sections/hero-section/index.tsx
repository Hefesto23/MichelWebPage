"use client";

import { Button } from "@/components/ui/button";
import useScrollToSection from "@/hooks/useScrollToSection";
import { ArrowDown } from "lucide-react";
import styles from "./hero.module.css";

const heroSubtitles = [
  "...Controlar a Ansiedade e seus Efeitos",
  "...Encontrar a Serenidade que você sempre Desejou",
  "...Ter mais Autoconfiança para enfrentar os Desafios",
  "...Aumentar sua Autoestima e Desenvolvimento Pessoal",
];

export default function HeroSection() {
  const scrollToSaibaMais = useScrollToSection("saiba-mais");

  return (
    <section
      id="hero"
      className={`bg-[url('/assets/horizonte.jpg')] ${styles.heroSection}`}
    >
      <div className={`${styles.heroOverlay} section-padding bg-overlay`}>
        <div className="content-container">
          <div className={styles.heroHeader}>
            <h1 className={styles.heroTitle}>Imagine...</h1>
          </div>

          <div className={styles.heroContent}>
            {heroSubtitles.map((text, index) => (
              <h1
                key={index}
                className={`${styles.heroSubtitle} animate-fade`}
                style={{ animationDelay: `${index * 3}s` }}
              >
                {text}
              </h1>
            ))}
          </div>

          <div className={styles.heroCta}>
            <Button
              variant="outline"
              onClick={scrollToSaibaMais}
              aria-label="Saiba mais sobre o Psicólogo e sua especialidade"
              className={`${styles.heroCtaButton} animate-softBounce animate-infinite`}
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
