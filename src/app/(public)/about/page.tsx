// src/app/about/page.tsx - REFATORADO COM CMS
import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import { Metadata } from "next";
import { AboutContent } from "@/components/pages/about/AboutContent";

export const metadata: Metadata = {
  title: "Sobre Michel de Camargo | Psicólogo Clínico CRP 06/174807",
  description:
    "Conheça a trajetória, formação e abordagem terapêutica do psicólogo Michel de Camargo, especialista em ansiedade.",
};

export default function About() {
  return (
    <div>
      <section className="py-16 relative z-0 overflow-hidden">
        <div className="content-container">
          <div className="relative z-10">
            <AboutContent />
          </div>
        </div>
      </section>
      <Divisor index={3} />
    </div>
  );
}
