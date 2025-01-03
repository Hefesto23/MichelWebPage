import { RTLDecorativeShapes } from "@/components/ui/decorative-shapes";
import Image from "next/image";

export default function About() {
  return (
    <div className="container h-screen mx-auto px-4 py-8 relative z-0 overflow-hidden">
      <RTLDecorativeShapes />
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-[2]">
        <div className="w-full md:w-1/3 flex justify-center">
          <Image
            src="/assets/michel2.png"
            alt="Michel - Psicólogo Clínico"
            width={400}
            height={500}
            className="rounded-lg shadow-lg object-cover max-h-[500px] w-auto"
          />
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-semibold mb-4">Sobre mim</h2>
          <h3 className="text-xl text-gray-600 mb-6">Psicólogo Clínico</h3>

          <div className="space-y-4 text-gray-800">
            <p>
              Olá! Sou o Michel, psicólogo especializado em transtornos
              emocionais, como ansiedade e depressão, e como especialista em
              análise do comportamento, realizo avaliação cognitiva através do
              teste de inteligência WAIS III.
            </p>

            <p>
              Meu objetivo é auxiliar pessoas que estão enfrentando dificuldades
              psicológicas, proporcionando alívio dos sintomas e uma melhora
              significativa na qualidade de vida.
            </p>

            <p>
              Minha abordagem se baseia na Análise do Comportamento, uma visão
              teórica da Psicologia Comportamental. Através dela, busco
              compreender individualmente cada pessoa, considerando tanto o
              ambiente quanto os comportamentos envolvidos. Acredito que essa
              compreensão é fundamental para alcançarmos resultados efetivos.
            </p>

            <p>
              Estou aqui para te ajudar nessa jornada. Se você está enfrentando
              desafios emocionais e comportamentais devido à ansiedade e/ou
              depressão, será um prazer oferecer meu apoio e orientação.
            </p>

            <p>
              Entre em contato comigo para agendar uma consulta ou para obter
              mais informações sobre avaliação cognitiva. Juntos, podemos
              trilhar um caminho de transformação e bem-estar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
