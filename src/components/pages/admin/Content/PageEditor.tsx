// src/components/pages/admin/Content/PageEditor.tsx
"use client";

import { AdminCard } from "@/components/shared/cards/BaseCard";
import { ImageSelector } from "@/components/shared/media";
import { handleAuthError } from "@/lib/auth";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_AGENDAMENTO_CONTENT,
  DEFAULT_AVALIACOES_CONTENT,
  DEFAULT_CLINIC_CONTENT,
  DEFAULT_CONTACT_CONTENT,
  DEFAULT_DIVISORIAS_CONTENT,
  DEFAULT_HERO_CONTENT,
  DEFAULT_SERVICES_CONTENT,
  DEFAULT_TERAPIAS_CONTENT,
  DEFAULT_WELCOME_CONTENT,
} from "@/utils/default-content";
import { ClinicImagesManager, type ClinicImage } from "./ClinicImagesManager";
import { CardsManager, type CardData } from "@/components/shared/admin/CardsManager";
import {
  ArrowLeft,
  Eye,
  ImageIcon,
  RotateCcw,
  Save,
  Upload,
  X,
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


interface NetworkItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
}

interface ModalityItem {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  href: string;
  order: number;
  active: boolean;
}

// interface InfoCardItem {
//   id: number;
//   title: string;
//   description: string;
//   active: boolean;
// }

interface AgendamentoCardItem {
  id: number;
  title: string;
  content: string;
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
  terapias?: {
    title?: string;
    description?: string;
    therapyModalities?: ModalityItem[];
  };
  avaliacoes?: {
    title?: string;
    description?: string;
    testModalities?: ModalityItem[];
  };
  contact?: {
    psychologist?: typeof DEFAULT_CONTACT_CONTENT.psychologist;
    contact?: typeof DEFAULT_CONTACT_CONTENT.contact;
    clinic?: typeof DEFAULT_CONTACT_CONTENT.clinic;
    page?: typeof DEFAULT_CONTACT_CONTENT.page;
  };
  agendamento?: {
    title?: string;
    description?: string;
    infoCards?: AgendamentoCardItem[];
  };
  divisoria_1?: {
    text?: string;
    backgroundImage?: string;
  };
  divisoria_2?: {
    text?: string;
    backgroundImage?: string;
  };
  divisoria_3?: {
    text?: string;
    backgroundImage?: string;
  };
  divisoria_4?: {
    text?: string;
    backgroundImage?: string;
  };
  divisoria_5?: {
    text?: string;
    backgroundImage?: string;
  };
  divisoria_6?: {
    text?: string;
    backgroundImage?: string;
  };
  divisorias?: Record<string, {
    text?: string;
    backgroundImage?: string;
  }>;
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
  const [editingClinicImages, setEditingClinicImages] = useState(false);
  const [clinicData, setClinicData] = useState<{
    title: string;
    description: string;
    images: ClinicImage[];
  } | null>(null);
  const [editingCards, setEditingCards] = useState<'services' | 'terapias' | 'avaliacoes' | null>(null);
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const [savedContent, setSavedContent] = useState<any>(null);

