// app/contato/page.tsx
import { ContactSection } from "@/components/pages/contact/ContactSection";
import Divisor from "@/components/shared/ui/divisor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Michel de Camargo - Psicólogo CRP 06/174807",
  description:
    "Entre em contato para agendar sua consulta. Atendimento presencial e online em Sorocaba.",
  keywords: "contato, psicólogo Sorocaba, agendamento, consulta psicológica",
};

export default function Contact() {
  return (
    <>
      <ContactSection />
      <Divisor index={5} />
    </>
  );
}