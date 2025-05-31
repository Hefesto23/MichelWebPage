"use client";

import { ImageCard } from "@/components/ui/cards/ServiceCard";
import Divisor from "@/components/ui/divisor";
import styles from "@/styles/pages/terapias.module.css";

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
      <div className={styles.therapiesSection}>
        <div className="content-container">
          <div className={styles.container}>
            <div className={styles.header}>
              <h2 className={styles.headerTitle}>
                Modalidades de Atendimentos
              </h2>
              <p className={styles.headerDescription}>
                Os atendimentos são realizados dentro da visão teórica da
                Análise do Comportamento, buscando compreender e transformar
                comportamentos para uma melhor qualidade de vida.
              </p>
            </div>

            <div className={styles.terapiaGrid}>
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
