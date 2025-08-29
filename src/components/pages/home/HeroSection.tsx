import { Button } from "@/components/shared/ui/button";
import { getHeroContent } from "@/components/pages/home/hero-content";
import Link from "next/link";
import { ScrollButton } from "./ScrollButton";

export const HeroSection = async () => {
  // Buscar conteúdo no servidor com cache otimizado
  const { mainText, ctaText, disclaimer, backgroundImage } = await getHeroContent();

  return (
    <section
      id="hero"
      className="hero-section"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="hero-overlay section-padding">
        <div className="content-container">
          <div className="hero-content">
            <h1 className="hero-text">{mainText}</h1>

            <div className="mt-4 text-white text-lg font-light">{ctaText}</div>

            <Link href="/agendamento">
              <Button className="my-10 hover:opacity-80">Agende sua Consulta!</Button>
            </Link>

            <div className="italic text-lg font-light text-white">{disclaimer}</div>
          </div>
        </div>
        <div className="hero-cta">
          <ScrollButton />
        </div>
      </div>
    </section>
  );
};
