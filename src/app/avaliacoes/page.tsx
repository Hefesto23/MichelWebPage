"use client";

import { ImageCard } from "@/components/ui/cards/ServiceCard";
import Divisor from "@/components/ui/divisor";
import styles from "@/styles/pages/avaliacoes.module.css";

export default function Assessment() {
  const testModalities = [
    {
      imageUrl: "/images/anxiety-test.jpg",
      title: "Teste de Ansiedade - Escala BAI",
      description:
        "A Escala de Ansiedade de Beck (BAI) é um instrumento de avaliação que ajuda a identificar e medir a severidade dos sintomas de ansiedade. Composta por 21 questões, permite uma análise rápida e objetiva do estado atual de ansiedade do indivíduo.",
      href: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
    },
    {
      imageUrl: "/images/intelligence-test.jpg",
      title: "Teste de Inteligência WAIS III",
      description:
        "A Escala Wechsler de Inteligência (WAIS III) é um instrumento completo para avaliação cognitiva, composto por subtestes que analisam diferentes aspectos da inteligência, como compreensão verbal, raciocínio perceptual, memória de trabalho e velocidade de processamento.",
      href: "/wais-iii",
    },
  ];

  return (
    <section>
      <div className={styles.assessmentSection}>
        <div className="content-container">
          <div className={styles.container}>
            <div className={styles.header}>
              <h2 className={styles.headerTitle}>Testes Psicológicos</h2>
              <p className={styles.headerDescription}>
                Instrumentos técnicos e científicos que auxiliam na compreensão
                de aspectos específicos da saúde mental e cognitiva. Cada teste
                oferece insights importantes sobre diferentes dimensões
                psicológicas.
              </p>
            </div>

            <div className={styles.avaliacaoGrid}>
              {testModalities.map((test, index) => (
                <ImageCard
                  key={index}
                  imageUrl={test.imageUrl}
                  title={test.title}
                  description={test.description}
                  href={test.href}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Divisor index={5} />
    </section>
  );
}
