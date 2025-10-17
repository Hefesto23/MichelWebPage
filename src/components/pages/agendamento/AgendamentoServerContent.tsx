// src/components/pages/agendamento/AgendamentoServerContent.tsx
// SERVER COMPONENTS - Conteúdo CMS que pode ser cacheado
import { ContactCard } from "@/components/shared/cards/BaseCard";
import { getAgendamentoContent } from "@/lib/cms-direct";

/**
 * Server Component para o header da página de agendamento
 * Renderiza título e descrição com ISR (cache de 1h)
 */
export async function AgendamentoHeader() {
  const content = await getAgendamentoContent();

  return (
    <div className="mb-12">
      <h1 className="section-title">{content.title}</h1>
      <p className="section-description max-w-3xl">
        {content.description}
      </p>
    </div>
  );
}

/**
 * Server Component para os cards informativos
 * Renderiza cards com informações sobre o agendamento
 */
export async function AgendamentoCards() {
  const content = await getAgendamentoContent();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {content.infoCards.map((card) => (
        <ContactCard key={card.id} title={card.title}>
          <p className="text-foreground">
            {card.content}
          </p>
        </ContactCard>
      ))}
    </div>
  );
}
