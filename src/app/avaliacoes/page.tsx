// src/app/avaliacoes/page.tsx - REFATORADO
"use client";

import { ImageCard } from "@/components/ui/cards/ServiceCard";
import Divisor from "@/components/ui/divisor";

export default function Assessment() {
  const testModalities = [
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Teste de Ansiedade - Escala BAI",
      description:
        "A Escala de Ansiedade de Beck (BAI) é um instrumento de avaliação que ajuda a identificar e medir a severidade dos sintomas de ansiedade. Composta por 21 questões, permite uma análise rápida e objetiva do estado atual de ansiedade do indivíduo.",
      href: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Teste de Inteligência WAIS III",
      description:
        "A Escala Wechsler de Inteligência (WAIS III) é um instrumento completo para avaliação cognitiva, composto por subtestes que analisam diferentes aspectos da inteligência, como compreensão verbal, raciocínio perceptual, memória de trabalho e velocidade de processamento.",
      href: "/wais-iii",
    },
  ];

  return (
    <section>
      <div className="section-fullscreen w-full py-16 overflow-hidden relative z-0">
        <div className="content-container">
          <div className="relative z-10">
            <div className="section-header">
              <h2 className="section-title">Testes Psicológicos</h2>
              <p className="section-description">
                Instrumentos técnicos e científicos que auxiliam na compreensão
                de aspectos específicos da saúde mental e cognitiva. Cada teste
                oferece insights importantes sobre diferentes dimensões
                psicológicas.
              </p>
            </div>

            <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 z-content">
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
