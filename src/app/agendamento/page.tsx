// ============================================
// src/app/agendamento/page.tsx - REFATORADO COMPLETO
// ============================================
import { AppointmentFlow, InfoCards } from "@/components/pages/agendamento"; // ✅ NOVO IMPORT
import Divisor from "@/components/shared/ui/divisor";
import { Metadata } from "next";

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
            <h1 className="section-title">Agendamento de Consultas</h1>

            {/* ✅ COMPONENTE REFATORADO - TODA A LÓGICA ENCAPSULADA */}
            <AppointmentFlow mode="manage" />

            {/* ✅ COMPONENTE ORIGINAL MANTIDO */}
            <InfoCards />
          </div>
        </div>
      </section>
      <Divisor index={5} />
    </div>
  );
}
