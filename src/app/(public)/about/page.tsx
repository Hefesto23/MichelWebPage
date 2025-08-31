import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import { AboutContentServer } from "@/components/pages/about/AboutContentServer";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

// Skeleton mantendo o estilo original
function AboutSkeleton() {
  return (
    <div className="w-full flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
    </div>
  );
}

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
            <Suspense fallback={<AboutSkeleton />}>
              <AboutContentServer />
            </Suspense>
          </div>
        </div>
      </section>
      <Divisor index={3} />
    </div>
  );
}
