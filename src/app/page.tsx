"use client";

import ClinicSection from "@/components/page-sections/clinic-section";
import HeroSection from "@/components/page-sections/hero-section";
import ServicesSection from "@/components/page-sections/services-section";
import WelcomeSection from "@/components/page-sections/welcome-section";
import Divisor from "@/components/ui/divisor";
import SectionNavigator from "@/components/ui/section-nav";
import { useParallaxEffect } from "@/hooks/useParallaxEffect";

export default function Home() {
  // Ativa o efeito parallax
  useParallaxEffect();

  return (
    <div>
      <SectionNavigator />
      <HeroSection />
      <WelcomeSection />
      <Divisor index={0} />
      <ServicesSection />
      <Divisor index={1} />
      <ClinicSection />
      <Divisor index={2} />
    </div>
  );
}
