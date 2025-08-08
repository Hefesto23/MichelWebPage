// src/components/pages/admin/Content/PageEditor.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { ImageSelector } from "@/components/shared/media";
import { handleAuthError } from "@/lib/auth";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_CLINIC_CONTENT,
  DEFAULT_HERO_CONTENT,
  DEFAULT_SERVICES_CONTENT,
  DEFAULT_WELCOME_CONTENT,
} from "@/utils/default-content";
import {
  ArrowLeft,
  Eye,
  ImageIcon,
  RotateCcw,
  Save,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface ContentItem {
  id: number;
  page: string;
  section: string;
  key: string;
  type: string;
  value: string;
  label?: string;
  placeholder?: string;
  metadata?: unknown;
}

interface ServiceCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  order: number;
  active: boolean;
}

interface ClinicImage {
  id: number;
  original: string;
  thumbnail: string;
  originalAlt: string;
  originalTitle: string;
  description: string;
  order: number;
  active: boolean;
}

interface NetworkItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
}

interface SavedContent {
  hero?: Record<string, string>;
  welcome?: Record<string, string>;
  services?: {
    title?: string;
    description?: string;
    cards?: ServiceCard[];
  };
  clinic?: {
    title?: string;
    description?: string;
    images?: ClinicImage[];
  };
  about?: Record<string, string>;
  social?: {
    title?: string;
    description?: string;
    networks?: NetworkItem[];
  };
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
  const [imageSelectorOpen, setImageSelectorOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<number | null>(
    null
  );

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

  const getPageSections = (
    pageKey: string,
    savedContent: Record<string, Record<string, string>> | null = null
  ): PageSection[] => {
    switch (pageKey) {
      case "home":
        // Usar conteúdo salvo se existir, senão usar padrão
        const heroMainText =
          savedContent?.hero?.mainText || DEFAULT_HERO_CONTENT.mainText;
        const heroCtaText =
          savedContent?.hero?.ctaText || DEFAULT_HERO_CONTENT.ctaText;
        const heroDisclaimer =
          savedContent?.hero?.disclaimer || DEFAULT_HERO_CONTENT.disclaimer;
        const heroBackgroundImage =
          savedContent?.hero?.backgroundImage ||
          DEFAULT_HERO_CONTENT.backgroundImage;

        const welcomeTitle =
          savedContent?.welcome?.title || DEFAULT_WELCOME_CONTENT.title;
        const welcomeContent =
          savedContent?.welcome?.content || DEFAULT_WELCOME_CONTENT.content;

        const servicesTitle =
          savedContent?.services?.title || DEFAULT_SERVICES_CONTENT.title;
        const servicesDescription =
          savedContent?.services?.description ||
          DEFAULT_SERVICES_CONTENT.description;

        // Parse dos cards se vier como string JSON
        let servicesCards = DEFAULT_SERVICES_CONTENT.cards;
        if (savedContent?.services?.cards) {
          try {
            servicesCards =
              typeof savedContent.services.cards === "string"
                ? JSON.parse(savedContent.services.cards)
                : savedContent.services.cards;
          } catch {
            servicesCards = DEFAULT_SERVICES_CONTENT.cards;
          }
        }

        const clinicTitle =
          savedContent?.clinic?.title || DEFAULT_CLINIC_CONTENT.title;
        const clinicDescription =
          savedContent?.clinic?.description ||
          DEFAULT_CLINIC_CONTENT.description;

        // Parse das imagens se vier como string JSON
        let clinicImages = DEFAULT_CLINIC_CONTENT.images;
        if (savedContent?.clinic?.images) {
          try {
            clinicImages =
              typeof savedContent.clinic.images === "string"
                ? JSON.parse(savedContent.clinic.images)
                : savedContent.clinic.images;
          } catch {
            clinicImages = DEFAULT_CLINIC_CONTENT.images;
          }
        }

        return [
          {
            name: "Seção Hero - Conteúdo Completo",
            description:
              "Edite todos os textos que aparecem na seção principal da página inicial.",
            items: [
              {
                id: 1,
                page: "home",
                section: "hero",
                key: "mainText",
                type: "description",
                value: heroMainText,
                label: "Texto Principal do Hero",
                placeholder:
                  "Digite o texto principal que será exibido no banner inicial...",
              },
              {
                id: 2,
                page: "home",
                section: "hero",
                key: "ctaText",
                type: "text",
                value: heroCtaText,
                label: "Texto do Call-to-Action",
                placeholder:
                  "Digite o texto que aparece antes do botão de agendamento...",
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
              {
                id: 4,
                page: "home",
                section: "hero",
                key: "backgroundImage",
                type: "image",
                value: heroBackgroundImage,
                label: "Imagem de Fundo do Hero",
                placeholder: "URL da imagem de fundo...",
              },
            ],
          },
          {
            name: "Seção Welcome - Bem-vindo",
            description:
              "Edite o título e conteúdo completo da seção de apresentação após o hero.",
            items: [
              {
                id: 5,
                page: "home",
                section: "welcome",
                key: "title",
                type: "title",
                value: welcomeTitle,
                label: "Título da Seção Welcome",
                placeholder: "Digite o título da seção de apresentação...",
              },
              {
                id: 6,
                page: "home",
                section: "welcome",
                key: "content",
                type: "html",
                value: welcomeContent,
                label: "Conteúdo Completo da Seção Welcome",
                placeholder:
                  "Digite todo o conteúdo da seção de apresentação...",
              },
            ],
          },
          {
            name: "Seção Services - Primeiros Passos",
            description:
              "Edite o título, descrição e todos os 6 cards da seção de serviços.",
            items: [
              {
                id: 7,
                page: "home",
                section: "services",
                key: "title",
                type: "title",
                value: servicesTitle,
                label: "Título da Seção Services",
                placeholder: "Digite o título da seção de serviços...",
              },
              {
                id: 8,
                page: "home",
                section: "services",
                key: "description",
                type: "text",
                value: servicesDescription,
                label: "Descrição da Seção Services",
                placeholder: "Digite a descrição da seção de serviços...",
              },
              // Cards individuais
              ...servicesCards
                .map((card: ServiceCard, index: number) => [
                  {
                    id: 9 + index * 4, // 9, 13, 17, 21, 25, 29
                    page: "home",
                    section: "services",
                    key: `card${card.id}_title`,
                    type: "text" as const,
                    value: card.title,
                    label: `Card ${card.id} - Título`,
                    placeholder: `Título do card ${card.id}...`,
                  },
                  {
                    id: 10 + index * 4, // 10, 14, 18, 22, 26, 30
                    page: "home",
                    section: "services",
                    key: `card${card.id}_description`,
                    type: "text" as const,
                    value: card.description,
                    label: `Card ${card.id} - Descrição`,
                    placeholder: `Descrição do card ${card.id}...`,
                  },
                  {
                    id: 11 + index * 4, // 11, 15, 19, 23, 27, 31
                    page: "home",
                    section: "services",
                    key: `card${card.id}_imageUrl`,
                    type: "image" as const,
                    value: card.imageUrl,
                    label: `Card ${card.id} - Imagem`,
                    placeholder: `URL da imagem do card ${card.id}...`,
                  },
                  {
                    id: 12 + index * 4, // 12, 16, 20, 24, 28, 32
                    page: "home",
                    section: "services",
                    key: `card${card.id}_href`,
                    type: "text" as const,
                    value: card.href,
                    label: `Card ${card.id} - Link`,
                    placeholder: `Link do card ${card.id} (ex: /terapias)...`,
                  },
                ])
                .flat(),
            ],
          },
          {
            name: "Seção Clinic - Nosso Espaço",
            description:
              "Edite o título, descrição e galeria de imagens da clínica.",
            items: [
              {
                id: 33,
                page: "home",
                section: "clinic",
                key: "title",
                type: "title" as const,
                value: clinicTitle,
                label: "Título da Seção Clinic",
                placeholder: "Digite o título da seção da clínica...",
              },
              {
                id: 34,
                page: "home",
                section: "clinic",
                key: "description",
                type: "text" as const,
                value: clinicDescription,
                label: "Descrição da Seção Clinic",
                placeholder: "Digite a descrição da seção da clínica...",
              },
              // Imagens individuais
              ...clinicImages
                .map((image: ClinicImage, index: number) => [
                  {
                    id: 35 + index * 5, // 35, 40, 45, etc.
                    page: "home",
                    section: "clinic",
                    key: `image${image.id}_originalTitle`,
                    type: "text" as const,
                    value: image.originalTitle,
                    label: `Imagem ${image.id} - Título`,
                    placeholder: `Título da imagem ${image.id}...`,
                  },
                  {
                    id: 36 + index * 5, // 36, 41, 46, etc.
                    page: "home",
                    section: "clinic",
                    key: `image${image.id}_description`,
                    type: "text" as const,
                    value: image.description,
                    label: `Imagem ${image.id} - Descrição`,
                    placeholder: `Descrição da imagem ${image.id}...`,
                  },
                  {
                    id: 37 + index * 5, // 37, 42, 47, etc.
                    page: "home",
                    section: "clinic",
                    key: `image${image.id}_originalAlt`,
                    type: "text" as const,
                    value: image.originalAlt,
                    label: `Imagem ${image.id} - Alt Text`,
                    placeholder: `Texto alternativo da imagem ${image.id}...`,
                  },
                  {
                    id: 38 + index * 5, // 38, 43, 48, etc.
                    page: "home",
                    section: "clinic",
                    key: `image${image.id}_original`,
                    type: "image" as const,
                    value: image.original,
                    label: `Imagem ${image.id} - URL`,
                    placeholder: `URL da imagem ${image.id}...`,
                  },
                  {
                    id: 39 + index * 5, // 39, 44, 49, etc.
                    page: "home",
                    section: "clinic",
                    key: `image${image.id}_thumbnail`,
                    type: "image" as const,
                    value: image.thumbnail,
                    label: `Imagem ${image.id} - Thumbnail`,
                    placeholder: `URL da thumbnail da imagem ${image.id}...`,
                  },
                ])
                .flat(),
            ],
          },
        ];

      case "about":
        // Usar conteúdo salvo se existir, senão usar padrão
        const aboutTitle = savedContent?.about?.title || DEFAULT_ABOUT_CONTENT.title;
        const aboutSubtitle = savedContent?.about?.subtitle || DEFAULT_ABOUT_CONTENT.subtitle;
        const aboutProfileImage = savedContent?.about?.profileImage || DEFAULT_ABOUT_CONTENT.profileImage;
        const aboutContent = savedContent?.about?.content || DEFAULT_ABOUT_CONTENT.content;
        
        const socialTitle = savedContent?.social?.title || DEFAULT_ABOUT_CONTENT.socialMedia.title;
        const socialDescription = savedContent?.social?.description || DEFAULT_ABOUT_CONTENT.socialMedia.description;
        
        // Parse das redes sociais se vier como string JSON
        let socialNetworks = DEFAULT_ABOUT_CONTENT.socialMedia.networks;
        if (savedContent?.social?.networks) {
          try {
            socialNetworks = typeof savedContent.social.networks === 'string' 
              ? JSON.parse(savedContent.social.networks)
              : savedContent.social.networks;
          } catch {
            socialNetworks = DEFAULT_ABOUT_CONTENT.socialMedia.networks;
          }
        }

        return [
          {
            name: "Informações Pessoais",
            description: "Biografia e apresentação do psicólogo",
            items: [
              {
                id: 400,
                page: "about",
                section: "about",
                key: "title",
                type: "title",
                value: aboutTitle,
                label: "Título da Página",
                placeholder: "Digite o título principal...",
              },
              {
                id: 401,
                page: "about",
                section: "about",
                key: "subtitle",
                type: "text",
                value: aboutSubtitle,
                label: "Subtítulo",
                placeholder: "Digite o subtítulo profissional...",
              },
              {
                id: 402,
                page: "about",
                section: "about",
                key: "profileImage",
                type: "image",
                value: aboutProfileImage,
                label: "Foto de Perfil",
                placeholder: "URL da foto de perfil...",
              },
              {
                id: 403,
                page: "about",
                section: "about",
                key: "content",
                type: "html",
                value: aboutContent,
                label: "Biografia Completa",
                placeholder: "Digite a biografia detalhada...",
              },
            ],
          },
          {
            name: "Minhas Redes Sociais",
            description: "Configure suas redes sociais e links de contato",
            items: [
              {
                id: 404,
                page: "about",
                section: "social",
                key: "title",
                type: "title",
                value: socialTitle,
                label: "Título da Seção Redes",
                placeholder: "Digite o título da seção...",
              },
              {
                id: 405,
                page: "about",
                section: "social",
                key: "description",
                type: "text",
                value: socialDescription,
                label: "Descrição da Seção",
                placeholder: "Digite a descrição...",
              },
              // Redes sociais individuais - sem campo de ordem manual
              ...socialNetworks.map((network: NetworkItem, index: number) => [
                {
                  id: 406 + (index * 2), // 406, 408, 410, 412, 414
                  page: "about",
                  section: "social",
                  key: `network${network.id}_url`,
                  type: "text" as const,
                  value: network.url,
                  label: `${network.name} - URL`,
                  placeholder: `URL do ${network.name}...`,
                },
                {
                  id: 407 + (index * 2), // 407, 409, 411, 413, 415
                  page: "about",
                  section: "social",
                  key: `network${network.id}_enabled`,
                  type: "text" as const, // Will be handled as switch in render
                  value: network.enabled ? "true" : "false",
                  label: `${network.name} - Habilitado`,
                  placeholder: "true/false",
                },
              ]).flat(),
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

  const handleImageSelect = (imageUrl: string) => {
    if (currentImageField !== null) {
      handleContentChange(currentImageField, imageUrl);
    }
    setImageSelectorOpen(false);
    setCurrentImageField(null);
  };

  const openImageSelector = (itemId: number) => {
    setCurrentImageField(itemId);
    setImageSelectorOpen(true);
  };


  const saveChanges = async () => {
    // Permitir salvar mesmo sem mudanças pendentes (para preservar valores atuais)

    setSaving(true);
    setError(null);

    try {
      // Preparar dados para salvar - MESCLAR valores atuais + mudanças
      const contentToSave: SavedContent = {};

      sections.forEach((section) => {
        section.items.forEach((item) => {
          // Usar valor mudança SE existir, senão usar valor atual do item
          const valueToSave =
            changes[item.id] !== undefined ? changes[item.id] : item.value;

          if (item.section === "hero") {
            if (!contentToSave.hero) contentToSave.hero = {};
            contentToSave.hero[item.key] = valueToSave;
          } else if (item.section === "welcome") {
            if (!contentToSave.welcome) contentToSave.welcome = {};
            contentToSave.welcome[item.key] = valueToSave;
          } else if (item.section === "services") {
            if (!contentToSave.services) contentToSave.services = {};

            // Para fields gerais da seção
            if (item.key === "title" || item.key === "description") {
              contentToSave.services[item.key] = valueToSave;
            }

            // Para campos dos cards
            if (item.key.startsWith("card")) {
              if (!contentToSave.services?.cards) {
                if (!contentToSave.services) contentToSave.services = {};
                contentToSave.services.cards = [
                  ...DEFAULT_SERVICES_CONTENT.cards,
                ];
              }

              // Extrair card ID e field do key (ex: card1_title -> cardId=1, field=title)
              const match = item.key.match(/card(\d+)_(.+)/);
              if (match) {
                const cardId = parseInt(match[1]);
                const field = match[2];
                const cardIndex = cardId - 1; // Array é 0-indexed

                const cardsList = contentToSave.services!.cards!;
                if (cardsList[cardIndex]) {
                  const card = cardsList[cardIndex];
                  if (field === "title") {
                    card.title = valueToSave;
                  } else if (field === "description") {
                    card.description = valueToSave;
                  } else if (field === "imageUrl") {
                    card.imageUrl = valueToSave;
                  }
                }
              }
            }
          } else if (item.section === "clinic") {
            if (!contentToSave.clinic) contentToSave.clinic = {};

            // Para fields gerais da seção
            if (item.key === "title" || item.key === "description") {
              contentToSave.clinic[item.key] = valueToSave;
            }

            // Para campos das imagens
            if (item.key.startsWith("image")) {
              if (!contentToSave.clinic?.images) {
                if (!contentToSave.clinic) contentToSave.clinic = {};
                contentToSave.clinic.images = [
                  ...DEFAULT_CLINIC_CONTENT.images,
                ];
              }

              // Extrair image ID e field do key (ex: image1_originalTitle -> imageId=1, field=originalTitle)
              const match = item.key.match(/image(\d+)_(.+)/);
              if (match) {
                const imageId = parseInt(match[1]);
                const field = match[2];
                const imageIndex = imageId - 1; // Array é 0-indexed

                const imagesList = contentToSave.clinic.images;
                if (imagesList[imageIndex]) {
                  const image = imagesList[imageIndex];
                  if (field === "originalTitle") {
                    image.originalTitle = valueToSave;
                  } else if (field === "originalAlt") {
                    image.originalAlt = valueToSave;
                  } else if (field === "description") {
                    image.description = valueToSave;
                  } else if (field === "original") {
                    image.original = valueToSave;
                  }
                }
              }
            }
          } else if (item.section === "about") {
            if (!contentToSave.about) contentToSave.about = {};
            contentToSave.about[item.key] = valueToSave;
          } else if (item.section === "social") {
            if (!contentToSave.social) contentToSave.social = {};
            
            // Para fields gerais da seção
            if (item.key === "title" || item.key === "description") {
              contentToSave.social[item.key] = valueToSave;
            }
            
            // Para campos das redes sociais
            if (item.key.startsWith("network")) {
              if (!contentToSave.social?.networks) {
                if (!contentToSave.social) contentToSave.social = {};
                contentToSave.social.networks = [...DEFAULT_ABOUT_CONTENT.socialMedia.networks];
              }
              
              // Extrair network ID e field do key (ex: networkfacebook_url -> networkId=facebook, field=url)
              const match = item.key.match(/network([^_]+)_(.+)/);
              if (match) {
                const networkId = match[1];
                const field = match[2];
                
                const socialNetworksList = contentToSave.social.networks;
                const networkIndex = socialNetworksList.findIndex((n: NetworkItem) => n.id === networkId);
                
                if (networkIndex !== -1) {
                  const network = socialNetworksList[networkIndex];
                  if (field === "enabled") {
                    network.enabled = valueToSave === "true";
                  } else if (field === "url") {
                    network.url = valueToSave;
                  } else if (field === "name") {
                    network.name = valueToSave;
                  }
                }
              }
            }
          }
        });
      });

      // Salvar no banco
      const response = await fetch(`/api/admin/content/${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    if (
      !confirm(
        "Tem certeza que deseja restaurar o conteúdo para os valores padrão? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setResetting(true);
    setError(null);

    try {
      // Chamar endpoint DELETE para resetar
      const response = await fetch(`/api/admin/content/${page}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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

    // Special handling for enabled fields - render as switch
    if (item.key.includes('_enabled')) {
      const isEnabled = currentValue === "true";
      return (
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleContentChange(item.id, isEnabled ? "false" : "true")}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
              isEnabled 
                ? 'bg-rose-600 dark:bg-rose-500' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${
            isEnabled 
              ? 'text-rose-600 dark:text-rose-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {isEnabled ? 'Sim' : 'Não'}
          </span>
          {changes[item.id] !== undefined && (
            <span className="text-xs text-orange-600 dark:text-orange-400">
              (alterado)
            </span>
          )}
        </div>
      );
    }

    switch (item.type) {
      case "title":
      case "text":
        const isHeroField = item.section === "hero";
        const isWelcomeField = item.section === "welcome";
        const isServicesField = item.section === "services";
        const isClinicField = item.section === "clinic";
        const isAboutField = item.section === "about";
        const isSocialField = item.section === "social";
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
        } else if (isServicesField) {
          if (item.key === "title") {
            maxLengthForField = DEFAULT_SERVICES_CONTENT.maxCharacters.title;
            fieldName = "Services Title";
          } else if (item.key === "description") {
            maxLengthForField =
              DEFAULT_SERVICES_CONTENT.maxCharacters.description;
            fieldName = "Services Description";
          } else if (item.key.includes("_title")) {
            maxLengthForField =
              DEFAULT_SERVICES_CONTENT.maxCharacters.cardTitle;
            fieldName = "Card Title";
          } else if (item.key.includes("_description")) {
            maxLengthForField =
              DEFAULT_SERVICES_CONTENT.maxCharacters.cardDescription;
            fieldName = "Card Description";
          }
        } else if (isClinicField) {
          if (item.key === "title") {
            maxLengthForField = DEFAULT_CLINIC_CONTENT.maxCharacters.title;
            fieldName = "Clinic Title";
          } else if (item.key === "description") {
            maxLengthForField =
              DEFAULT_CLINIC_CONTENT.maxCharacters.description;
            fieldName = "Clinic Description";
          } else if (item.key.includes("_originalTitle")) {
            maxLengthForField = DEFAULT_CLINIC_CONTENT.maxCharacters.imageTitle;
            fieldName = "Image Title";
          } else if (item.key.includes("_description")) {
            maxLengthForField =
              DEFAULT_CLINIC_CONTENT.maxCharacters.imageDescription;
            fieldName = "Image Description";
          } else if (item.key.includes("_originalAlt")) {
            maxLengthForField = DEFAULT_CLINIC_CONTENT.maxCharacters.imageAlt;
            fieldName = "Image Alt Text";
          }
        } else if (isAboutField) {
          if (item.key === "title") {
            maxLengthForField = DEFAULT_ABOUT_CONTENT.maxCharacters.title;
            fieldName = "About Title";
          } else if (item.key === "subtitle") {
            maxLengthForField = DEFAULT_ABOUT_CONTENT.maxCharacters.subtitle;
            fieldName = "About Subtitle";
          }
        } else if (isSocialField) {
          if (item.key === "title") {
            maxLengthForField = DEFAULT_ABOUT_CONTENT.maxCharacters.socialTitle;
            fieldName = "Social Title";
          } else if (item.key === "description") {
            maxLengthForField = DEFAULT_ABOUT_CONTENT.maxCharacters.socialDescription;
            fieldName = "Social Description";
          } else if (item.key.includes("_url")) {
            maxLengthForField = DEFAULT_ABOUT_CONTENT.maxCharacters.socialUrl;
            fieldName = "Social URL";
          }
        }

        const currentLengthText = currentValue.length;
        const isOverLimitText =
          (isHeroField || isWelcomeField || isServicesField || isClinicField || isAboutField || isSocialField) &&
          currentLengthText > maxLengthForField;

        return (
          <div className="space-y-2">
            <input
              type="text"
              value={currentValue}
              onChange={(e) => {
                if (
                  (isHeroField ||
                    isWelcomeField ||
                    isServicesField ||
                    isClinicField) &&
                  e.target.value.length <= maxLengthForField
                ) {
                  handleContentChange(item.id, e.target.value);
                } else if (
                  !isHeroField &&
                  !isWelcomeField &&
                  !isServicesField &&
                  !isClinicField
                ) {
                  handleContentChange(item.id, e.target.value);
                }
              }}
              placeholder={item.placeholder}
              maxLength={
                isHeroField ||
                isWelcomeField ||
                isServicesField ||
                isClinicField
                  ? maxLengthForField
                  : undefined
              }
              className={`w-full p-3 border rounded-md bg-white dark:bg-gray-800 text-foreground ${
                isOverLimitText
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
            {(isHeroField ||
              isWelcomeField ||
              isServicesField ||
              isClinicField) && (
              <div className="flex justify-between items-center text-sm">
                <span
                  className={`${isOverLimitText ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}
                >
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
        const isHeroMainText =
          item.key === "mainText" && item.section === "hero";
        const maxLength = isHeroMainText
          ? DEFAULT_HERO_CONTENT.maxCharacters.mainText
          : 1000;
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
                <span
                  className={`${isOverLimitDesc ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}
                >
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
        const isWelcomeContent =
          item.key === "content" && item.section === "welcome";
        const maxLengthHtml = isWelcomeContent
          ? DEFAULT_WELCOME_CONTENT.maxCharacters.content
          : 5000;
        const currentLengthHtml = currentValue.length;
        const isOverLimitHtml =
          isWelcomeContent && currentLengthHtml > maxLengthHtml;

        return (
          <div className="space-y-2">
            <textarea
              value={currentValue}
              onChange={(e) => {
                if (
                  isWelcomeContent &&
                  e.target.value.length <= maxLengthHtml
                ) {
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
                <span
                  className={`${isOverLimitHtml ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}`}
                >
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
                : "Suporte a HTML básico: <p>, <br>, <strong>, <em>"}
            </p>
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={currentValue}
                onChange={(e) => handleContentChange(item.id, e.target.value)}
                placeholder="URL da imagem"
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-foreground"
              />
              <button
                type="button"
                onClick={() => openImageSelector(item.id)}
                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Selecionar</span>
              </button>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href="/admin/media"
                className="inline-flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Gerenciar imagens</span>
              </Link>
              <span>ou digite uma URL personalizada</span>
            </div>
            {currentValue && (
              <div className="mt-2">
                <div className="relative inline-block">
                  <Image
                    src={currentValue}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="max-w-xs h-auto rounded border shadow-sm"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                    }}
                  />
                </div>
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
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </Link>

          <button
            onClick={resetToDefaults}
            disabled={resetting || saving}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-[var(--destructive)] text-[var(--destructive)] rounded-md hover:bg-white/10 hover:font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
            <span>
              {saving
                ? "Salvando..."
                : Object.keys(changes).length > 0
                  ? "Salvar Alterações"
                  : "Salvar"}
            </span>
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

      {/* Image Selector Modal */}
      <ImageSelector
        isOpen={imageSelectorOpen}
        onClose={() => {
          setImageSelectorOpen(false);
          setCurrentImageField(null);
        }}
        onSelect={handleImageSelect}
        title="Selecionar Imagem"
      />
    </div>
  );
};
