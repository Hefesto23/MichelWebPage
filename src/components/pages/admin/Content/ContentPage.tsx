// src/components/pages/admin/Content/ContentPage.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { Briefcase, FileText, Home, MessageCircle, Star, User } from "lucide-react";
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
    key: "services",
    name: "Terapias",
    description: "Serviços oferecidos e metodologias",
    icon: Briefcase,
    sections: 2,
    lastUpdated: "2024-05-15T16:45:00Z",
  },
  {
    key: "contact",
    name: "Contato",
    description: "Informações de contato e localização",
    icon: MessageCircle,
    sections: 2,
    lastUpdated: "2024-05-10T09:15:00Z",
  },
  {
    key: "testimonials",
    name: "Avaliações",
    description: "Tipos de avaliações feitas na clinica",
    icon: Star,
    sections: 1,
    lastUpdated: "2024-05-12T11:00:00Z",
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

      {/* Ações Rápidas */}
      <div className="mt-8">
        <AdminCard title="Ações Rápidas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/content/global"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary-foreground" />
                <div>
                  <h4 className="font-medium">Configurações Globais</h4>
                  <p className="text-sm text-muted-foreground">Logo, favicon, meta tags, etc.</p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/content/backup"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-primary-foreground" />
                <div>
                  <h4 className="font-medium">Backup de Conteúdo</h4>
                  <p className="text-sm text-muted-foreground">Exportar e importar conteúdo</p>
                </div>
              </div>
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
};
