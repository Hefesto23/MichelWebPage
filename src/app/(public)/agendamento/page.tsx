// ============================================
// src/app/agendamento/page.tsx - COM CMS DINÂMICO
// ============================================
import { AppointmentFlow } from "@/components/pages/agendamento";
import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import { Metadata } from "next";
import { Suspense } from "react";
import dynamicImport from "next/dynamic";

export const dynamic = 'force-dynamic';

// Agendamento Skeleton
function AgendamentoSkeleton() {
  return (
    <section className="appointment-section">
      <div className="content-container">
        <div className="z-content">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="mb-12">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
            
            {/* Appointment flow skeleton */}
            <div className="w-full mb-8">
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
            </div>
            
            {/* Cards skeleton */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Carregamento dinâmico do conteúdo para evitar problemas de hidratação
const DynamicAgendamentoContent = dynamicImport(
  () => import("@/components/pages/agendamento/AgendamentoContent"),
  { 
    ssr: false, 
    loading: () => (
      <div className="mb-12">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
      </div>
    )
  }
);

// Componente separado para cards apenas
const DynamicAgendamentoCards = dynamicImport(
  () => import("@/components/pages/agendamento/AgendamentoContent"),
  { 
    ssr: false, 
    loading: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        ))}
      </div>
    )
  }
);

export const metadata: Metadata = {
  title: "Agendamento de Consulta | Michel de Camargo - Psicólogo",
  description:
    "Agende sua consulta de psicologia online ou presencial. Atendimento especializado em ansiedade.",
  keywords: "agendamento, consulta psicológica, psicólogo Sorocaba, ansiedade",
};

export default function Agendamento() {
  return (
    <div>
      <Suspense fallback={<AgendamentoSkeleton />}>
        <section className="appointment-section">
          <div className="content-container">
            <div className="z-content">
              {/* Conteúdo dinâmico gerenciado via CMS */}
              <DynamicAgendamentoContent />

              <div className="w-full mb-8">
                {/* AppointmentFlow mantido estático (calendário/steps não editáveis) */}
                <AppointmentFlow mode="manage" />
              </div>

              {/* Cards informativos abaixo do AppointmentFlow com espaçamento */}
              <div className="mt-8">
                <DynamicAgendamentoCards showOnlyCards />
              </div>
            </div>
          </div>
        </section>
      </Suspense>
      <Divisor index={5} />
    </div>
  );
}
