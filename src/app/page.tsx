// "use client";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
// import { ArrowDown, ArrowRightIcon, CalendarCheck } from "lucide-react";
// import Image from "next/image";

// import { robotoBold, robotoSlab } from "./fonts";

// export default function Home() {
//   const scrollToSection = () => {
//     const section = document.getElementById("saiba-mais");
//     if (section) {
//       section.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };
//   return (
//     // Conteúdo da página Home
//     <div>
//       <div
//         className="bg-cover bg-center w-full h-screen text-[white]"
//         style={{ backgroundImage: "url('/assets/horizonte.jpg')" }}
//       >
//         {/* <Image
//           src="/assets/horizonte.jpg"
//           alt="Imagem principal Home da clínica"
//           fill
//           priority
//         /> */}

//         <div className="relative bg-black bg-opacity-25 h-screen">
//           <div className="flex items-center text-left h-1/6">
//             <h1
//               className={cn(
//                 "text-white text-4xl font-bold mb-4 px-8",
//                 robotoSlab.className
//               )}
//             >
//               Imagine...
//             </h1>
//           </div>
//           <div className="py-6 w-full text-center h-3/6">
//             <h1
//               className={cn(
//                 "animate-fade delay-0 text-4xl font-bold my-10",
//                 robotoSlab.className
//               )}
//             >
//               ...Controlar a Ansiedade e seus Efeitos
//             </h1>
//             <h1
//               className={cn(
//                 "animate-fade text-4xl font-bold mb-4",
//                 robotoSlab.className
//               )}
//               style={{ animationDelay: "3s" }}
//             >
//               ...Encontrar a Serenidade que você sempre Desejou
//             </h1>
//             <h1
//               className={cn(
//                 "animate-fade animation-delay-medium text-4xl font-bold mb-4",
//                 robotoSlab.className
//               )}
//               style={{ animationDelay: "6s" }}
//             >
//               ...Ter mais Autoconfiança para enfrentar os Desafios
//             </h1>
//             <h1
//               className={cn(
//                 "animate-fade animation-delay-long text-4xl font-bold mb-4",
//                 robotoSlab.className
//               )}
//               style={{ animationDelay: "9s" }}
//             >
//               ...Aumentar sua Autoestima e Desenvolvimento Pessoal
//             </h1>
//           </div>
//           <div className="flex items-center justify-center h-2/6">
//             <Button
//               variant="outline"
//               onClick={scrollToSection}
//               className="w-16 h-16 rounded-full text-white text-sm flex items-center justify-center shadow-lg focus:outline-none transition-transform animate-softBounce animate-infinite"
//             >
//               <ArrowDown className="w-6 h-6" />
//             </Button>
//           </div>
//         </div>
//       </div>
//       <section id="saiba-mais" className="w-full h-full overflow-hidden">
//         {/* Cabeçalho da seção */}
//         <div className="flex flex-row">
//           {/* Imagem lateral esquerda da seção */}

//           <div className="basis-4/6 main-text">
//             {/* Cabeçalho da seção */}
//             <div className="flex items-center text-left pt-8 pb-4">
//               <h1
//                 className={cn(
//                   "text-foreground text-4xl font-bold mb-4 px-8",
//                   robotoSlab.className
//                 )}
//               >
//                 Seja Bem-Vindo!
//               </h1>
//             </div>
//             <div
//               className={cn(
//                 "text-lg font-extrabold mb-8 px-8 pt-4",
//                 robotoBold.className
//               )}
//             >
//               <article className="leading-relaxed">
//                 <p className="mb-4">
//                   Sentir-se sobrecarregado, ansioso ou constantemente em alerta
//                   pode parecer um fardo solitário, mas saiba que você não está
//                   sozinho. A ansiedade é uma reação natural do corpo, mas,
//                   quando começa a afetar sua vida, é hora de buscar ajuda.
//                 </p>

//                 <p className="mb-4">
//                   A ansiedade pode surgir de muitas formas: preocupações
//                   excessivas no trabalho, dificuldades nos relacionamentos,
//                   tensões familiares ou até mesmo cobranças que você impõe a si
//                   mesmo. Talvez você se reconheça em momentos como:
//                 </p>

//                 <ul className="list-disc pl-6 mb-4 space-y-2">
//                   <li>
//                     Procrastinar por medo de errar ou não ser bom o suficiente.
//                   </li>
//                   <li>
//                     Evitar discussões ou situações sociais por receio de
//                     julgamento.
//                   </li>
//                   <li>
//                     Ter dificuldade para dormir devido a pensamentos
//                     incessantes.
//                   </li>
//                   <li>
//                     Sentir que o coração acelera ou que o ar parece faltar,
//                     mesmo sem motivo aparente.
//                   </li>
//                 </ul>

//                 <p className="mb-4">
//                   Aqui, a psicoterapia é um espaço para você entender e
//                   transformar essas sensações. A abordagem que utilizo é a{" "}
//                   <strong>Análise do Comportamental</strong> (TCC), uma ciência
//                   que busca compreender o impacto das situações e das
//                   experiências na sua maneira de agir, pensar e sentir. Juntos,
//                   investigaremos como os padrões de comportamento relacionados à
//                   ansiedade se formaram e como você pode transformá-los de forma
//                   prática e eficaz.
//                 </p>

