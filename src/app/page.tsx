// ============================================
// app/page.tsx - Página Inicial
// ============================================
import {
  ClinicSection,
  HeroSection,
  ServicesSection,
  WelcomeSection,
} from "@/components/pages/home"; // ✅ COMPONENTES MANTIDOS
import Divisor from "@/components/shared/ui/divisor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Michel de Camargo - Psicólogo Clínico | Sorocaba",
  description:
    "Psicólogo clínico especializado em ansiedade. Atendimento presencial e online em Sorocaba. Agende sua consulta.",
  keywords:
    "psicólogo, ansiedade, terapia, Sorocaba, consulta online, saúde mental",
  openGraph: {
    title: "Michel de Camargo - Psicólogo Clínico",
    description: "Especialista em ansiedade. Atendimento presencial e online.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <Divisor index={0} />
      <ServicesSection />
      <Divisor index={1} />
      <ClinicSection />
    </>
  );
}
