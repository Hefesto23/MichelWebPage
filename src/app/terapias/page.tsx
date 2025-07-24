// src/app/terapias/page.tsx - REFATORADO
"use client";

import { ImageCard } from "@/components/shared/cards/BaseCard";
import Divisor from "@/components/shared/ui/divisor";

export default function Therapies() {
  const therapyModalities = [
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Psicoterapia individual - Presencial",
      description:
        "Modalidade de atendimento de um paciente através de técnicas personalizadas em encontros presenciais no consultório.",
      href: "/presencial",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Psicoterapia individual - On-line",
      description:
        "Modalidade de terapia que permite o atendimento feito à distância, com todo o conforto e privacidade que você precisa.",
      href: "/online",
    },
    {
      imageUrl: "/assets/terapias1.jpg",
      title: "Plantão Psicológico",
      description:
        "Serviço de atendimento rápido e pontual, oferecido para pessoas que precisam de suporte emocional imediato e urgente.",
      href: "/plantao",
    },
  ];

  return (
    <section>
      <div className="services-section min-h-screen">
        <div className="content-container">
          <div className="relative z-10">
            <div className="section-header">
              <h2 className="section-title">Modalidades de Atendimentos</h2>
              <p className="section-description">
                Os atendimentos são realizados dentro da visão teórica da
                Análise do Comportamento, buscando compreender e transformar
                comportamentos para uma melhor qualidade de vida.
              </p>
            </div>

            <div className="grid-services max-h-[calc(100vh-12rem)] relative z-[3]">
              {therapyModalities.map((modality, index) => (
                <ImageCard
                  key={index}
                  imageUrl={modality.imageUrl}
                  title={modality.title}
                  description={modality.description}
                  href={modality.href}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Divisor index={4} />
    </section>
  );
}
