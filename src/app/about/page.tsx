// src/app/about/page.tsx - REFATORADO
import Divisor from "@/components/ui/divisor";
import Image from "next/image";

export default function About() {
  return (
    <div>
      <section className="section-fullscreen py-16 relative z-0 overflow-hidden">
        <div className="content-container">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Imagem */}
            <div className="w-full md:w-1/2 flex justify-center items-center">
              <Image
                src="/assets/michel2.png"
                alt="Michel - Psicólogo Clínico"
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-contain"
              />
            </div>

            {/* Texto */}
            <div className="w-full md:w-2/3 overflow-scroll h-[36rem] custom-scrollbar">
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
        </div>
      </section>
      <Divisor index={3} />
    </div>
  );
}
