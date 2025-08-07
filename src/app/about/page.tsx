// src/app/about/page.tsx - REFATORADO
import Divisor from "@/components/shared/ui/divisor";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sobre Michel de Camargo | Psicólogo Clínico CRP 06/174807",
  description:
    "Conheça a trajetória, formação e abordagem terapêutica do psicólogo Michel de Camargo, especialista em ansiedade.",
};
export default function About() {
  return (
    <div>
      <section className="py-16 relative z-0 overflow-hidden min-h-screen xl:h-screen">
        <div className="content-container">
          <div className="flex flex-col xl:flex-row items-start gap-8 relative z-10">
            {/* Texto - aparece primeiro em telas ≤1200px */}
            <div className="w-full xl:w-2/3 order-1">
              <div className="xl:max-h-screen xl:overflow-y-auto custom-scrollbar xl:pr-4">
              <h2 className="text-2xl font-bold mb-4">Sobre mim</h2>
              <h3 className="text-xl font-bold mb-6">Psicólogo Clínico</h3>

              <div className="space-y-4 text-gray-800">
                <p className="text-lg font-bold leading-relaxed">
                  Olá! Sou o Michel, psicólogo especializado em transtornos
                  emocionais, como ansiedade e depressão, e como especialista em
                  análise do comportamento, realizo avaliação cognitiva através
                  do teste de inteligência WAIS III.
                </p>

                <p className="text-lg font-bold leading-relaxed">
                  Meu objetivo é auxiliar pessoas que estão enfrentando
                  dificuldades psicológicas, proporcionando alívio dos sintomas
                  e uma melhora significativa na qualidade de vida.
                </p>

                <p className="text-lg font-bold leading-relaxed">
                  Minha abordagem se baseia na Análise do Comportamento, uma
                  visão teórica da Psicologia Comportamental. Através dela,
                  busco compreender individualmente cada pessoa, considerando
                  tanto o ambiente quanto os comportamentos envolvidos. Acredito
                  que essa compreensão é fundamental para alcançarmos resultados
                  efetivos.
                </p>

                <p className="text-lg font-bold leading-relaxed">
                  Estou aqui para te ajudar nessa jornada. Se você está
                  enfrentando desafios emocionais e comportamentais devido à
                  ansiedade e/ou depressão, será um prazer oferecer meu apoio e
                  orientação.
                </p>

                <p className="text-lg font-bold leading-relaxed">
                  Entre em contato comigo para agendar uma consulta ou para
                  obter mais informações sobre avaliação cognitiva. Juntos,
                  podemos trilhar um caminho de transformação e bem-estar.
                </p>
              </div>
              </div>
            </div>

            {/* Imagem - aparece após o texto em telas ≤1200px */}
            <div className="w-full xl:w-1/3 order-2 flex justify-center items-start mb-8 xl:mb-0">
              <Image
                src="/assets/michel2.png"
                alt="Michel - Psicólogo Clínico"
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-contain max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <Divisor index={3} />
    </div>
  );
}
