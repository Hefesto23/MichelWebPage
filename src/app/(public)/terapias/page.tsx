import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import { TerapiasContentServer } from "@/components/pages/terapias/TerapiasContentServer";
import { Metadata } from "next";
import { Suspense } from "react";

// Cache on-demand: página é cacheada indefinidamente até revalidateTag ser chamado
// Sem force-dynamic para permitir cache estático com revalidação sob demanda

// Skeleton mantendo o estilo original
function TerapiasSkeleton() {
  return (
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
  );
}

export const metadata: Metadata = {
  title: "Terapias | Modalidades de Atendimento - Michel de Camargo",
  description:
    "Conheça as modalidades de atendimento psicológico oferecidas: presencial, online e plantão psicológico com base na Análise do Comportamento.",
};

export default function Therapies() {
  return (
    <section>
      <Suspense fallback={<TerapiasSkeleton />}>
        <TerapiasContentServer />
      </Suspense>
      <Divisor index={4} />
    </section>
  );
}