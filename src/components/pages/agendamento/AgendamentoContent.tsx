"use client";

import { ContactCard } from "@/components/shared/cards/BaseCard";
import { useEffect, useState } from "react";

interface InfoCard {
  id: number;
  title: string;
  content: string;
  order: number;
}

interface AgendamentoData {
  title: string;
  description: string;
  infoCards: InfoCard[];
}

interface AgendamentoContentProps {
  onContentLoad?: (content: AgendamentoData) => void;
  showOnlyCards?: boolean;
}

export const AgendamentoContent: React.FC<AgendamentoContentProps> = ({ onContentLoad, showOnlyCards }) => {
  const [content, setContent] = useState<AgendamentoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        console.log("🔄 AgendamentoContent: Buscando conteúdo...");
        
        const response = await fetch('/api/admin/content/agendamento');
        const data = await response.json();
        
        console.log("📥 AgendamentoContent: Dados recebidos:", data);
        
        if (response.ok && data.content?.agendamento) {
          const agendamentoContent: AgendamentoData = {
            title: data.content.agendamento.title || "Agendamento de Consultas",
            description: data.content.agendamento.description || "Agende sua consulta de forma rápida e segura.",
            infoCards: data.content.agendamento.infoCards || []
          };
          
          setContent(agendamentoContent);
          onContentLoad?.(agendamentoContent);
          
          console.log("✅ AgendamentoContent: Conteúdo processado:", agendamentoContent);
        } else {
          throw new Error('Falha ao carregar conteúdo');
        }
      } catch (err) {
        console.error("❌ AgendamentoContent: Erro ao buscar conteúdo:", err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        
        // Fallback para conteúdo padrão
        const defaultContent: AgendamentoData = {
          title: "Agendamento de Consultas",
          description: "Agende sua consulta de forma rápida e segura. Escolha entre atendimento presencial ou online.",
          infoCards: [
            {
              id: 1,
              title: "Preparando-se para sua consulta",
              content: "Para a primeira consulta, recomendo chegar 10 minutos antes do horário marcado. Traga suas dúvidas e expectativas para conversarmos.",
              order: 1
            },
            {
              id: 2,
              title: "Política de Cancelamento", 
              content: "Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência. Caso contrário, a sessão será cobrada integralmente.",
              order: 2
            },
            {
              id: 3,
              title: "Consulta Online",
              content: "Para consultas online, utilize um local tranquilo e privado. Verifique sua conexão com a internet antes da sessão.",
              order: 3
            }
          ]
        };
        
        setContent(defaultContent);
        onContentLoad?.(defaultContent);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [onContentLoad]);

  if (loading) {
    return (
      <div>
        {/* Conditional Header Skeleton */}
        {!showOnlyCards && (
          <div className="mb-12">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>
        )}
        
        {/* Info Cards Skeleton removido - não mostrar cards durante loading do título/descrição */}
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Erro ao carregar conteúdo: {error}</p>
        <p className="text-gray-600 dark:text-gray-400">Usando conteúdo padrão...</p>
      </div>
    );
  }

  // Se showOnlyCards é true, mostrar apenas os cards
  if (showOnlyCards) {
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

  // Renderização completa (título + descrição)
  return (
    <>
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="section-title">{content.title}</h1>
        <p className="section-description max-w-3xl">
          {content.description}
        </p>
      </div>
    </>
  );
};

export default AgendamentoContent;