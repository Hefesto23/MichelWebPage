"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import Image from "next/image";

import SwiperUi from "@/components/ui/Swiper/swiper";
import { caveat } from "./fonts";

export default function Home() {
  const scrollToSection = () => {
    const section = document.getElementById("saiba-mais");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    // Conteúdo da página Home
    <div>
      <div
        className="bg-cover bg-center w-full h-screen text-[white]"
        style={{ backgroundImage: "url('/assets/horizonte.jpg')" }}
      >
        {/* <Image
          src="/assets/horizonte.jpg"
          alt="Imagem principal Home da clínica"
          fill
          priority
        /> */}

        <div className="relative bg-black bg-opacity-25 h-screen">
          <div className="flex items-center text-left h-1/6">
            <h1
              className={cn(
                "text-white text-6xl font-bold mb-4 px-8",
                caveat.className
              )}
            >
              Imagine...
            </h1>
          </div>
          <div className="py-8 w-full text-center h-3/6">
            <h1
              className={cn(
                "animate-fade delay-0 text-6xl font-bold mb-4",
                caveat.className
              )}
            >
              ...Controlar a Ansiedade e seus Efeitos
            </h1>
            <h1
              className={cn(
                "animate-fade text-6xl font-bold mb-4",
                caveat.className
              )}
              style={{ animationDelay: "3s" }}
            >
              ...Encontrar a Serenidade que você sempre Desejou
            </h1>
            <h1
              className={cn(
                "animate-fade animation-delay-medium text-6xl font-bold mb-4",
                caveat.className
              )}
              style={{ animationDelay: "6s" }}
            >
              ...Ter mais Autoconfiança para enfrentar os Desafios
            </h1>
            <h1
              className={cn(
                "animate-fade animation-delay-long text-6xl font-bold mb-4",
                caveat.className
              )}
              style={{ animationDelay: "9s" }}
            >
              ...Aumentar sua Autoestima e Desenvolvimento Pessoal
            </h1>
          </div>
          <div className="flex items-center justify-center h-2/6">
            <Button
              variant="outline"
              onClick={scrollToSection}
              className="w-16 h-16 rounded-full text-white text-sm flex items-center justify-center shadow-lg focus:outline-none transition-transform animate-softBounce animate-infinite"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
      <section id="saiba-mais" className="w-full h-full overflow-hidden">
        {/* Cabeçalho da seção */}
        <div className="flex items-center text-left border-4 border-red-700">
          <h1
            className={cn(
              "text-foreground text-6xl font-bold mb-4 px-8",
              caveat.className
            )}
          >
            Seja Bem-Vindo!
          </h1>
        </div>
        {/* Cabeçalho da seção */}
        <div className="flex flex-row py-4 border-2 border-yellow-400">
          {/* Imagem lateral esquerda da seção */}
          <div className="basis-1/6 border-4 border-sky-600 h-[600px]">
            <Image
              src="/assets/michel2.svg"
              alt="Foto de Michel Psicologo Clinico"
              className="w-full h-full object-cover"
              width={407}
              height={611}
            />
          </div>
          <div className="basis-4/6 border-4 border-blue-700 overflow-hidden">
            {/* <p className="text-lg mb-8">
              Agende uma consulta com nossos especialistas e comece sua jornada
              para uma mente mais saudável. Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Dolor eum incidunt expedita maxime
              voluptatibus accusantium qui, totam necessitatibus quo fugiat a
              ducimus, et officia cum, sunt possimus est nam vel. Lorem ipsum
              dolor sit amet consectetur adipisicing elit. Ut vero id reiciendis
              ullam, exercitationem necessitatibus assumenda accusamus quam
              quibusdam voluptatum ducimus inventore alias accusantium aliquam
              harum laborum blanditiis laboriosam iusto. Lorem ipsum, dolor sit
              amet consectetur adipisicing elit. Mollitia ullam doloremque
              perspiciatis eaque odio commodi omnis, quaerat corporis
              reiciendis, aspernatur non soluta, facilis dolores? Aut incidunt
              eos dolor nemo unde? Agende uma
            </p>
            <Link href="/appointment">
              <Button>Agendar Consulta</Button>
            </Link> */}
            <SwiperUi />
          </div>
          <div className="basis-1/6 border-4 border-sky-600">
            <Image
              src="/assets/michel1.svg"
              alt="Foto de Michel Psicologo Clinico"
              className="w-full h-full object-cover"
              width={407}
              height={611}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
