// src/app/admin/media/page.tsx

"use client";

import { AdminCard } from "@/components/admin/AdminCard";
import {
  Filter,
  Folder,
  Grid,
  Image as ImageIcon,
  List,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface MediaCategory {
  key: string;
  name: string;
  description: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  lastUpdated: string;
}

interface MediaStats {
  totalImages: number;
  totalSize: string;
  recentUploads: number;
  categories: MediaCategory[];
}

export default function MediaManagement() {
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMediaStats();
  }, []);

  const loadMediaStats = async () => {
    try {
      // const token = localStorage.getItem('token');
      setError(null);

      // Em um ambiente real, você faria chamadas à API para obter os dados
      // Exemplo: const response = await fetch('/api/admin/media/stats', { headers: {...} });

      // Simulação de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalImages: 67,
        totalSize: "245 MB",
        recentUploads: 8,
        categories: [
          {
            key: "all",
            name: "Todas as Imagens",
            description: "Visualizar todas as imagens do sistema",
            count: 67,
            icon: ImageIcon,
            lastUpdated: "2024-05-20T10:30:00Z",
          },
          {
            key: "profile",
            name: "Fotos de Perfil",
            description: "Imagens do psicólogo e equipe",
            count: 8,
            icon: ImageIcon,
            lastUpdated: "2024-05-18T14:20:00Z",
          },
          {
            key: "services",
            name: "Serviços e Terapias",
            description: "Imagens relacionadas aos serviços",
            count: 15,
            icon: ImageIcon,
            lastUpdated: "2024-05-15T16:45:00Z",
          },
          {
            key: "gallery",
            name: "Galeria Geral",
            description: "Consultório, ambiente e decoração",
            count: 23,
            icon: ImageIcon,
            lastUpdated: "2024-05-12T11:00:00Z",
          },
          {
            key: "hero",
            name: "Banners e Heroes",
            description: "Imagens principais e de destaque",
            count: 12,
            icon: ImageIcon,
            lastUpdated: "2024-05-10T09:15:00Z",
          },
          {
            key: "testimonials",
            name: "Depoimentos",
            description: "Imagens de avaliações e testemunhos",
            count: 9,
            icon: ImageIcon,
            lastUpdated: "2024-05-08T13:45:00Z",
          },
        ],
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      setError("Erro ao carregar dados de mídia. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <AdminCard title="Erro">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              loadMediaStats();
            }}
            className="mt-4 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90"
          >
            Tentar Novamente
          </button>
        </AdminCard>
      </div>
    );
  }

  if (!stats) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gerenciamento de Mídia
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize e gerencie todas as imagens do site
          </p>
        </div>

        <Link
          href="/admin/media/upload"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90 transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload de Imagens</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <AdminCard title="" className="text-center">
          <div className="space-y-2">
            <ImageIcon className="w-8 h-8 text-primary-foreground mx-auto" />
            <p className="text-2xl font-bold text-foreground">
              {stats.totalImages}
            </p>
            <p className="text-sm text-muted-foreground">Total de Imagens</p>
          </div>
        </AdminCard>

        <AdminCard title="" className="text-center">
          <div className="space-y-2">
            <Folder className="w-8 h-8 text-primary-foreground mx-auto" />
            <p className="text-2xl font-bold text-foreground">
              {stats.totalSize}
            </p>
            <p className="text-sm text-muted-foreground">Espaço Utilizado</p>
          </div>
        </AdminCard>

        <AdminCard title="" className="text-center">
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-primary-foreground mx-auto" />
            <p className="text-2xl font-bold text-foreground">
              {stats.recentUploads}
            </p>
            <p className="text-sm text-muted-foreground">Uploads Recentes</p>
          </div>
        </AdminCard>

        <AdminCard title="" className="text-center">
          <div className="space-y-2">
            <Filter className="w-8 h-8 text-primary-foreground mx-auto" />
            <p className="text-2xl font-bold text-foreground">
              {stats.categories.length - 1}
            </p>
            <p className="text-sm text-muted-foreground">Categorias</p>
          </div>
        </AdminCard>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <AdminCard title="Ações Rápidas">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/media/upload"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <Upload className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
              <h4 className="font-medium">Upload em Lote</h4>
              <p className="text-sm text-muted-foreground">
                Envie múltiplas imagens de uma vez
              </p>
            </Link>

            <Link
              href="/admin/media/organize"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <Folder className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
              <h4 className="font-medium">Organizar Arquivos</h4>
              <p className="text-sm text-muted-foreground">
                Organize imagens por categoria
              </p>
            </Link>

            <Link
              href="/admin/media/optimize"
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-center"
            >
              <ImageIcon className="w-8 h-8 text-primary-foreground mx-auto mb-2" />
              <h4 className="font-medium">Otimizar Imagens</h4>
              <p className="text-sm text-muted-foreground">
                Comprimir e redimensionar imagens
              </p>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Categorias de Mídia
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded ${
              view === "grid"
                ? "bg-primary-foreground text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${
              view === "list"
                ? "bg-primary-foreground text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Grid/List */}
      <div
        className={
          view === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {stats.categories.map((category) => {
          const Icon = category.icon;

          if (view === "list") {
            return (
              <Link
                key={category.key}
                href={`/admin/media/category/${category.key}`}
                className="block group"
              >
                <AdminCard
                  title=""
                  className="!p-4 group-hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-foreground transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{category.count} imagens</span>
                        <span>
                          Atualizado: {formatDate(category.lastUpdated)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AdminCard>
              </Link>
            );
          }

          return (
            <Link
              key={category.key}
              href={`/admin/media/category/${category.key}`}
              className="block group"
            >
              <AdminCard
                title=""
                className="h-full group-hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors mx-auto w-fit">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-foreground transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {category.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">
                          {category.count} imagens
                        </span>
                        <span>{formatDate(category.lastUpdated)}</span>
                      </div>
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
}
