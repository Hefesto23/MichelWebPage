"use client";

import { Button } from "@/components/shared/ui/button";
import useScrollToSection from "@/hooks/useScrollToSection";
import { ArrowDown } from "lucide-react";

export const ScrollButton = () => {
  const scrollToSaibaMais = useScrollToSection("saiba-mais");

  return (
    <Button
      variant="outline"
      onClick={scrollToSaibaMais}
      aria-label="Saiba mais sobre o Psicólogo e sua especialidade"
      className="w-16 h-16 rounded-full text-white border-white text-sm flex items-center justify-center shadow-lg focus:outline-none group animate-softBounce"
    >
      <ArrowDown className="w-6 h-6 group-hover:stroke-[3]" />
    </Button>
  );
};