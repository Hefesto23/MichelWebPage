// components/scheduling/InfoCards/index.tsx
import { ContactCard } from "@/components/ui/cards/ServiceCard";

export default function InfoCards() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <ContactCard title="Preparando-se para sua consulta">
        <p className="text-foreground">
          Para a primeira consulta, recomendo chegar 10 minutos antes do horário
          marcado. Traga suas dúvidas e expectativas para conversarmos.
        </p>
      </ContactCard>

      <ContactCard title="Política de Cancelamento">
        <p className="text-foreground">
          Cancelamentos devem ser feitos com pelo menos 24 horas de
          antecedência. Caso contrário, a sessão será cobrada integralmente.
        </p>
      </ContactCard>

      <ContactCard title="Consulta Online">
        <p className="text-foreground">
          Para consultas online, utilize um local tranquilo e privado. Verifique
          sua conexão com a internet antes da sessão.
        </p>
      </ContactCard>
    </div>
  );
}
