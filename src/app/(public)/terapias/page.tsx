// src/app/terapias/page.tsx - REFATORADO COM CMS
import { Metadata } from "next";
import dynamic from "next/dynamic";

const TerapiasContent = dynamic(
  () => import("@/components/pages/terapias").then((mod) => ({ default: mod.TerapiasContent })),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full py-16 relative z-0 min-h-screen">
        <div className="content-container">
          <div className="relative z-10">
            <div className="section-header animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="grid-pages relative z-[3]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
);

const Divisor = dynamic(
  () => import("@/components/shared/ui/divisor").then(mod => ({ default: mod.DivisorServer })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "Terapias | Modalidades de Atendimento - Michel de Camargo",
  description:
    "Conheça as modalidades de atendimento psicológico oferecidas: presencial, online e plantão psicológico com base na Análise do Comportamento.",
};

export default function Therapies() {
  return (
    <section>
      <TerapiasContent />
      <Divisor index={4} />
    </section>
  );
}