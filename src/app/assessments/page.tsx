"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Assessment() {
  const testModalities = [
    {
      title: "Teste de Ansiedade - Escala BAI",
      description:
        "A Escala de Ansiedade de Beck (BAI) é um instrumento de avaliação que ajuda a identificar e medir a severidade dos sintomas de ansiedade. Composta por 21 questões, permite uma análise rápida e objetiva do estado atual de ansiedade do indivíduo.",
      buttonText: "Realizar Teste",
      link: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
      image: "/images/anxiety-test.jpg",
    },
    {
      title: "Teste de Inteligência WAIS III",
      description:
        "A Escala Wechsler de Inteligência (WAIS III) é um instrumento completo para avaliação cognitiva, composto por subtestes que analisam diferentes aspectos da inteligência, como compreensão verbal, raciocínio perceptual, memória de trabalho e velocidade de processamento.",
      buttonText: "Saiba Mais",
      link: "/wais-iii",
      image: "/images/intelligence-test.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-6">Testes Psicológicos</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Instrumentos técnicos e científicos que auxiliam na compreensão de
          aspectos específicos da saúde mental e cognitiva. Cada teste oferece
          insights importantes sobre diferentes dimensões psicológicas.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {testModalities.map((test, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative w-full h-64">
              <Image
                src={test.image}
                alt={test.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="p-6 flex flex-col justify-between h-[calc(100%-16rem)]">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {test.title}
                </h2>
                <p className="text-gray-600 mb-6">{test.description}</p>
              </div>

              <Link
                href={test.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors self-start"
              >
                {test.buttonText}
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
