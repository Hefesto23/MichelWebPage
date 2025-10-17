// ============================================
// src/app/agendamento/page.tsx - Optimized with Server Components + ISR
// ============================================
import { AppointmentFlow } from "@/components/pages/agendamento";
import { AgendamentoHeader, AgendamentoCards } from "@/components/pages/agendamento/AgendamentoServerContent";
import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import { Metadata } from "next";
import { Suspense } from "react";

// ✅ ISR enabled: Page regenerates hourly (CMS content cached with revalidate: 3600)
// Dynamic calendar/horarios always fresh (no cache)
export const revalidate = 3600; // 1 hour ISR for CMS content

// Skeletons for independent loading
function HeaderSkeleton() {
  return (
    <div className="mb-12 animate-pulse">
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
    </div>
  );
}

function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      ))}
    </div>
  );
}

export const metadata: Metadata = {
  title: "Agendamento de Consulta | Michel de Camargo - Psicólogo",
  description:
    "Agende sua consulta de psicologia online ou presencial. Atendimento especializado em ansiedade.",
  keywords: "agendamento, consulta psicológica, psicólogo Sorocaba, ansiedade",
};

export default function Agendamento() {
  return (
    <div>
      <section className="appointment-section">
        <div className="content-container">
          <div className="z-content">
            {/* ✅ CMS Header - Independent Suspense (Server Component with ISR) */}
            <Suspense fallback={<HeaderSkeleton />}>
              <AgendamentoHeader />
            </Suspense>

            {/* ✅ Calendar/Form - Client Component (loads after 7-day quick batch) */}
            <div className="w-full mb-8">
              <AppointmentFlow mode="manage" />
            </div>

            {/* ✅ CMS Cards - Independent Suspense (Server Component with ISR) */}
            <div className="mt-8">
              <Suspense fallback={<CardsSkeleton />}>
                <AgendamentoCards />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
      <Divisor index={8} />
    </div>
  );
}