//                 <p className="mb-4">No tratamento, você irá:</p>

//                 <ul className="list-disc pl-6 mb-4 space-y-2">
//                   <li>
//                     Compreender os contextos que desencadeiam sua ansiedade.
//                   </li>
//                   <li>
//                     Aprender formas de lidar com as situações que mais afetam
//                     seu bem-estar.
//                   </li>
//                   <li>
//                     Desenvolver habilidades para construir relações mais
//                     saudáveis e funcionais.
//                   </li>
//                   <li>Recuperar a autonomia e a segurança em suas escolhas.</li>
//                 </ul>

//                 <p className="mb-4">
//                   Você não precisa enfrentar tudo sozinho. Estou aqui para
//                   oferecer suporte e ajudá-lo a encontrar novos caminhos.
//                 </p>

//                 <p className="mb-6 font-bold">
//                   Dê o primeiro passo e agende uma consulta.
//                 </p>

//                 <p className="mb-6">
//                   Cuidar da sua saúde emocional é um presente que transforma a
//                   maneira como você vive e se relaciona com o mundo.
//                 </p>
//               </article>
//               <div className="flex items-center justify-center">
//                 <Button
//                   onClick={() => {}}
//                   className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 ease-in-out"
//                 >
//                   <CalendarCheck
//                     className="mr-2 group-hover:rotate-12 transition-transform duration-300"
//                     size={20}
//                   />
//                   Dê o primeiro passo
//                   <ArrowRightIcon
//                     className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
//                     size={20}
//                   />
//                 </Button>
//               </div>
//             </div>
//           </div>
//           <div className="flex basis-2/6 align-middle">
//             <Image
//               src="/assets/michel1.svg"
//               alt="Foto de Michel Psicologo Clinico"
//               className="w-full h-auto object-cover rounded-lg shadow-lg"
//               width={407}
//               height={611}
//             />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRightIcon,
  BookOpen,
  CalendarCheck,
  HeartPulse,
  MessageSquareText,
  PhoneCall,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { robotoBold, robotoSlab } from "./fonts";
import "./home.css";

const ServiceCard = ({ icon: Icon, title, description, href }) => (
  <Link
    href={href}
    className="group block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:scale-105"
  >
    <div className="flex items-center mb-4">
      <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
        <Icon
          className="text-blue-600 group-hover:text-blue-700 transition-colors"
          size={32}
        />
      </div>
      <h3
        className={cn(
          "text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors",
          robotoSlab.className
        )}
      >
        {title}
      </h3>
    </div>
    <p
      className={cn(
        "text-gray-600 group-hover:text-gray-800 transition-colors",
        robotoBold.className
      )}
    >
      {description}
    </p>
  </Link>
);

