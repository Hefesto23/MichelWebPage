// ============================================
// app/page.tsx - Página Inicial
// ============================================
import {
  ClinicSection,
  HeroSection,
  ServicesSection,
  WelcomeSection,
} from "@/components/pages/home"; // ✅ COMPONENTES MANTIDOS
import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import {
  HeroSkeleton,
  WelcomeSkeleton,
  ServicesSkeleton,
  ClinicSkeleton,
  DivisorSkeleton
} from "@/components/shared/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

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
      {/* Hero crítico - sem suspense para carregamento imediato */}
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      {/* Seções secundárias com streaming */}
      <Suspense fallback={<WelcomeSkeleton />}>
        <WelcomeSection />
      </Suspense>

      <Suspense fallback={<DivisorSkeleton />}>
        <Divisor index={0} />
      </Suspense>

      <Suspense fallback={<ServicesSkeleton />}>
        <ServicesSection />
      </Suspense>

      <Suspense fallback={<DivisorSkeleton />}>
        <Divisor index={1} />
      </Suspense>

      <Suspense fallback={<ClinicSkeleton />}>
        <ClinicSection />
      </Suspense>

      <Suspense fallback={<DivisorSkeleton />}>
        <Divisor index={2} />
      </Suspense>
    </>
  );
}
