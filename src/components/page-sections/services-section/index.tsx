import { ImageCard } from "@/components/ui/cards/ServiceCard";
import styles from "./services.module.css";

// Array de serviços - poderia ser extraído para um arquivo próprio ou CMS
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
    <section id="primeiros-passos" className={styles.servicesSection}>
      <div className="content-container">
        <div className={styles.servicesContainer}>
          <div className={styles.servicesContent}>
            <div className={styles.servicesHeader}>
              <h2>Primeiros Passos</h2>
              <p>
                Navegue pelos serviços e descubra como posso ajudar você em sua
                jornada de bem-estar emocional.
              </p>
            </div>

            <div className={styles.servicesGrid}>
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
