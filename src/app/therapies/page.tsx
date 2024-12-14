"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Therapies() {
  const therapyModalities = [
    {
      title: "Psicoterapia individual - Presencial",
      description:
        "Modalidade de atendimento de um paciente através de técnicas personalizadas em encontros presenciais no consultório.",
      buttonText: "Conheça agora",
      link: "/presencial",
      image: "/images/presencial-therapy.jpg",
    },
    {
      title: "Psicoterapia individual - On-line",
      description:
        "Modalidade de terapia que permite o atendimento feito à distância, com todo o conforto e privacidade que você precisa.",
      buttonText: "Conheça agora",
      link: "/online",
      image: "/images/online-therapy.jpg",
    },
    {
      title: "Plantão Psicológico",
      description:
        "Serviço de atendimento rápido e pontual, oferecido para pessoas que precisam de suporte emocional imediato e urgente.",
      buttonText: "Conheça agora",
      link: "/plantao",
      image: "/images/emergency-therapy.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-6">Modalidades de Atendimentos</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Os atendimentos são realizados dentro da visão teórica da Análise do
          Comportamento, que tem como princípio compreender o ambiente e os
          comportamentos que estão causando as dificuldades e problemas. Podendo
          assim contribuir para uma possível modificação nesses comportamentos e
          trazendo uma melhora na qualidade de vida!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {therapyModalities.map((modality, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-64">
              <Image
                src={modality.image}
                alt={modality.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="p-6 flex flex-col justify-between h-[calc(100%-16rem)]">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {modality.title}
                </h2>
                <p className="text-gray-600 mb-6">{modality.description}</p>
              </div>

              <Link
                href={modality.link}
                className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors self-start"
              >
                {modality.buttonText}
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
