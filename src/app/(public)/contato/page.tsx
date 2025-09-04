// app/contato/page.tsx
import { ContactSection } from "@/components/pages/contact/ContactSection";
import { DivisorServer as Divisor } from "@/components/shared/ui/divisor";
import { Metadata } from "next";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

// Contact Skeleton
function ContactSkeleton() {
  return (
    <div className="py-16 relative z-0 overflow-hidden">
      <div className="content-container">
        <div className="relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Contato | Michel de Camargo - Psicólogo CRP 06/174807",
  description:
    "Entre em contato para agendar sua consulta. Atendimento presencial e online em Sorocaba.",
  keywords: "contato, psicólogo Sorocaba, agendamento, consulta psicológica",
};

export default function Contact() {
  return (
    <>
      <Suspense fallback={<ContactSkeleton />}>
        <ContactSection />
      </Suspense>
      <Divisor index={5} />
    </>
  );
}