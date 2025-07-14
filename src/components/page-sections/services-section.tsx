// src/components/page-sections/services-section/index.tsx - REFATORADO
import { ImageCard } from "@/components/ui/cards/ServiceCard";

const services = [
  {
    imageUrl: "/assets/terapias1.jpg",
    title: "Terapias",
    description:
      "Descubra as diferentes abordagens terapêuticas para sua saúde mental.",
    href: "/terapias",
  },
  {
    imageUrl: "/assets/terapias1.jpg",
    title: "Sobre o Psicólogo",
    description: "Conheça minha história, formação e abordagem profissional.",
    href: "/about",
  },
  {
    imageUrl: "/assets/terapias1.jpg",
    title: "Artigos",
    description: "Insights e informações úteis sobre saúde mental.",
    href: "/artigos",
  },
  {
    imageUrl: "/assets/terapias1.jpg",
    title: "Agendar Consulta",
    description: "Marque sua primeira sessão de forma rápida e fácil.",
    href: "/agendamento",
  },
  {
    imageUrl: "/assets/terapias1.jpg",
    title: "Avaliações",
    description: "Saiba mais sobre os processos de avaliação psicológica.",
    href: "/avaliacoes",
  },
  {
    imageUrl: "/assets/terapias1.jpg",
    title: "Contato",
    description: "Entre em contato para esclarecer todas as suas dúvidas.",
    href: "/contato",
  },
];

export default function ServicesSection() {
  return (
    <section id="primeiros-passos" className="services-section">
      <div className="content-container">
        <div className="services-container">
          <div className="services-content">
            <div className="section-header">
              <h2 className="section-title">Primeiros Passos</h2>
              <p className="section-description">
                Navegue pelos serviços e descubra como posso ajudar você...
              </p>
            </div>

            <div className="grid-services max-h-[calc(100vh-12rem)]">
              {services.map((service, index) => (
                <ImageCard
                  key={index}
                  imageUrl={service.imageUrl}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
