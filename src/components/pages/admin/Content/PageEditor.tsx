// src/components/pages/admin/Content/PageEditor.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { ArrowLeft, Eye, Save, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface ContentItem {
  id: number;
  page: string;
  section: string;
  key: string;
  type: "text" | "title" | "description" | "image" | "html";
  value: string;
  metadata?: unknown;
  label: string;
  placeholder?: string;
}

interface PageSection {
  name: string;
  description: string;
  items: ContentItem[];
}

interface PageEditorProps {
  page: string;
}

export const PageEditor: React.FC<PageEditorProps> = ({ page }) => {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const loadPageContent = useCallback(async () => {
    try {
      setError(null);

      // Simulação de dados
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSections = getPageSections(page);
      setSections(mockSections);
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      setError("Erro ao carregar conteúdo. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadPageContent();
  }, [loadPageContent]);

  const getPageSections = (pageKey: string): PageSection[] => {
    switch (pageKey) {
      case "home":
        return [
          {
            name: "Seção Hero",
            description: "Banner principal da página inicial",
            items: [
              {
                id: 1,
                page: "home",
                section: "hero",
                key: "title",
                type: "title",
                value: "Transforme sua vida com apoio profissional",
                label: "Título Principal",
                placeholder: "Digite o título principal...",
              },
              {
                id: 2,
                page: "home",
                section: "hero",
                key: "subtitle",
                type: "text",
                value:
                  "Psicologia clínica especializada em transtornos emocionais",
                label: "Subtítulo",
                placeholder: "Digite o subtítulo...",
              },
              {
                id: 3,
                page: "home",
                section: "hero",
                key: "cta_text",
                type: "text",
                value: "Agende sua Consulta",
                label: "Texto do Botão",
                placeholder: "Texto do botão de ação...",
              },
            ],
          },
          {
            name: "Seção Welcome",
            description: "Apresentação e boas-vindas",
            items: [
              {
                id: 4,
                page: "home",
                section: "welcome",
                key: "title",
                type: "title",
                value: "Bem-vindo ao meu consultório",
                label: "Título da Seção",
                placeholder: "Digite o título...",
              },
              {
                id: 5,
                page: "home",
                section: "welcome",
                key: "description",
                type: "description",
                value: "Sou especializado em análise do comportamento...",
                label: "Descrição",
                placeholder: "Digite a descrição...",
              },
            ],
          },
        ];

      case "about":
        return [
          {
            name: "Informações Pessoais",
            description: "Biografia e apresentação",
            items: [
              {
                id: 6,
                page: "about",
                section: "bio",
                key: "title",
                type: "title",
                value: "Sobre mim",
                label: "Título da Página",
                placeholder: "Digite o título...",
              },
              {
                id: 7,
                page: "about",
                section: "bio",
                key: "subtitle",
                type: "text",
                value: "Psicólogo Clínico",
                label: "Subtítulo",
                placeholder: "Digite o subtítulo...",
              },
              {
                id: 8,
                page: "about",
                section: "bio",
                key: "description",
                type: "html",
                value: "Olá! Sou o Michel, psicólogo especializado...",
                label: "Biografia Completa",
                placeholder: "Digite a biografia...",
              },
            ],
          },
        ];

      default:
        return [];
    }
  };

  const handleContentChange = (itemId: number, value: string) => {
    setChanges((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  const saveChanges = async () => {
    if (Object.keys(changes).length === 0) return;

    setSaving(true);
    setError(null);

    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Atualizar dados locais
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          items: section.items.map((item) => {
            if (changes[item.id] !== undefined) {
              return { ...item, value: changes[item.id] };
            }
            return item;
          }),
        }))
      );

      setChanges({});
      alert("Conteúdo salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setError("Erro ao salvar o conteúdo. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const getPageTitle = (pageKey: string) => {
    const titles: Record<string, string> = {
      home: "Página Inicial",
      about: "Sobre Mim",
      services: "Terapias",
      contact: "Contato",
      testimonials: "Avaliações",
    };
    return titles[pageKey] || "Página";
  };

  const renderContentInput = (item: ContentItem) => {
    const currentValue =
      changes[item.id] !== undefined ? changes[item.id] : item.value;

    switch (item.type) {
      case "title":
      case "text":
        return (
          <input
            type="text"
            value={currentValue}
            onChange={(e) => handleContentChange(item.id, e.target.value)}
            placeholder={item.placeholder}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-foreground"
          />
        );

      case "description":
        return (
          <textarea
            value={currentValue}
            onChange={(e) => handleContentChange(item.id, e.target.value)}
            placeholder={item.placeholder}
            rows={4}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-foreground resize-vertical"
          />
        );

      case "html":
        return (
          <div className="space-y-2">
            <textarea
              value={currentValue}
              onChange={(e) => handleContentChange(item.id, e.target.value)}
              placeholder={item.placeholder}
              rows={8}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-foreground font-mono text-sm resize-vertical"
            />
            <p className="text-xs text-muted-foreground">
              Suporte a HTML básico: &lt;p&gt;, &lt;br&gt;, &lt;strong&gt;,
              &lt;em&gt;
            </p>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => handleContentChange(item.id, e.target.value)}
              placeholder="URL da imagem"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-foreground"
            />
            <Link
              href="/admin/media"
              className="inline-flex items-center space-x-2 text-sm text-primary-foreground hover:underline"
            >
              <Upload className="w-4 h-4" />
              <span>Fazer upload de nova imagem</span>
            </Link>
            {currentValue && (
              <div className="mt-2">
                <Image
                  src={currentValue}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="max-w-xs h-auto rounded border"
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/content"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Editando: {getPageTitle(page)}
            </h1>
            <p className="text-muted-foreground mt-1">
              Modifique o conteúdo desta página
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/${page === "home" ? "" : page}`}
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </Link>

          <button
            onClick={saveChanges}
            disabled={saving || Object.keys(changes).length === 0}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvando..." : "Salvar Alterações"}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <AdminCard key={sectionIndex} title={section.name}>
            <p className="text-muted-foreground mb-6">{section.description}</p>

            <div className="space-y-6">
              {section.items.map((item) => (
                <div key={item.id} className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    {item.label}
                    {changes[item.id] !== undefined && (
                      <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                        (alterado)
                      </span>
                    )}
                  </label>
                  {renderContentInput(item)}
                </div>
              ))}
            </div>
          </AdminCard>
        ))}
      </div>

      {/* Empty State */}
      {sections.length === 0 && (
        <AdminCard title="">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma seção configurada para esta página.
            </p>
          </div>
        </AdminCard>
      )}

      {/* Changes Indicator */}
      {Object.keys(changes).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-orange-100 dark:bg-orange-900 border border-orange-300 dark:border-orange-700 rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
            {Object.keys(changes).length} alteração(ões) não salva(s)
          </p>
        </div>
      )}
    </div>
  );
};
