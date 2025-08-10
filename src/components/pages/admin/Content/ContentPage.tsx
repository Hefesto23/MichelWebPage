// src/components/pages/admin/Content/ContentPage.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { Briefcase, Calendar, Home, Phone, Star, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ContentPage {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  sections: number;
  lastUpdated: string;
}

const contentPages: ContentPage[] = [
  {
    key: "home",
    name: "Página Inicial/Home",
    description: "Hero, welcome, serviços e seções principais",
    icon: Home,
    sections: 4,
    lastUpdated: "2024-05-20T10:30:00Z",
  },
  {
    key: "about",
    name: "About/Sobre Mim",
    description: "Biografia, formação e abordagem terapêutica",
    icon: User,
    sections: 3,
    lastUpdated: "2024-05-18T14:20:00Z",
  },
  {
    key: "terapias",
    name: "Terapias",
    description: "Modalidades de atendimento e metodologias oferecidas",
    icon: Briefcase,
    sections: 2,
    lastUpdated: "2024-05-15T16:45:00Z",
  },
  {
    key: "avaliacoes",
    name: "Avaliações",
    description: "Tipos de avaliações feitas na clínica",
    icon: Star,
    sections: 2,
    lastUpdated: "2024-05-12T11:00:00Z",
  },
  {
    key: "agendamento",
    name: "Agendamento",
    description: "Título, descrição e cards informativos da página de agendamento",
    icon: Calendar,
    sections: 2,
    lastUpdated: "2024-05-25T09:15:00Z",
  },
  {
    key: "contact",
    name: "Contato",
    description: "Informações de contato, horários e localização do consultório",
    icon: Phone,
    sections: 3,
    lastUpdated: "2024-05-22T13:30:00Z",
  },
];

export const ContentPage = () => {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de estatísticas
    const loadPageStats = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPages(contentPages);
      } catch (error) {
        console.error("Erro ao carregar páginas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPageStats();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gerenciamento de Conteúdo</h1>
        <p className="text-muted-foreground mt-2">Edite o conteúdo das páginas do seu site</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <Link key={page.key} href={`/admin/content/${page.key}`} className="block group">
              <AdminCard
                title=""
                className="h-full group-hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary-foreground transition-colors">
                      {page.name}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">{page.description}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{page.sections} seções</span>
                      <span>Editado: {formatDate(page.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              </AdminCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
