// src/components/pages/admin/Content/PageEditor.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { DEFAULT_HERO_CONTENT, DEFAULT_WELCOME_CONTENT } from "@/utils/default-content";
import { handleAuthError } from "@/lib/auth";
import { ArrowLeft, Eye, Save, Upload, RotateCcw } from "lucide-react";
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
  const [resetting, setResetting] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const loadPageContent = useCallback(async () => {
    try {
      setError(null);

      // Buscar conteúdo salvo no banco
      const response = await fetch(`/api/admin/content/${page}`);
      let savedContent = null;
      
      if (response.ok) {
        const data = await response.json();
        savedContent = data.content;
      }

      const sections = getPageSections(page, savedContent);
      setSections(sections);
    } catch (error) {
      console.error("Erro ao carregar conteúdo:", error);
      
      // Em caso de erro, usar conteúdo padrão
      const sections = getPageSections(page, null);
      setSections(sections);
      
      setError("Erro ao carregar conteúdo salvo. Usando conteúdo padrão.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadPageContent();
  }, [loadPageContent]);

  const getPageSections = (pageKey: string, savedContent: Record<string, Record<string, string>> | null = null): PageSection[] => {
    switch (pageKey) {
      case "home":
        // Usar conteúdo salvo se existir, senão usar padrão
        const heroMainText = savedContent?.hero?.mainText || DEFAULT_HERO_CONTENT.mainText;
        const heroCtaText = savedContent?.hero?.ctaText || DEFAULT_HERO_CONTENT.ctaText;
        const heroDisclaimer = savedContent?.hero?.disclaimer || DEFAULT_HERO_CONTENT.disclaimer;
        
        const welcomeTitle = savedContent?.welcome?.title || DEFAULT_WELCOME_CONTENT.title;
        const welcomeContent = savedContent?.welcome?.content || DEFAULT_WELCOME_CONTENT.content;
        
        return [
          {
            name: "Seção Hero - Conteúdo Completo",
            description: "Edite todos os textos que aparecem na seção principal da página inicial.",
            items: [
              {
                id: 1,
                page: "home",
                section: "hero",
                key: "mainText",
                type: "description",
                value: heroMainText,
                label: "Texto Principal do Hero",
                placeholder: "Digite o texto principal que será exibido no banner inicial...",
              },
              {
                id: 2,
                page: "home",
                section: "hero",
                key: "ctaText",
                type: "text",
                value: heroCtaText,
                label: "Texto do Call-to-Action",
                placeholder: "Digite o texto que aparece antes do botão de agendamento...",
              },
              {
                id: 3,
                page: "home",
                section: "hero",
                key: "disclaimer",
                type: "text",
                value: heroDisclaimer,
                label: "Texto do Disclaimer",
                placeholder: "Digite o texto de aviso que aparece no final...",
              },
            ],
          },
          {
            name: "Seção Welcome - Bem-vindo",
            description: "Edite o título e conteúdo completo da seção de apresentação após o hero.",
            items: [
              {
                id: 4,
                page: "home",
                section: "welcome",
                key: "title",
                type: "title",
                value: welcomeTitle,
                label: "Título da Seção Welcome",
                placeholder: "Digite o título da seção de apresentação...",
              },
              {
                id: 5,
                page: "home",
                section: "welcome",
                key: "content",
                type: "html",
                value: welcomeContent,
                label: "Conteúdo Completo da Seção Welcome",
                placeholder: "Digite todo o conteúdo da seção de apresentação...",
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
    // Permitir salvar mesmo sem mudanças pendentes (para preservar valores atuais)

    setSaving(true);
    setError(null);

    try {
      // Preparar dados para salvar - MESCLAR valores atuais + mudanças
      const contentToSave: Record<string, Record<string, string>> = {};
      
      sections.forEach(section => {
        section.items.forEach(item => {
          // Usar valor mudança SE existir, senão usar valor atual do item
          const valueToSave = changes[item.id] !== undefined ? changes[item.id] : item.value;
          
          if (item.section === "hero") {
            if (!contentToSave.hero) contentToSave.hero = {};
            contentToSave.hero[item.key] = valueToSave;
          } else if (item.section === "welcome") {
            if (!contentToSave.welcome) contentToSave.welcome = {};
            contentToSave.welcome[item.key] = valueToSave;
          }
        });
      });

      // Salvar no banco
      const response = await fetch(`/api/admin/content/${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: contentToSave }),
      });

      if (!response.ok) {
        // Se for erro 401 (token expirado), usar helper para redirecionar
        if (handleAuthError(response)) {
          return;
        }
        throw new Error("Erro ao salvar conteúdo");
      }

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

  const resetToDefaults = async () => {
    if (!confirm("Tem certeza que deseja restaurar o conteúdo para os valores padrão? Esta ação não pode ser desfeita.")) {
      return;
    }

    setResetting(true);
    setError(null);

    try {
      // Chamar endpoint DELETE para resetar
      const response = await fetch(`/api/admin/content/${page}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        // Se for erro 401 (token expirado), usar helper para redirecionar
        if (handleAuthError(response)) {
          return;
        }
        throw new Error("Erro ao resetar conteúdo");
      }

      // Recarregar conteúdo padrão
      await loadPageContent();
      
      // Limpar mudanças pendentes
      setChanges({});
      
      alert("Conteúdo restaurado para os valores padrão com sucesso!");
    } catch (error) {
      console.error("Erro ao resetar:", error);
      setError("Erro ao restaurar conteúdo. Tente novamente.");
    } finally {
      setResetting(false);
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
        const isHeroField = item.section === "hero";
        const isWelcomeField = item.section === "welcome";
        let maxLengthForField = 1000; // default
        let fieldName = "";
        
        if (isHeroField) {
          if (item.key === "ctaText") {
            maxLengthForField = DEFAULT_HERO_CONTENT.maxCharacters.ctaText;
            fieldName = "CTA Text";
          } else if (item.key === "disclaimer") {
            maxLengthForField = DEFAULT_HERO_CONTENT.maxCharacters.disclaimer;
            fieldName = "Disclaimer";
          }
        } else if (isWelcomeField && item.key === "title") {
          maxLengthForField = DEFAULT_WELCOME_CONTENT.maxCharacters.title;
          fieldName = "Welcome Title";
        }
        
        const currentLengthText = currentValue.length;
        const isOverLimitText = (isHeroField || isWelcomeField) && currentLengthText > maxLengthForField;
        
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => {
                if ((isHeroField || isWelcomeField) && e.target.value.length <= maxLengthForField) {
                  handleContentChange(item.id, e.target.value);
                } else if (!isHeroField && !isWelcomeField) {
                  handleContentChange(item.id, e.target.value);
                }
              }}
              placeholder={item.placeholder}
              maxLength={(isHeroField || isWelcomeField) ? maxLengthForField : undefined}
              className={`w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-foreground ${
                isOverLimitText 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {(isHeroField || isWelcomeField) && (
              <div className="flex justify-between items-center text-sm">
                <span className={`${isOverLimitText ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {currentLengthText}/{maxLengthForField} caracteres
                </span>
                {isOverLimitText && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {fieldName} muito longo! Reduza o texto.
                  </span>
                )}
              </div>
            )}
          </div>
        );

      case "description":
        const isHeroMainText = item.key === "mainText" && item.section === "hero";
        const maxLength = isHeroMainText ? DEFAULT_HERO_CONTENT.maxCharacters.mainText : 1000;
        const currentLengthDesc = currentValue.length;
        const isOverLimitDesc = currentLengthDesc > maxLength;
        
        return (
          <div className="space-y-2">
            <textarea
              value={currentValue}
              onChange={(e) => {
                if (isHeroMainText && e.target.value.length <= maxLength) {
                  handleContentChange(item.id, e.target.value);
                } else if (!isHeroMainText) {
                  handleContentChange(item.id, e.target.value);
                }
              }}
              placeholder={item.placeholder}
              rows={isHeroMainText ? 8 : 4}
              maxLength={isHeroMainText ? maxLength : undefined}
              className={`w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-foreground resize-vertical ${
                isOverLimitDesc 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {isHeroMainText && (
              <div className="flex justify-between items-center text-sm">
                <span className={`${isOverLimitDesc ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {currentLengthDesc}/{maxLength} caracteres
                </span>
                {isOverLimitDesc && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Limite excedido! Reduza o texto para manter o design.
                  </span>
                )}
              </div>
            )}
          </div>
        );

      case "html":
        const isWelcomeContent = item.key === "content" && item.section === "welcome";
        const maxLengthHtml = isWelcomeContent ? DEFAULT_WELCOME_CONTENT.maxCharacters.content : 5000;
        const currentLengthHtml = currentValue.length;
        const isOverLimitHtml = isWelcomeContent && currentLengthHtml > maxLengthHtml;
        
        return (
          <div className="space-y-2">
            <textarea
              value={currentValue}
              onChange={(e) => {
                if (isWelcomeContent && e.target.value.length <= maxLengthHtml) {
                  handleContentChange(item.id, e.target.value);
                } else if (!isWelcomeContent) {
                  handleContentChange(item.id, e.target.value);
                }
              }}
              placeholder={item.placeholder}
              rows={isWelcomeContent ? 12 : 8}
              maxLength={isWelcomeContent ? maxLengthHtml : undefined}
              className={`w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-foreground font-mono text-sm resize-vertical ${
                isOverLimitHtml 
                  ? "border-red-500 dark:border-red-400" 
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {isWelcomeContent && (
              <div className="flex justify-between items-center text-sm">
                <span className={`${isOverLimitHtml ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {currentLengthHtml}/{maxLengthHtml} caracteres
                </span>
                {isOverLimitHtml && (
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    Conteúdo muito longo! Reduza o texto.
                  </span>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {isWelcomeContent 
                ? "Use markdown básico: **negrito**, *itálico*, listas numeradas (1.) e com bullet (•)"
                : "Suporte a HTML básico: <p>, <br>, <strong>, <em>"
              }
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
            onClick={resetToDefaults}
            disabled={resetting || saving}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetting ? "Restaurando..." : "Restaurar Padrão"}</span>
          </button>

          <button
            onClick={saveChanges}
            disabled={saving}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-foreground text-white rounded-md hover:bg-primary-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvando..." : Object.keys(changes).length > 0 ? "Salvar Alterações" : "Salvar"}</span>
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