  const loadPageContent = useCallback(async () => {
    try {
      setError(null);

      // Buscar conteúdo salvo no banco
      const response = await fetch(`/api/admin/content/${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      let savedContent = null;

      if (response.ok) {
        const data = await response.json();
        savedContent = data.content;
        setSavedContent(savedContent);
      } else {
        console.error(`❌ PageEditor: Erro ao carregar conteúdo:`, response.status);
      }

      const sections = getPageSections(page, savedContent);
      console.log(`📋 PageEditor gerou seções para ${page}:`, sections);
      
      // Debug específico para campos de imagem
      if (page === "terapias" || page === "avaliacoes") {
        sections.forEach((section, sIndex) => {
          section.items.forEach((item, iIndex) => {
            if (item.type === "image") {
              console.log(`🖼️ Campo de imagem encontrado em ${page} - Seção ${sIndex}, Item ${iIndex}:`, {
                id: item.id,
                key: item.key,
                label: item.label,
                value: item.value
              });
            }
          });
        });
      }
      
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
        const welcomeProfileImage =
          savedContent?.welcome?.profileImage || DEFAULT_WELCOME_CONTENT.profileImage;

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
        let clinicImages: ClinicImage[] = [];
        if (savedContent?.clinic?.images) {
          try {
            const savedImages =
              typeof savedContent.clinic.images === "string"
                ? JSON.parse(savedContent.clinic.images)
                : savedContent.clinic.images;
            
            // Use apenas as imagens salvas, sem auto-expand
            clinicImages = savedImages;
          } catch {
            // Se há erro no parse, começar com array vazio
            clinicImages = [];
          }
        }

        // Update clinic data state for ClinicImagesManager
        setClinicData({
          title: clinicTitle,
          description: clinicDescription,
          images: clinicImages,
        });

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
              {
                id: 100,
                page: "home",
                section: "welcome",
                key: "profileImage",
                type: "image",
                value: welcomeProfileImage,
                label: "Foto do Profissional",
                placeholder: "Selecione uma imagem para o perfil...",
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
              "Gerencie o título, descrição e galeria de imagens da clínica através do botão 'Gerenciar Galeria'.",
            items: [],
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

      case "terapias":
        // Usar conteúdo salvo se existir, senão usar padrão
        const terapiasTitle = savedContent?.terapias?.title || DEFAULT_TERAPIAS_CONTENT.title;
        const terapiasDescription = savedContent?.terapias?.description || DEFAULT_TERAPIAS_CONTENT.description;
        
        // Parse das modalidades se vier como string JSON
        let terapiasModalities = DEFAULT_TERAPIAS_CONTENT.therapyModalities;
        if (savedContent?.terapias?.therapyModalities) {
          try {
            terapiasModalities = typeof savedContent.terapias.therapyModalities === 'string' 
              ? JSON.parse(savedContent.terapias.therapyModalities)
              : savedContent.terapias.therapyModalities;
          } catch {
            terapiasModalities = DEFAULT_TERAPIAS_CONTENT.therapyModalities;
          }
        }

        return [
          {
            name: "Informações Gerais",
            description: "Título e descrição principal da página de terapias",
            items: [
              {
                id: 500,
                page: "terapias",
                section: "terapias",
                key: "title",
                type: "title",
                value: terapiasTitle,
                label: "Título da Página",
                placeholder: "Digite o título principal...",
              },
              {
                id: 501,
                page: "terapias",
                section: "terapias",
                key: "description",
                type: "text",
                value: terapiasDescription,
                label: "Descrição da Página",
                placeholder: "Digite a descrição principal...",
              },
            ],
          },
          {
            name: "Modalidades de Terapia",
            description: "Configure as modalidades de atendimento oferecidas",
            items: [
              // Modalidades individuais
              ...terapiasModalities.map((modality: ModalityItem, index: number) => [
                {
                  id: 502 + (index * 5), // 502, 507, 512
                  page: "terapias",
                  section: "modalities",
                  key: `modality${modality.id}_title`,
                  type: "text" as const,
                  value: modality.title,
                  label: `Modalidade ${modality.id} - Título`,
                  placeholder: `Título da modalidade ${modality.id}...`,
                },
                {
                  id: 503 + (index * 5), // 503, 508, 513
                  page: "terapias",
                  section: "modalities",
                  key: `modality${modality.id}_description`,
                  type: "text" as const,
                  value: modality.description,
                  label: `Modalidade ${modality.id} - Descrição`,
                  placeholder: `Descrição da modalidade ${modality.id}...`,
                },
                {
                  id: 504 + (index * 5), // 504, 509, 514
                  page: "terapias",
                  section: "modalities",
                  key: `modality${modality.id}_imageUrl`,
                  type: "image" as const,
                  value: modality.imageUrl,
                  label: `Modalidade ${modality.id} - Imagem`,
                  placeholder: `URL da imagem da modalidade ${modality.id}...`,
                },
                {
                  id: 505 + (index * 5), // 505, 510, 515
                  page: "terapias",
                  section: "modalities",
                  key: `modality${modality.id}_href`,
                  type: "text" as const,
                  value: modality.href,
                  label: `Modalidade ${modality.id} - Link`,
                  placeholder: `Link da modalidade ${modality.id} (ex: /presencial)...`,
                },
                {
                  id: 506 + (index * 5), // 506, 511, 516
                  page: "terapias",
                  section: "modalities",
                  key: `modality${modality.id}_active`,
                  type: "text" as const, // Will be handled as switch in render
                  value: modality.active ? "true" : "false",
                  label: `Modalidade ${modality.id} - Ativo`,
                  placeholder: "true/false",
                },
              ]).flat(),
            ],
          },
        ];

      case "avaliacoes":
        // Usar conteúdo salvo se existir, senão usar padrão
        const avaliacoesTitle = savedContent?.avaliacoes?.title || DEFAULT_AVALIACOES_CONTENT.title;
        const avaliacoesDescription = savedContent?.avaliacoes?.description || DEFAULT_AVALIACOES_CONTENT.description;
        
        // Parse das modalidades se vier como string JSON
        let avaliacoesTests = DEFAULT_AVALIACOES_CONTENT.testModalities;
        if (savedContent?.avaliacoes?.testModalities) {
          try {
            avaliacoesTests = typeof savedContent.avaliacoes.testModalities === 'string' 
              ? JSON.parse(savedContent.avaliacoes.testModalities)
              : savedContent.avaliacoes.testModalities;
          } catch (error) {
            console.error('Erro ao fazer parse das modalidades de avaliação:', error);
          }
        }
        
        return [
          {
            name: "Informações da Página",
            description: "Configure o cabeçalho da página de avaliações",
            items: [
              {
                id: 600,
                page: "avaliacoes",
                section: "avaliacoes",
                key: "title",
                type: "title",
                value: avaliacoesTitle,
                label: "Título da Página",
                placeholder: "Digite o título principal...",
              },
              {
                id: 601,
                page: "avaliacoes",
                section: "avaliacoes",
                key: "description",
                type: "text",
                value: avaliacoesDescription,
                label: "Descrição da Página",
                placeholder: "Digite a descrição principal...",
              },
            ],
          },
          {
            name: "Testes Psicológicos",
            description: "Configure os testes psicológicos oferecidos",
            items: [
              // Testes individuais
              ...avaliacoesTests.map((test: ModalityItem, index: number) => [
                {
                  id: 602 + (index * 5), // 602, 607, 612
                  page: "avaliacoes",
                  section: "tests",
                  key: `test${test.id}_title`,
                  type: "text" as const,
                  value: test.title,
                  label: `Teste ${test.id} - Título`,
                  placeholder: `Título do teste ${test.id}...`,
                },
                {
                  id: 603 + (index * 5), // 603, 608, 613
                  page: "avaliacoes",
                  section: "tests",
                  key: `test${test.id}_description`,
                  type: "text" as const,
                  value: test.description,
                  label: `Teste ${test.id} - Descrição`,
                  placeholder: `Descrição do teste ${test.id}...`,
                },
                {
                  id: 604 + (index * 5), // 604, 609, 614
                  page: "avaliacoes",
                  section: "tests",
                  key: `test${test.id}_imageUrl`,
                  type: "image" as const,
                  value: test.imageUrl,
                  label: `Teste ${test.id} - Imagem`,
                  placeholder: `URL da imagem do teste ${test.id}...`,
                },
                {
                  id: 605 + (index * 5), // 605, 610, 615
                  page: "avaliacoes",
                  section: "tests",
                  key: `test${test.id}_href`,
                  type: "text" as const,
                  value: test.href,
                  label: `Teste ${test.id} - Link`,
                  placeholder: `Link do teste ${test.id} (ex: /wais-iii)...`,
                },
                {
                  id: 606 + (index * 5), // 606, 611, 616
                  page: "avaliacoes",
                  section: "tests",
                  key: `test${test.id}_active`,
                  type: "text" as const, // Will be handled as switch in render
                  value: test.active ? "true" : "false",
                  label: `Teste ${test.id} - Ativo`,
                  placeholder: "true/false",
                },
              ]).flat(),
            ],
          },
        ];

      case "contact":
        // Usar conteúdo salvo se existir, senão usar padrão
        const contactData = savedContent?.contact || {};
        const contactPsychologist = (typeof contactData.psychologist === 'object' ? contactData.psychologist : DEFAULT_CONTACT_CONTENT.psychologist) as typeof DEFAULT_CONTACT_CONTENT.psychologist;
        const contactContact = (typeof contactData.contact === 'object' ? contactData.contact : DEFAULT_CONTACT_CONTENT.contact) as typeof DEFAULT_CONTACT_CONTENT.contact;
        const contactClinic = (typeof contactData.clinic === 'object' ? contactData.clinic : DEFAULT_CONTACT_CONTENT.clinic) as typeof DEFAULT_CONTACT_CONTENT.clinic;
        const contactPage = (typeof contactData.page === 'object' ? contactData.page : DEFAULT_CONTACT_CONTENT.page) as typeof DEFAULT_CONTACT_CONTENT.page;
        
        return [
          {
            name: "Informações do Psicólogo",
            description: "Configure informações profissionais que serão usadas em todo o site",
            items: [
              {
                id: 700,
                page: "contact",
                section: "psychologist",
                key: "name",
                type: "text",
                value: contactPsychologist.name,
                label: "Nome do Psicólogo",
                placeholder: "Nome completo do profissional",
              },
              {
                id: 701,
                page: "contact", 
                section: "psychologist",
                key: "crp",
                type: "text",
                value: contactPsychologist.crp,
                label: "CRP",
                placeholder: "Ex: CRP 06/174807",
              },
              {
                id: 702,
                page: "contact",
                section: "psychologist", 
                key: "title",
                type: "text",
                value: contactPsychologist.title,
                label: "Título Profissional",
                placeholder: "Ex: Psicólogo Clínico",
              },
              {
                id: 703,
                page: "contact",
                section: "psychologist",
                key: "approach",
                type: "text", 
                value: contactPsychologist.approach,
                label: "Abordagem Terapêutica",
                placeholder: "Ex: Análise do Comportamento",
              },
            ],
          },
          {
            name: "Informações de Contato",
            description: "Configure contatos que serão usados em todo o site (Footer, WhatsApp, etc.)",
            items: [
              {
                id: 704,
                page: "contact",
                section: "contact",
                key: "whatsapp",
                type: "text",
                value: contactContact.whatsapp,
                label: "WhatsApp (apenas números)",
                placeholder: "Ex: 5515997646421",
              },
              {
                id: 705,
                page: "contact",
                section: "contact", 
                key: "phoneDisplay",
                type: "text",
                value: contactContact.phoneDisplay,
                label: "Telefone para Exibição",
                placeholder: "Ex: +55 (15) 99764-6421",
              },
              {
                id: 706,
                page: "contact",
                section: "contact",
                key: "email",
                type: "text",
                value: contactContact.email,
                label: "E-mail",
                placeholder: "email@exemplo.com",
              },
              {
                id: 707,
                page: "contact",
                section: "contact",
                key: "instagram",
                type: "text",
                value: contactContact.social.instagram,
                label: "Instagram",
                placeholder: "@usuario",
              },
            ],
          },
          {
            name: "Informações do Consultório", 
            description: "Configure endereço e horários do consultório",
            items: [
              {
                id: 708,
                page: "contact",
                section: "clinic",
                key: "name",
                type: "text",
                value: contactClinic.name,
                label: "Nome do Consultório",
                placeholder: "Nome da clínica/consultório",
              },
              {
                id: 709,
                page: "contact",
                section: "clinic",
                key: "street",
                type: "text", 
                value: contactClinic.address.street,
                label: "Rua e Número",
                placeholder: "Ex: Rua das Flores, 123",
              },
              {
                id: 710,
                page: "contact",
                section: "clinic",
                key: "neighborhood",
                type: "text",
                value: contactClinic.address.neighborhood,
                label: "Bairro",
                placeholder: "Nome do bairro",
              },
              {
                id: 711,
                page: "contact",
                section: "clinic",
                key: "city",
                type: "text",
                value: contactClinic.address.city,
                label: "Cidade",
                placeholder: "Nome da cidade",
              },
              {
                id: 712,
                page: "contact",
                section: "clinic",
                key: "state",
                type: "text",
                value: contactClinic.address.state,
                label: "Estado",
                placeholder: "Ex: SP",
              },
              {
                id: 713,
                page: "contact",
                section: "clinic",
                key: "zip",
                type: "text",
                value: contactClinic.address.zip,
                label: "CEP",
                placeholder: "00000-000",
              },
              {
                id: 714,
                page: "contact", 
                section: "clinic",
                key: "weekdays",
                type: "text",
                value: contactClinic.hours.weekdays,
                label: "Dias de Atendimento",
                placeholder: "Ex: Segunda à Sexta",
              },
              {
                id: 715,
                page: "contact",
                section: "clinic",
                key: "start",
                type: "text",
                value: contactClinic.hours.start,
                label: "Hora de Início",
                placeholder: "Ex: 8:00",
              },
              {
                id: 716,
                page: "contact",
                section: "clinic", 
                key: "end",
                type: "text",
                value: contactClinic.hours.end,
                label: "Hora de Término",
                placeholder: "Ex: 21:00",
              },
            ],
          },
          {
            name: "Página de Contato",
            description: "Configure o conteúdo específico da página de contato", 
            items: [
              {
                id: 717,
                page: "contact",
                section: "page",
                key: "title",
                type: "title",
                value: contactPage.title,
                label: "Título da Página",
                placeholder: "Título principal da página",
              },
              {
                id: 718,
                page: "contact",
                section: "page",
                key: "description",
                type: "text",
                value: contactPage.description,
                label: "Descrição da Página",
                placeholder: "Descrição que aparece no topo da página",
              },
            ],
          },
        ];

      case "agendamento":
        // Usar conteúdo salvo se existir, senão usar padrão
        const agendamentoTitle = savedContent?.agendamento?.title || DEFAULT_AGENDAMENTO_CONTENT.title;
        const agendamentoDescription = savedContent?.agendamento?.description || DEFAULT_AGENDAMENTO_CONTENT.description;
        
        // Parse dos cards se vier como string JSON
        let agendamentoCards = DEFAULT_AGENDAMENTO_CONTENT.infoCards;
        if (savedContent?.agendamento?.infoCards) {
          try {
            agendamentoCards = typeof savedContent.agendamento.infoCards === 'string' 
              ? JSON.parse(savedContent.agendamento.infoCards)
              : savedContent.agendamento.infoCards;
          } catch (error) {
            console.error('Erro ao fazer parse dos cards de agendamento:', error);
          }
        }
        
        return [
          {
            name: "Informações da Página",
            description: "Configure o cabeçalho da página de agendamento",
            items: [
              {
                id: 800,
                page: "agendamento",
                section: "header",
                key: "title",
                type: "title",
                value: agendamentoTitle,
                label: "Título da Página",
                placeholder: "Digite o título principal...",
              },
              {
                id: 801,
                page: "agendamento",
                section: "header",
                key: "description",
                type: "text",
                value: agendamentoDescription,
                label: "Descrição da Página",
                placeholder: "Digite a descrição principal...",
              },
            ],
          },
          {
            name: "Cards Informativos",
            description: "Configure os cards informativos do agendamento",
            items: [
              // Cards individuais
              ...agendamentoCards.map((card: AgendamentoCardItem, index: number) => [
                {
                  id: 802 + (index * 3), // 802, 805, 808
                  page: "agendamento",
                  section: `card_${card.id}`,
                  key: "title",
                  type: "text" as const,
                  value: card.title,
                  label: `Card ${card.id} - Título`,
                  placeholder: `Título do card ${card.id}...`,
                },
                {
                  id: 803 + (index * 3), // 803, 806, 809
                  page: "agendamento",
                  section: `card_${card.id}`,
                  key: "content",
                  type: "text" as const,
                  value: card.content,
                  label: `Card ${card.id} - Conteúdo`,
                  placeholder: `Conteúdo do card ${card.id}...`,
                },
              ]).flat(),
            ],
          },
        ];

      case "divisorias":
        // Usar conteúdo salvo se existir, senão usar padrão
        return [
          {
            name: "Divisória 1",
            description: "Primeira divisória - Horários de atendimento",
            items: [
              {
                id: 900,
                page: "divisorias",
                section: "divisoria_1",
                key: "text",
                type: "text",
                value: savedContent?.divisoria_1?.text || DEFAULT_DIVISORIAS_CONTENT.divisoria_1.text,
                label: "Texto da Divisória",
                placeholder: "Digite o texto que aparecerá na primeira divisória...",
              },
              {
                id: 950,
                page: "divisorias",
                section: "divisoria_1",
                key: "backgroundImage",
                type: "image",
                value: savedContent?.divisoria_1?.backgroundImage || DEFAULT_DIVISORIAS_CONTENT.divisoria_1.backgroundImage,
                label: "Imagem de Fundo",
                placeholder: "URL da imagem de fundo...",
              },
            ],
          },
          {
            name: "Divisória 2",
            description: "Segunda divisória - Plantão psicológico",
            items: [
              {
                id: 901,
                page: "divisorias",
                section: "divisoria_2",
                key: "text",
                type: "text",
                value: savedContent?.divisoria_2?.text || DEFAULT_DIVISORIAS_CONTENT.divisoria_2.text,
                label: "Texto da Divisória",
                placeholder: "Digite o texto que aparecerá na segunda divisória...",
              },
              {
                id: 951,
                page: "divisorias",
                section: "divisoria_2",
                key: "backgroundImage",
                type: "image",
                value: savedContent?.divisoria_2?.backgroundImage || DEFAULT_DIVISORIAS_CONTENT.divisoria_2.backgroundImage,
                label: "Imagem de Fundo",
                placeholder: "URL da imagem de fundo...",
              },
            ],
          },
          {
            name: "Divisória 3",
            description: "Terceira divisória - Psicoterapia online",
            items: [
              {
                id: 902,
                page: "divisorias",
                section: "divisoria_3",
                key: "text",
                type: "text",
                value: savedContent?.divisoria_3?.text || DEFAULT_DIVISORIAS_CONTENT.divisoria_3.text,
                label: "Texto da Divisória",
                placeholder: "Digite o texto que aparecerá na terceira divisória...",
              },
              {
                id: 952,
                page: "divisorias",
                section: "divisoria_3",
                key: "backgroundImage",
                type: "image",
                value: savedContent?.divisoria_3?.backgroundImage || DEFAULT_DIVISORIAS_CONTENT.divisoria_3.backgroundImage,
                label: "Imagem de Fundo",
                placeholder: "URL da imagem de fundo...",
              },
            ],
          },
          {
            name: "Divisória 4",
            description: "Quarta divisória - Ambiente acolhedor",
            items: [
              {
                id: 903,
                page: "divisorias",
                section: "divisoria_4",
                key: "text",
                type: "text",
                value: savedContent?.divisoria_4?.text || DEFAULT_DIVISORIAS_CONTENT.divisoria_4.text,
                label: "Texto da Divisória",
                placeholder: "Digite o texto que aparecerá na quarta divisória...",
              },
              {
                id: 953,
                page: "divisorias",
                section: "divisoria_4",
                key: "backgroundImage",
                type: "image",
                value: savedContent?.divisoria_4?.backgroundImage || DEFAULT_DIVISORIAS_CONTENT.divisoria_4.backgroundImage,
                label: "Imagem de Fundo",
                placeholder: "URL da imagem de fundo...",
              },
            ],
          },
          {
            name: "Divisória 5", 
            description: "Quinta divisória - Primeira consulta",
            items: [
              {
                id: 904,
                page: "divisorias",
                section: "divisoria_5",
                key: "text",
                type: "text",
                value: savedContent?.divisoria_5?.text || DEFAULT_DIVISORIAS_CONTENT.divisoria_5.text,
                label: "Texto da Divisória",
                placeholder: "Digite o texto que aparecerá na quinta divisória...",
              },
              {
                id: 954,
                page: "divisorias",
                section: "divisoria_5",
                key: "backgroundImage",
                type: "image",
                value: savedContent?.divisoria_5?.backgroundImage || DEFAULT_DIVISORIAS_CONTENT.divisoria_5.backgroundImage,
                label: "Imagem de Fundo",
                placeholder: "URL da imagem de fundo...",
              },
            ],
          },
          {
            name: "Divisória 6",
            description: "Sexta divisória - Acompanhamento contínuo",
            items: [
              {
                id: 905,
                page: "divisorias",
                section: "divisoria_6",
                key: "text",
                type: "text",
                value: savedContent?.divisoria_6?.text || DEFAULT_DIVISORIAS_CONTENT.divisoria_6.text,
                label: "Texto da Divisória",
                placeholder: "Digite o texto que aparecerá na sexta divisória...",
              },
              {
                id: 955,
                page: "divisorias",
                section: "divisoria_6",
                key: "backgroundImage",
                type: "image",
                value: savedContent?.divisoria_6?.backgroundImage || DEFAULT_DIVISORIAS_CONTENT.divisoria_6.backgroundImage,
                label: "Imagem de Fundo",
                placeholder: "URL da imagem de fundo...",
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


  const saveSectionChanges = async (sectionName: string) => {
    console.log(`💾 PageEditor: Salvando apenas seção ${sectionName}`);

    // Find items from this section that have changes
    const sectionItems = sections
      .flatMap(s => s.items)
      .filter(item => item.section === sectionName && changes[item.id] !== undefined);

    if (sectionItems.length === 0) {
      alert(`Não há alterações para salvar na seção ${sectionName}.`);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Start with existing saved content
      const contentToSave: SavedContent = { ...savedContent };

      // Update only items from this section
      sectionItems.forEach((item) => {
        const valueToSave = changes[item.id];

        if (item.section === "hero") {
          if (!contentToSave.hero) contentToSave.hero = {};
          contentToSave.hero[item.key] = valueToSave;
        } else if (item.section === "welcome") {
          if (!contentToSave.welcome) contentToSave.welcome = {};
          contentToSave.welcome[item.key] = valueToSave;
        } else if (item.section === "services") {
          if (!contentToSave.services) contentToSave.services = {};
          if (item.key === "title" || item.key === "description") {
            contentToSave.services[item.key] = valueToSave;
          }
        } else if (item.section === "about") {
          if (!contentToSave.about) contentToSave.about = {};
          contentToSave.about[item.key] = valueToSave;
        } else if (item.section === "social") {
          if (!contentToSave.social) contentToSave.social = {};
          // @ts-expect-error - Dynamic key assignment for social section fields
          contentToSave.social[item.key] = valueToSave;
        } else if (item.section === "terapias") {
          if (!contentToSave.terapias) contentToSave.terapias = {};
          if (item.key === "title" || item.key === "description") {
            contentToSave.terapias[item.key] = valueToSave;
          }
        } else if (item.section === "avaliacoes") {
          if (!contentToSave.avaliacoes) contentToSave.avaliacoes = {};
          if (item.key === "title" || item.key === "description") {
            contentToSave.avaliacoes[item.key] = valueToSave;
          }
        } else if (item.section === "psychologist") {
          if (!contentToSave.contact) contentToSave.contact = {};
          if (!contentToSave.contact.psychologist) contentToSave.contact.psychologist = { ...DEFAULT_CONTACT_CONTENT.psychologist };
          // @ts-expect-error - Complex contact type handling
          contentToSave.contact.psychologist[item.key as keyof typeof DEFAULT_CONTACT_CONTENT.psychologist] = valueToSave as unknown;
        } else if (item.section === "contact" && item.page === "contact") {
          if (!contentToSave.contact) contentToSave.contact = {};
          if (!contentToSave.contact.contact) contentToSave.contact.contact = { ...DEFAULT_CONTACT_CONTENT.contact };

          if (item.key === "instagram") {
            if (!contentToSave.contact.contact.social) contentToSave.contact.contact.social = { ...DEFAULT_CONTACT_CONTENT.contact.social };
            contentToSave.contact.contact.social.instagram = valueToSave;
          } else if (item.key === "linkedin") {
            if (!contentToSave.contact.contact.social) contentToSave.contact.contact.social = { ...DEFAULT_CONTACT_CONTENT.contact.social };
            contentToSave.contact.contact.social.linkedin = valueToSave;
          } else {
            // @ts-expect-error - Complex contact type handling
            contentToSave.contact.contact[item.key as keyof typeof DEFAULT_CONTACT_CONTENT.contact] = valueToSave as unknown;
          }
        } else if (item.section === "clinic" && item.page === "contact") {
          if (!contentToSave.contact) contentToSave.contact = {};
          if (!contentToSave.contact.clinic) contentToSave.contact.clinic = { ...DEFAULT_CONTACT_CONTENT.clinic };

          if (['street', 'neighborhood', 'city', 'state', 'zip'].includes(item.key)) {
            if (!contentToSave.contact.clinic.address) contentToSave.contact.clinic.address = { ...DEFAULT_CONTACT_CONTENT.clinic.address };
            // @ts-expect-error - Complex contact type handling
            contentToSave.contact.clinic.address[item.key as keyof typeof DEFAULT_CONTACT_CONTENT.clinic.address] = valueToSave as unknown;
          } else if (['weekdays', 'start', 'end', 'note', 'ageRestriction'].includes(item.key)) {
            if (!contentToSave.contact.clinic.hours) contentToSave.contact.clinic.hours = { ...DEFAULT_CONTACT_CONTENT.clinic.hours };
            // @ts-expect-error - Complex contact type handling
            contentToSave.contact.clinic.hours[item.key as keyof typeof DEFAULT_CONTACT_CONTENT.clinic.hours] = valueToSave as unknown;
          } else {
            // @ts-expect-error - Complex contact type handling
            contentToSave.contact.clinic[item.key as keyof typeof DEFAULT_CONTACT_CONTENT.clinic] = valueToSave as unknown;
          }
        } else if (item.section === "page" && item.page === "contact") {
          if (!contentToSave.contact) contentToSave.contact = {};
          if (!contentToSave.contact.page) contentToSave.contact.page = { ...DEFAULT_CONTACT_CONTENT.page };
          // @ts-expect-error - Complex contact type handling
          contentToSave.contact.page[item.key as keyof typeof DEFAULT_CONTACT_CONTENT.page] = valueToSave as unknown;
        } else if (item.section.startsWith("divisoria_")) {
          const divisoriaKey = item.section as keyof SavedContent;
          if (!contentToSave[divisoriaKey]) {
            contentToSave[divisoriaKey] = {} as { text?: string; backgroundImage?: string };
          }
          (contentToSave[divisoriaKey] as { text?: string; backgroundImage?: string })[item.key as 'text' | 'backgroundImage'] = valueToSave;
        }
      });

      // Special handling for social section: rebuild networks array
      if (sectionName === "social" && contentToSave.social) {
        // Get current networks array
        let currentNetworks = savedContent?.social?.networks || DEFAULT_ABOUT_CONTENT.socialMedia.networks;
        if (typeof currentNetworks === 'string') {
          try {
            currentNetworks = JSON.parse(currentNetworks);
          } catch {
            currentNetworks = DEFAULT_ABOUT_CONTENT.socialMedia.networks;
          }
        }

        // Clone networks array
        const updatedNetworks = JSON.parse(JSON.stringify(currentNetworks));

        // Apply individual field changes to networks array
        Object.keys(contentToSave.social).forEach(key => {
          const networkMatch = key.match(/network(.+)_(url|enabled|order)/);
          if (networkMatch) {
            const networkId = networkMatch[1];
            const field = networkMatch[2];
            const value = contentToSave.social![key];

            const networkIndex = updatedNetworks.findIndex((n: NetworkItem) => n.id === networkId);
            if (networkIndex !== -1) {
              if (field === 'enabled') {
                updatedNetworks[networkIndex].enabled = value === 'true' || value === true;
              } else if (field === 'url') {
                updatedNetworks[networkIndex].url = value;
              } else if (field === 'order') {
                updatedNetworks[networkIndex].order = parseInt(String(value));
              }
            }
          }
        });

        // Set the complete networks array
        contentToSave.social.networks = updatedNetworks;
        console.log('🔧 PageEditor: Rebuilt networks array:', updatedNetworks);
      }

      console.log(`📤 PageEditor: Salvando seção ${sectionName}:`, contentToSave);

      // Save to database
      const response = await fetch(`/api/admin/content/${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: contentToSave }),
      });

      if (!response.ok) {
        if (handleAuthError(response)) {
          return;
        }
        throw new Error("Erro ao salvar conteúdo");
      }

      // Update local state - only for items in this section
      setSections((prev) =>
        prev.map((section) => ({
          ...section,
          items: section.items.map((item) => {
            if (item.section === sectionName && changes[item.id] !== undefined) {
              return { ...item, value: changes[item.id] };
            }
            return item;
          }),
        }))
      );

      // Update savedContent with new values
      setSavedContent(contentToSave);

      // Clear only changes for this section
      const newChanges = { ...changes };
      sectionItems.forEach(item => {
        delete newChanges[item.id];
      });
      setChanges(newChanges);

      alert(`Seção ${sectionName} salva com sucesso!`);
    } catch (error) {
      console.error("Erro ao salvar seção:", error);
      setError(`Erro ao salvar seção ${sectionName}. Tente novamente.`);
    } finally {
      setSaving(false);
    }
  };

  const cancelChanges = () => {
    if (Object.keys(changes).length === 0) {
      return; // Não há alterações para cancelar
    }

    if (
      !confirm(
        "Tem certeza que deseja cancelar todas as alterações não salvas? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    // Limpar todas as mudanças pendentes
    setChanges({});
    setError(null);
  };

  const saveClinicImages = async (data: { title: string; description: string; images: ClinicImage[] }) => {
    try {
      setSaving(true);
      setError(null);

      // Construir dados completos: savedContent + changes pendentes + novas imagens clinic
      const completeContent: SavedContent = { ...savedContent };

      // Aplicar todas as mudanças pendentes ao conteúdo completo
      sections.forEach((section) => {
        section.items.forEach((item) => {
          const valueToUse = changes[item.id] !== undefined ? changes[item.id] : item.value;

          if (item.section === "hero") {
            if (!completeContent.hero) completeContent.hero = {};
            completeContent.hero[item.key] = valueToUse;
          } else if (item.section === "welcome") {
            if (!completeContent.welcome) completeContent.welcome = {};
            completeContent.welcome[item.key] = valueToUse;
          } else if (item.section === "services") {
            if (!completeContent.services) completeContent.services = {};
            if (item.key === "title" || item.key === "description") {
              completeContent.services[item.key] = valueToUse;
            }
          }
        });
      });

      // Garantir que services tem os cards salvos
      if (!completeContent.services?.cards) {
        if (!completeContent.services) completeContent.services = {};
        completeContent.services.cards = savedContent?.services?.cards || DEFAULT_SERVICES_CONTENT.cards;
      }

      const response = await fetch(`/api/admin/content/${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          content: {
            hero: completeContent.hero || DEFAULT_HERO_CONTENT,
            welcome: completeContent.welcome || DEFAULT_WELCOME_CONTENT,
            services: completeContent.services || DEFAULT_SERVICES_CONTENT,
            clinic: data,
          },
        }),
      });

      if (!response.ok) {
        if (handleAuthError(response)) {
          return;
        }
        throw new Error("Erro ao salvar imagens da clínica");
      }

      // Recarregar conteúdo para atualizar interface
      await loadPageContent();
      setEditingClinicImages(false);
      alert("Galeria da clínica salva com sucesso!");

    } catch (error) {
      console.error("Erro ao salvar imagens da clínica:", error);
      setError("Erro ao salvar galeria. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const openCardsManager = (type: 'services' | 'terapias' | 'avaliacoes', cards: CardData[]) => {
    setCardsData(cards);
    setEditingCards(type);
  };

  const saveCards = async (cards: CardData[]) => {
    try {
      console.log('🔄 Iniciando salvamento de cards:', { editingCards, cardsCount: cards.length });

      // Construir dados completos: savedContent + changes pendentes + novos cards
      const completeContent: SavedContent = { ...savedContent };

      // Aplicar todas as mudanças pendentes ao conteúdo completo
      sections.forEach((section) => {
        section.items.forEach((item) => {
          const valueToUse = changes[item.id] !== undefined ? changes[item.id] : item.value;

          if (item.section === "hero") {
            if (!completeContent.hero) completeContent.hero = {};
            completeContent.hero[item.key] = valueToUse;
          } else if (item.section === "welcome") {
            if (!completeContent.welcome) completeContent.welcome = {};
            completeContent.welcome[item.key] = valueToUse;
          } else if (item.section === "services") {
            if (!completeContent.services) completeContent.services = {};
            if (item.key === "title" || item.key === "description") {
              completeContent.services[item.key] = valueToUse;
            }
          } else if (item.section === "clinic" && item.page === "home") {
            if (!completeContent.clinic) completeContent.clinic = {};
            if (item.key === "title" || item.key === "description") {
              completeContent.clinic[item.key] = valueToUse;
            }
          }
        });
      });

      let endpoint = '';
      let payload: any = {};

      switch (editingCards) {
        case 'services':
          endpoint = '/api/admin/content/home';
          // Garantir que temos todos os dados de todas as seções da home
          payload = {
            content: {
              hero: completeContent.hero || DEFAULT_HERO_CONTENT,
              welcome: completeContent.welcome || DEFAULT_WELCOME_CONTENT,
              services: {
                title: completeContent?.services?.title || DEFAULT_SERVICES_CONTENT.title,
                description: completeContent?.services?.description || DEFAULT_SERVICES_CONTENT.description,
                cards: cards
              },
              clinic: completeContent.clinic || DEFAULT_CLINIC_CONTENT
            }
          };
          break;
        case 'terapias':
          endpoint = '/api/admin/content/terapias';
          payload = {
            content: {
              terapias: {
                title: completeContent?.terapias?.title || DEFAULT_TERAPIAS_CONTENT.title,
                description: completeContent?.terapias?.description || DEFAULT_TERAPIAS_CONTENT.description,
                therapyModalities: cards
              }
            }
          };
          break;
        case 'avaliacoes':
          endpoint = '/api/admin/content/avaliacoes';
          payload = {
            content: {
              avaliacoes: {
                title: completeContent?.avaliacoes?.title || DEFAULT_AVALIACOES_CONTENT.title,
                description: completeContent?.avaliacoes?.description || DEFAULT_AVALIACOES_CONTENT.description,
                testModalities: cards
              }
            }
          };
          break;
      }

      console.log('📤 Enviando para endpoint:', endpoint);
      console.log('📦 Payload:', JSON.stringify(payload, null, 2));

      const token = localStorage.getItem('token');
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro da API:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      console.log('✅ API call successful, reloading page content...');

      // Recarregar dados da página
      await loadPageContent();

      setEditingCards(null);
      setCardsData([]);
      console.log('🎉 Cards salvos com sucesso!');
      alert('Cards salvos com sucesso!');
    } catch (error) {
      console.error('❌ Erro completo ao salvar cards:', error);
      if (error instanceof Error) {
        console.error('❌ Stack trace:', error.stack);
        alert(`Erro ao salvar cards: ${error.message}`);
      } else {
        alert('Erro ao salvar cards');
      }
    }
  };

  const _expandClinicImages = async () => {
    if (page !== "home") return;

    if (!confirm(
      "Tem certeza que deseja expandir as imagens da clínica para 10 slots? As imagens existentes serão mantidas."
    )) {
      return;
    }

    setResetting(true);
    setError(null);

    try {
      // Buscar conteúdo atual
      const response = await fetch(`/api/admin/content/${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      let currentContent = {};
      if (response.ok) {
        const result = await response.json();
        currentContent = result.content || {};
      }

      // Expandir apenas as imagens da clínica
      const currentClinic = (currentContent as any)?.clinic || {};
      const currentImages = currentClinic.images || [];
      
      // Adicionar imagens faltantes do padrão
      const expandedImages = [...currentImages];
      for (let i = currentImages.length; i < DEFAULT_CLINIC_CONTENT.images.length; i++) {
        expandedImages.push({
          ...DEFAULT_CLINIC_CONTENT.images[i],
          active: i < 5 // Primeiras 5 ativas, resto expansível
        });
      }

      // Salvar apenas a seção da clínica expandida
      const clinicContent = {
        ...currentClinic,
        images: expandedImages
      };

      const saveResponse = await fetch(`/api/admin/content/${page}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          section: "clinic",
          content: clinicContent,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Erro ao expandir imagens");
      }

      // Recarregar conteúdo
      await loadPageContent();
      setChanges({});

      alert(`Imagens da clínica expandidas para ${expandedImages.length} slots!`);
    } catch (error) {
      console.error("Erro ao expandir imagens:", error);
      setError("Erro ao expandir imagens. Tente novamente.");
    } finally {
      setResetting(false);
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
      terapias: "Terapias",
      contact: "Contato",
      testimonials: "Avaliações",
      avaliacoes: "Avaliações",
      agendamento: "Agendamento",
    };
    return titles[pageKey] || "Página";
  };

  const renderContentInput = (item: ContentItem) => {
    const currentValue =
      changes[item.id] !== undefined ? changes[item.id] : item.value;

    // Special handling for enabled/active fields - render as switch
    if (item.key.includes('_enabled') || item.key.includes('_active')) {
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
            href={`/${page === "home" ? "" : page === "divisorias" ? "" : page}`}
            target="_blank"
            className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </Link>

          {Object.keys(changes).length > 0 && (
            <button
              onClick={cancelChanges}
              disabled={saving}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-400 rounded-md hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar Alterações</span>
            </button>
          )}


          <button
            onClick={resetToDefaults}
            disabled={resetting || saving}
            className="inline-flex items-center space-x-2 px-4 py-2 border border-[var(--destructive)] text-[var(--destructive)] rounded-md hover:bg-white/10 hover:font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{resetting ? "Restaurando..." : "Restaurar Padrão"}</span>
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
        {sections.map((section, sectionIndex) => {
          // Special handling for cards sections
          const isCardsSection = (
            (section.name === "Seção Services - Primeiros Passos" && page === "home") ||
            (section.name === "Modalidades de Terapia" && page === "terapias") ||
            (section.name === "Testes Psicológicos" && page === "avaliacoes")
          );

          if (isCardsSection) {
            let cardsType: 'services' | 'terapias' | 'avaliacoes' = 'services';
            let currentCards: CardData[] = [];

            if (section.name === "Seção Services - Primeiros Passos" && page === "home") {
              cardsType = 'services';
              currentCards = savedContent?.services?.cards || DEFAULT_SERVICES_CONTENT.cards;
            } else if (section.name === "Modalidades de Terapia" && page === "terapias") {
              cardsType = 'terapias';
              // Verificar estrutura do banco de dados para terapias
              currentCards = savedContent?.terapias?.therapyModalities || DEFAULT_TERAPIAS_CONTENT.therapyModalities;
            } else if (section.name === "Testes Psicológicos" && page === "avaliacoes") {
              cardsType = 'avaliacoes';
              // Verificar estrutura do banco de dados para avaliações
              currentCards = savedContent?.avaliacoes?.testModalities || DEFAULT_AVALIACOES_CONTENT.testModalities;
            }

            const sectionHasChanges = section.items.some(item => changes[item.id] !== undefined);
            const sectionName = section.items[0]?.section || cardsType;

            return (
              <div key={sectionIndex}>
                <AdminCard title={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span>{section.name}</span>
                      {sectionHasChanges && (
                        <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                          Não salvo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openCardsManager(cardsType, currentCards)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground
                                   rounded-md hover:bg-primary/90 transition-colors text-sm"
                      >
                        <ImageIcon size={16} />
                        <span>Gerenciar Cards</span>
                      </button>
                      <button
                        onClick={() => saveSectionChanges(sectionName)}
                        disabled={saving || !sectionHasChanges}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm ${
                          sectionHasChanges
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Save size={16} />
                        <span>{sectionHasChanges ? 'Salvar Seção' : 'Sem alterações'}</span>
                      </button>
                    </div>
                  </div>
                }>
                  <p className="text-muted-foreground mb-6">{section.description}</p>

                  <AdminCard title="Resumo dos Cards">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Clique em &quot;Gerenciar Cards&quot; para editar os cards com a nova interface moderna.</p>
                      <p className="mt-2">
                        A nova interface permite: adicionar/remover cards (1-18), paginação automática de 6 em 6,
                        reordenação por arrastar e melhor organização dos campos.
                      </p>
                      <p className="mt-2 font-medium">
                        Cards atuais: {currentCards.filter(c => c.active).length} ativos / {currentCards.length} total
                      </p>
                    </div>
                  </AdminCard>
                </AdminCard>
              </div>
            );
          }

          // Special handling for clinic section
          if (section.name.includes("Clinic - Nosso Espaço") && page === "home") {
            const sectionHasChanges = section.items.some(item => changes[item.id] !== undefined);
            const sectionName = section.items[0]?.section || "clinic";

            return (
              <div key={sectionIndex}>
                <AdminCard title={
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <span>{section.name}</span>
                      {sectionHasChanges && (
                        <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                          Não salvo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingClinicImages(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground
                                   rounded-md hover:bg-primary/90 transition-colors text-sm"
                      >
                        <ImageIcon size={16} />
                        <span>Gerenciar Galeria</span>
                      </button>
                      <button
                        onClick={() => saveSectionChanges(sectionName)}
                        disabled={saving || !sectionHasChanges}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm ${
                          sectionHasChanges
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Save size={16} />
                        <span>{sectionHasChanges ? 'Salvar Seção' : 'Sem alterações'}</span>
                      </button>
                    </div>
                  </div>
                }>
                  <p className="text-muted-foreground mb-6">{section.description}</p>

                  <AdminCard title="Resumo da Galeria">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Clique em &quot;Gerenciar Galeria&quot; para editar as imagens com a nova interface moderna.</p>
                      <p className="mt-2">
                        A nova interface permite: adicionar/remover imagens (1-10), thumbnails automáticos,
                        reordenação por arrastar e melhor organização dos campos.
                      </p>
                    </div>
                  </AdminCard>
                </AdminCard>
              </div>
            );
          }

          // Regular section rendering
          const sectionHasChanges = section.items.some(item => changes[item.id] !== undefined);
          const sectionName = section.items[0]?.section || '';

          return (
            <AdminCard key={sectionIndex} title={
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <span>{section.name}</span>
                  {sectionHasChanges && (
                    <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 rounded">
                      Não salvo
                    </span>
                  )}
                </div>
                <button
                  onClick={() => saveSectionChanges(sectionName)}
                  disabled={saving || !sectionHasChanges}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm ${
                    sectionHasChanges
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save size={16} />
                  <span>{sectionHasChanges ? 'Salvar Seção' : 'Sem alterações'}</span>
                </button>
              </div>
            }>
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
          );
        })}
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

      {/* Clinic Images Manager Modal */}
      {editingClinicImages && page === "home" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Gerenciar Galeria da Clínica</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Interface moderna com React Hook Form - Mín. 1, máx. 10 imagens
                </p>
              </div>
              <button
                onClick={() => setEditingClinicImages(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {clinicData && (
                <ClinicImagesManager
                  key={`clinic-manager-${editingClinicImages}-${Date.now()}`}
                  initialData={clinicData}
                  onSave={saveClinicImages}
                  saving={saving}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cards Manager Modal */}
      {editingCards && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Gerenciar {editingCards === 'services' ? 'Cards de Serviços' :
                           editingCards === 'terapias' ? 'Modalidades de Terapia' :
                           'Testes Psicológicos'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Interface moderna com paginação automática - Mín. 1, máx. 18 cards
                </p>
              </div>
              <button
                onClick={() => setEditingCards(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <CardsManager
                cards={cardsData}
                onSave={saveCards}
                title={`${editingCards === 'services' ? 'Cards de Serviços' :
                        editingCards === 'terapias' ? 'Modalidades de Terapia' :
                        'Testes Psicológicos'}`}
                description={`Configure os ${editingCards === 'services' ? 'cards da homepage' :
                             editingCards === 'terapias' ? 'cards de modalidades terapêuticas' :
                             'cards de testes psicológicos'} que serão exibidos.`}
                minCards={1}
                maxCards={18}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
