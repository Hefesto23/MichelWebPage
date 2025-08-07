// src/app/avaliacoes/page.tsx - REFATORADO

import { ImageLargeCard } from "@/components/shared/cards/BaseCard";
import Divisor from "@/components/shared/ui/divisor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Avaliações Psicológicas | Michel de Camargo - Psicólogo CRP 06/174807",
  description:
    "Avaliações psicológicas especializadas em Sorocaba: clínica, ocupacional, educacional e jurídica. Instrumentos validados pelo CFP. Laudo técnico em 15 dias.",
  keywords: [
    "avaliação psicológica",
    "testes psicológicos",
    "laudo psicológico",
    "perícia psicológica",
    "avaliação cognitiva",
    "WISC-V",
    "WAIS-IV",
    "teste de personalidade",
    "avaliação ocupacional",
    "psicólogo Sorocaba",
    "CRP 06/174807",
    "instrumentos CFP",
  ],
  authors: [{ name: "Michel de Camargo", url: "https://michelcamargo.psi.br" }],
  creator: "Michel de Camargo - Psicólogo",
  alternates: {
    canonical: "/avaliacoes",
  },
  openGraph: {
    title: "Avaliações Psicológicas - Michel de Camargo | Sorocaba",
    description:
      "Avaliações psicológicas com instrumentos científicos validados. Laudo técnico para contextos clínicos, ocupacionais, educacionais e jurídicos.",
    type: "website",
    locale: "pt_BR",
    url: "https://michelcamargo.psi.br/avaliacoes",
    siteName: "Michel de Camargo - Psicólogo Clínico",
    images: [
      {
        url: "/og-avaliacoes.jpg",
        width: 1200,
        height: 630,
        alt: "Avaliações Psicológicas - Michel de Camargo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Avaliações Psicológicas | Michel de Camargo - Sorocaba",
    description:
      "Instrumentos científicos validados pelo CFP. Laudo técnico especializado.",
    images: ["/og-avaliacoes.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    // Schema.org structured data
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "Michel de Camargo - Psicólogo",
      description:
        "Avaliações psicológicas especializadas com instrumentos validados científicamente",
      url: "https://michelcamargo.psi.br/avaliacoes",
      image: "https://michelcamargo.psi.br/og-avaliacoes.jpg",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Sorocaba",
        addressRegion: "SP",
        addressCountry: "BR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "-23.5015",
        longitude: "-47.4526",
      },
      telephone: "+55-15-99764-6421",
      priceRange: "$$",
      paymentAccepted: "Cash, Credit Card, Debit Card, PIX",
      medicalSpecialty: "Psychology",
      serviceType: "Psychological Assessment",
      provider: {
        "@type": "Person",
        name: "Michel de Camargo",
        jobTitle: "Psicólogo Clínico",
        worksFor: {
          "@type": "Organization",
          name: "Consultório de Psicologia Michel de Camargo",
        },
        hasCredential: "CRP 06/174807",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Avaliações Psicológicas",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Avaliação Psicológica Clínica",
              description:
                "Avaliação para diagnóstico e planejamento terapêutico",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Avaliação Psicológica Ocupacional",
              description:
                "Avaliação para processos seletivos e adequação profissional",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Avaliação Psicológica Educacional",
              description:
                "Avaliação de dificuldades de aprendizagem e potencialidades",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Avaliação Psicológica Jurídica",
              description: "Perícia psicológica para questões legais",
            },
          },
        ],
      },
    }),
  },
};

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
      <div className="w-full py-16 overflow-hidden relative z-0 min-h-screen">
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

            <div className="grid-pages-2col z-content">
              {testModalities.map((test, index) => (
                <ImageLargeCard
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