export default function Home() {
  const scrollToSection = () => {
    const section = document.getElementById("saiba-mais");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const services = [
    {
      icon: HeartPulse,
      title: "Terapias",
      description:
        "Descubra as diferentes abordagens terapêuticas para sua saúde mental.",
      href: "/terapias",
    },
    {
      icon: UserRound,
      title: "Sobre o Psicólogo",
      description: "Conheça minha história, formação e abordagem profissional.",
      href: "/sobre",
    },
    {
      icon: BookOpen,
      title: "Artigos",
      description: "Insights e informações úteis sobre saúde mental.",
      href: "/artigos",
    },
    {
      icon: CalendarCheck,
      title: "Agendar Consulta",
      description: "Marque sua primeira sessão de forma rápida e fácil.",
      href: "/agendar",
    },
    {
      icon: MessageSquareText,
      title: "Avaliações",
      description: "Saiba mais sobre os processos de avaliação psicológica.",
      href: "/avaliacoes",
    },
    {
      icon: PhoneCall,
      title: "Contato",
      description: "Entre em contato para esclarecer todas as suas dúvidas.",
      href: "/contato",
    },
  ];

  return (
    <div>
      <div
        className="home-hero-section"
        style={{ backgroundImage: "url('/assets/horizonte.jpg')" }}
      >
        <div className="home-hero-overlay">
          <div className="flex items-center text-left h-1/6">
            <h1 className={cn("home-hero-title", robotoSlab.className)}>
              Imagine...
            </h1>
          </div>

          <div className="py-8 w-full text-center h-3/6">
            {[
              "...Controlar a Ansiedade e seus Efeitos",
              "...Encontrar a Serenidade que você sempre Desejou",
              "...Ter mais Autoconfiança para enfrentar os Desafios",
              "...Aumentar sua Autoestima e Desenvolvimento Pessoal",
            ].map((text, index) => (
              <h1
                key={index}
                className={cn("home-hero-subtitle", robotoSlab.className)}
                style={{
                  animationDelay: `${index * 3}s`,
                }}
              >
                {text}
              </h1>
            ))}
          </div>

          <div className="flex items-center justify-center h-2/6">
            <Button
              variant="outline"
              onClick={scrollToSection}
              className="home-hero-cta-button"
            >
              <ArrowDown className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      <section id="saiba-mais" className="home-welcome-section">
        <div className="flex flex-row">
          <div className="basis-4/6 overflow-hidden justify-start">
            <div className="home-welcome-header">
              <h1
                className={cn(
                  "text-foreground text-4xl font-bold mb-4 px-8",
                  robotoSlab.className
                )}
              >
                Seja Bem-Vindo!
              </h1>
            </div>
            <div className={cn("home-welcome-content", robotoBold.className)}>
              <article className="leading-relaxed">
                <p className="mb-4">
                  Sentir-se sobrecarregado, ansioso ou constantemente em alerta
                  pode parecer um fardo solitário, mas saiba que você não está
                  sozinho. A ansiedade é uma reação natural do corpo, mas,
                  quando começa a afetar sua vida, é hora de buscar ajuda.
                </p>

                <p className="mb-4">
                  A ansiedade pode surgir de muitas formas: preocupações
                  excessivas no trabalho, dificuldades nos relacionamentos,
                  tensões familiares ou até mesmo cobranças que você impõe a si
                  mesmo. Talvez você se reconheça em momentos como:
                </p>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    Procrastinar por medo de errar ou não ser bom o suficiente.
                  </li>
                  <li>
                    Evitar discussões ou situações sociais por receio de
                    julgamento.
                  </li>
                  <li>
                    Ter dificuldade para dormir devido a pensamentos
                    incessantes.
                  </li>
                  <li>
                    Sentir que o coração acelera ou que o ar parece faltar,
                    mesmo sem motivo aparente.
                  </li>
                </ul>

                <p className="mb-4">
                  Aqui, a psicoterapia é um espaço para você entender e
                  transformar essas sensações. A abordagem que utilizo é a{" "}
                  <strong>Análise do Comportamental</strong> (TCC), uma ciência
                  que busca compreender o impacto das situações e das
                  experiências na sua maneira de agir, pensar e sentir. Juntos,
                  investigaremos como os padrões de comportamento relacionados à
                  ansiedade se formaram e como você pode transformá-los de forma
                  prática e eficaz.
                </p>

                <p className="mb-4">No tratamento, você irá:</p>

                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    Compreender os contextos que desencadeiam sua ansiedade.
                  </li>
                  <li>
                    Aprender formas de lidar com as situações que mais afetam
                    seu bem-estar.
                  </li>
                  <li>
                    Desenvolver habilidades para construir relações mais
                    saudáveis e funcionais.
                  </li>
                  <li>Recuperar a autonomia e a segurança em suas escolhas.</li>
                </ul>

                <p className="mb-4">
                  Você não precisa enfrentar tudo sozinho. Estou aqui para
                  oferecer suporte e ajudá-lo a encontrar novos caminhos.
                </p>

                <p className="mb-6 font-bold">
                  Dê o primeiro passo e agende uma consulta.
                </p>

                <p className="mb-6">
                  Cuidar da sua saúde emocional é um presente que transforma a
                  maneira como você vive e se relaciona com o mundo.
                </p>
              </article>

              <div className="home-cta-container">
                <Button onClick={() => {}} className="group home-cta-button">
                  <CalendarCheck
                    className="mr-2 group-hover:rotate-12 transition-transform duration-300"
                    size={20}
                  />
                  Dê o primeiro passo
                  <ArrowRightIcon
                    className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                    size={20}
                  />
                </Button>
              </div>
            </div>
          </div>

          <div className="basis-2/6">
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
      <section
        id="primeiros-passos"
        className="bg-gradient-to-br from-blue-50 to-blue-100 py-16"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className={cn(
                "text-4xl font-bold text-gray-800 mb-4",
                robotoSlab.className
              )}
            >
              Primeiros Passos
            </h2>
            <p
              className={cn(
                "text-xl text-gray-600 max-w-2xl mx-auto",
                robotoBold.className
              )}
            >
              Navegue pelos serviços e descubra como posso ajudar você em sua
              jornada de bem-estar emocional.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                href={service.href}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-8">
              <div className="w-1/3">
                <Image
                  src="/assets/mental-health-illustration.svg"
                  alt="Ilustração de Saúde Mental"
                  width={400}
                  height={300}
                  className="mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="w-1/2 text-left">
                <h3
                  className={cn(
                    "text-2xl font-bold text-gray-800 mb-4",
                    robotoSlab.className
                  )}
                >
                  Sua Jornada de Autoconhecimento
                </h3>
                <p className={cn("text-gray-600 mb-4", robotoBold.className)}>
                  Cada passo que você dá em direção ao seu bem-estar emocional é
                  uma conquista. Meu objetivo é oferecer um espaço seguro e
                  acolhedor para que você possa explorar suas emoções, superar
                  desafios e desenvolver todo seu potencial.
                </p>
                <Link
                  href="/sobre"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Saiba Mais
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
