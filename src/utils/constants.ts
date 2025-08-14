// src/utils/constants.ts - VERSÃO REFATORADA COMPLETA

// ============================================
// 🚀 SISTEMA DE ROTAS
// ============================================
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/terapias",
  AVALIACOES: "/avaliacoes",
  APPOINTMENT: "/agendamento",
  CONTACT: "/contato",
  ARTICLES: "/artigos",

  // Rotas específicas de serviços
  SERVICE: {
    ONLINE: "/online",
    IN_PERSON: "/presencial",
    EMERGENCY: "/plantao",
  },

  // Rotas de testes
  TEST: {
    WAIS: "/wais-iii",
    BAI: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
  },

  ADMIN: {
    BASE: "/admin",
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    APPOINTMENTS: "/admin/appointments",
    ANALYTICS: "/admin/analytics",
    CONTENT: "/admin/content",
    MEDIA: "/admin/media",
    SETTINGS: "/admin/settings",
  },
} as const;

// ============================================
// 📅 SISTEMA DE AGENDAMENTO
// ============================================
export const APPOINTMENT = {
  STATUS: {
    SCHEDULED: "agendado",
    CONFIRMED: "confirmado",
    CANCELLED: "cancelado",
    COMPLETED: "realizado",
  },

  MODALITY: {
    IN_PERSON: "presencial",
    ONLINE: "online",
  },

  TIME_SLOTS: [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ],

  DURATION: {
    DEFAULT: 50,
    FIRST_APPOINTMENT: 60,
    OPTIONS: [30, 45, 50, 60, 90],
  },

  ADVANCE_DAYS: {
    DEFAULT: 60,
    OPTIONS: [30, 45, 60, 90],
  },

  BLOCKED_DAYS: ["Sexta", "Sábado", "Domingo"],

  MESSAGES: {
    CONFIRMATION: "Seu agendamento foi confirmado com sucesso!",
    CANCELLATION: "Seu agendamento foi cancelado com sucesso.",
    CODE_SENT: "Um e-mail de confirmação foi enviado com o código.",
    REMINDER: "Lembrete: Sua consulta é amanhã às",
  },
} as const;

// ============================================
// 🏢 INFORMAÇÕES DO CONSULTÓRIO
// ============================================
export const CLINIC_INFO = {
  NAME: "Consultório de Psicologia Michel de Camargo",

  PSYCHOLOGIST: {
    NAME: "Michel de Camargo",
    FULL_NAME: "Michel de Camargo",
    CRP: "CRP 06/174807",
    TITLE: "Psicólogo Clínico",
    SPECIALTIES: ["Ansiedade", "Depressão", "Análise do Comportamento"],
    APPROACH: "Análise do Comportamento",
    TESTS: ["WAIS III", "BAI"],
  },

  CONTACT: {
    WHATSAPP: "5515997646421",
    PHONE_DISPLAY: "+55 (15) 99764-6421",
    EMAIL: "michelcamargo.psi@gmail.com",
    SOCIAL: {
      INSTAGRAM: "@michelcamargo.psi",
      LINKEDIN: "michel-camargo-psi",
    },
  },

  ADDRESS: {
    STREET: "Rua Antônio Ferreira, 171",
    NEIGHBORHOOD: "Parque Campolim",
    CITY: "Sorocaba",
    STATE: "SP",
    ZIP: "18047-636",
    COUNTRY: "Brasil",
    COORDINATES: {
      LAT: -23.493335284719095,
      LNG: -47.47244788549275,
    },
  },

  HOURS: {
    WEEKDAYS: "Segunda à Sexta",
    START: "8:00",
    END: "21:00",
    TIMEZONE: "America/Sao_Paulo",
    CLOSED_DAYS: ["Sexta", "Sábado", "Domingo"],
    NOTE: "As consultas necessitam ser previamente agendadas.",
    AGE_RESTRICTION: "* Atendimentos a partir de 20 anos de idade",
  },
} as const;

// ============================================
// 📝 MENSAGENS DO SISTEMA
// ============================================
export const MESSAGES = {
  // Mensagens de Agendamento
  APPOINTMENT: {
    SUCCESS: "Agendamento realizado com sucesso!",
    ERROR: "Erro ao processar agendamento. Tente novamente.",
    CANCELLED: "Agendamento cancelado com sucesso.",
    NOT_FOUND: "Agendamento não encontrado.",
    CONFIRMATION_EMAIL: "Um e-mail de confirmação foi enviado.",
    ALREADY_EXISTS: "Já existe um agendamento para este horário.",
    INVALID_CODE: "Código de confirmação inválido.",
  },

  // Mensagens de Validação
  VALIDATION: {
    REQUIRED_FIELD: "Este campo é obrigatório",
    INVALID_EMAIL: "E-mail inválido",
    INVALID_PHONE: "Telefone inválido",
    INVALID_DATE: "Selecione uma data válida",
    INVALID_TIME: "Selecione um horário",
    INVALID_MODALITY: "Selecione a modalidade da consulta",
    MIN_LENGTH: (field: string, min: number) =>
      `${field} deve ter pelo menos ${min} caracteres`,
    MAX_LENGTH: (field: string, max: number) =>
      `${field} deve ter no máximo ${max} caracteres`,
    DATE_PAST: "A data deve ser futura",
    TIME_UNAVAILABLE: "Este horário não está disponível",
  },

  // Mensagens de Erro
  ERROR: {
    GENERIC: "Ocorreu um erro. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Acesso não autorizado.",
    FORBIDDEN: "Você não tem permissão para acessar este recurso.",
    NOT_FOUND: "Recurso não encontrado.",
    SERVER: "Erro no servidor. Tente novamente mais tarde.",
    TIMEOUT: "A requisição demorou muito. Tente novamente.",
  },

  // Mensagens de Loading
  LOADING: {
    DEFAULT: "Carregando...",
    APPOINTMENTS: "Buscando agendamentos...",
    SAVING: "Salvando...",
    PROCESSING: "Processando...",
    SENDING: "Enviando...",
    UPLOADING: "Fazendo upload...",
    DELETING: "Excluindo...",
  },

  // Mensagens de Sucesso
  SUCCESS: {
    SAVED: "Salvo com sucesso!",
    UPDATED: "Atualizado com sucesso!",
    DELETED: "Excluído com sucesso!",
    SENT: "Enviado com sucesso!",
    UPLOADED: "Upload realizado com sucesso!",
  },

  // Mensagens de Confirmação
  CONFIRM: {
    DELETE: "Tem certeza que deseja excluir?",
    CANCEL: "Tem certeza que deseja cancelar?",
    SAVE: "Deseja salvar as alterações?",
    LEAVE: "Existem alterações não salvas. Deseja sair?",
  },
} as const;

// ============================================
// 🎨 CONFIGURAÇÕES DE MÍDIA
// ============================================
export const MEDIA = {
  CATEGORIES: {
    ALL: "all",
    PROFILE: "profile",
    SERVICES: "services",
    GALLERY: "gallery",
    HERO: "hero",
    TESTIMONIALS: "testimonials",
  },

  UPLOAD: {
    MAX_SIZE_MB: 5,
    MAX_SIZE_BYTES: 5 * 1024 * 1024,
    ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/webp"],
    ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
    MAX_FILES: 5,
    MAX_DIMENSIONS: {
      WIDTH: 4096,
      HEIGHT: 4096,
    },
  },

  PLACEHOLDER: {
    THERAPY: "/assets/terapias1.jpg",
    PROFILE: "/assets/michel1.svg",
    PROFILE_PHOTO: "/assets/michel2.png",
    HERO: "/assets/horizonte.jpg",
    CLINIC: "https://picsum.photos/800/600",
    DEFAULT: "/assets/placeholder.jpg",
  },

  LOGOS: {
    MAIN: "/logo.svg",
    DARK: "/logo2.svg",
    ICON: "/PsiLogo.svg",
    ICON_ALT: "/PsiLogo2.svg",
  },
} as const;

// ============================================
// 🏠 CONTEÚDO DAS PÁGINAS
// ============================================
export const PAGE_CONTENT = {
  HOME: {
    HERO: {
      TEXT: "Já pensou em como seria ter uma vida mais tranquila e leve, com menos ansiedade? Lidar com isso pode ser difícil, mas você não precisa enfrentar tudo sozinho. Como psicólogo, estou aqui para te ouvir, acolher e ajudar a encontrar caminhos que tragam mais calma e equilíbrio ao seu dia a dia. Cada passo nessa jornada é importante, e eu estarei ao seu lado para apoiar você em cada um deles!",
      CTA: "Agende sua consulta e comece a reescrever sua história hoje mesmo:",
      BUTTON: "Agende sua Consulta!",
      DISCLAIMER: "*Atendimentos a partir de 20 anos de idade",
    },

    WELCOME: {
      TITLE: "Seja Bem-Vindo!",
      SUBTITLE:
        "Sentir-se sobrecarregado, ansioso ou constantemente em alerta pode parecer um fardo solitário, mas saiba que você não está sozinho.",
      CTA: "Dê o primeiro passo e agende uma consulta.",
    },

    SERVICES: {
      TITLE: "Primeiros Passos",
      SUBTITLE: "Navegue pelos serviços e descubra como posso ajudar você...",
    },

    CLINIC: {
      TITLE: "Nosso Espaço",
      SUBTITLE:
        "Explore o ambiente projetado para proporcionar conforto, privacidade e bem-estar emocional.",
    },
  },

  ABOUT: {
    TITLE: "Sobre mim",
    SUBTITLE: "Psicólogo Clínico",
  },

  SERVICES: {
    TITLE: "Modalidades de Atendimentos",
    SUBTITLE:
      "Os atendimentos são realizados dentro da visão teórica da Análise do Comportamento, buscando compreender e transformar comportamentos para uma melhor qualidade de vida.",
  },

  EVALUATIONS: {
    TITLE: "Testes Psicológicos",
    SUBTITLE:
      "Instrumentos técnicos e científicos que auxiliam na compreensão de aspectos específicos da saúde mental e cognitiva. Cada teste oferece insights importantes sobre diferentes dimensões psicológicas.",
  },

  APPOINTMENT: {
    TITLE: "Agendamento de Consultas",
    TABS: {
      SEARCH: "Buscar Agendamento",
      NEW: "Novo Agendamento",
    },
    STEPS: {
      DATE_TIME: "Data e Horário",
      CONTACT: "Informações de Contato",
      CONFIRMATION: "Confirmação",
    },
    INFO_CARDS: {
      PREPARATION: {
        TITLE: "Preparando-se para sua consulta",
        TEXT: "Para a primeira consulta, recomendo chegar 10 minutos antes do horário marcado. Traga suas dúvidas e expectativas para conversarmos.",
      },
      CANCELLATION: {
        TITLE: "Política de Cancelamento",
        TEXT: "Cancelamentos devem ser feitos com pelo menos 24 horas de antecedência. Caso contrário, a sessão será cobrada integralmente.",
      },
      ONLINE: {
        TITLE: "Consulta Online",
        TEXT: "Para consultas online, utilize um local tranquilo e privado. Verifique sua conexão com a internet antes da sessão.",
      },
    },
  },

  CONTACT: {
    TITLE: "Contato",
  },

  DIVISORIAS: {
    TITLE: "Divisórias",
    SUBTITLE: "Frases de impacto e informações úteis exibidas entre as seções das páginas",
    SECTIONS: {
      DIVISORIA_1: {
        TITLE: "Divisória 1",
        DESCRIPTION: "Primeira divisória - Horários de atendimento",
        DEFAULT_TEXT: "Atendimento Segunda à Sexta das 8:00 às 21:00 - Consultas previamente agendadas para melhor atendimento",
        BACKGROUND_IMAGE: "/assets/quotes/mindfulness.jpg"
      },
      DIVISORIA_2: {
        TITLE: "Divisória 2", 
        DESCRIPTION: "Segunda divisória - Plantão psicológico",
        DEFAULT_TEXT: "Plantão psicológico - serviço de atendimento pontual de suporte emocional imediato",
        BACKGROUND_IMAGE: "/assets/quotes/growth.jpg"
      },
      DIVISORIA_3: {
        TITLE: "Divisória 3",
        DESCRIPTION: "Terceira divisória - Psicoterapia online",
        DEFAULT_TEXT: "Psicoterapia online - modalidade que possibilita atendimento à distância com a mesma qualidade",
        BACKGROUND_IMAGE: "/assets/quotes/journey.jpg"
      },
      DIVISORIA_4: {
        TITLE: "Divisória 4",
        DESCRIPTION: "Quarta divisória - Ambiente acolhedor",
        DEFAULT_TEXT: "Ambiente acolhedor e sigiloso para seu bem-estar emocional e privacidade garantida",
        BACKGROUND_IMAGE: "/assets/quotes/reflection.jpg"
      },
      DIVISORIA_5: {
        TITLE: "Divisória 5",
        DESCRIPTION: "Quinta divisória - Primeira consulta",
        DEFAULT_TEXT: "Primeira consulta com duração estendida para melhor compreensão do seu caso",
        BACKGROUND_IMAGE: "/assets/quotes/rebuild.jpg"
      },
      DIVISORIA_6: {
        TITLE: "Divisória 6", 
        DESCRIPTION: "Sexta divisória - Acompanhamento contínuo",
        DEFAULT_TEXT: "Acompanhamento contínuo e suporte em momentos de crise emocional",
        BACKGROUND_IMAGE: "/assets/quotes/opportunity.jpg"
      },
    }
  },
} as const;

// ============================================
// 📊 CONFIGURAÇÕES ADMIN
// ============================================
export const ADMIN = {
  SETTINGS: {
    SECTIONS: ["geral", "email", "agendamento", "notificacoes", "senha"],
    DEFAULT_SESSION_TIMES: ["30", "45", "50", "60", "90"],
    ADVANCE_DAYS_OPTIONS: ["30", "45", "60", "90"],
    EMAIL_TEMPLATES: ["default", "minimal", "professional"],
  },

  STATS: {
    REFRESH_INTERVAL: 60000, // 1 minuto
    ITEMS_PER_PAGE: 10,
    DEFAULT_DATE_RANGE: "30d",
    DATE_RANGES: [
      { value: "7d", label: "Últimos 7 dias" },
      { value: "30d", label: "Últimos 30 dias" },
      { value: "90d", label: "Últimos 90 dias" },
      { value: "all", label: "Todo o período" },
    ],
  },

  MOCK_DATA: {
    ENABLED: process.env.NODE_ENV === "development",
    DELAY: 1000, // ms
  },

  TABLE_CONFIG: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  },
} as const;

// ============================================
// 🎯 DIVISOR/QUOTES
// ============================================
export const QUOTES = [
  {
    info: `${CLINIC_INFO.HOURS.WEEKDAYS} das ${CLINIC_INFO.HOURS.START} as ${CLINIC_INFO.HOURS.END}`,
    info2: `Obs: ${CLINIC_INFO.HOURS.NOTE}`,
    info3: "",
    detail: CLINIC_INFO.HOURS.AGE_RESTRICTION,
    backgroundImage: "/assets/quotes/mindfulness.jpg",
  },
  {
    info: "Plantão psicológico - serviço de atendimento pontual de suporte emocional imediato.",
    info2:
      "Psicoterapia online - uma modalidade de terapia que possibilita atendimento à distância, incluindo pacientes em diferentes países.",
    detail: "Veja mais em terapias...",
    backgroundImage: "/assets/quotes/growth.jpg",
  },
  {
    info: "A mudança é um processo, não um evento.",
    info2: "",
    info3: "",
    detail: "Albert Ellis",
    backgroundImage: "/assets/quotes/journey.jpg",
  },
  {
    info: "O comportamento é mantido por suas consequências.",
    info2: "",
    info3: "",
    detail: "B.F. Skinner",
    backgroundImage: "/assets/quotes/reflection.jpg",
  },
  {
    info: "A terapia é uma oportunidade de reconstruir a forma como vivenciamos o mundo.",
    info2: "",
    info3: "",
    detail: "Donald Meichenbaum",
    backgroundImage: "/assets/quotes/rebuild.jpg",
  },
  {
    info: "Toda resposta aprendida é uma oportunidade de mudança.",
    info2: "",
    info3: "",
    detail: "Joseph Wolpe",
    backgroundImage: "/assets/quotes/opportunity.jpg",
  },
] as const;

// ============================================
// 🔧 CONFIGURAÇÕES TÉCNICAS
// ============================================
export const CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
    TIMEOUT: 30000, // 30s
  },

  AUTH: {
    TOKEN_KEY: "token",
    REFRESH_TOKEN_KEY: "refreshToken",
    USER_KEY: "user",
  },

  STORAGE: {
    THEME_KEY: "theme",
    LANGUAGE_KEY: "language",
  },

  SEO: {
    DEFAULT_TITLE: `${CLINIC_INFO.PSYCHOLOGIST.NAME} - ${CLINIC_INFO.PSYCHOLOGIST.TITLE}`,
    DEFAULT_DESCRIPTION: `${
      CLINIC_INFO.PSYCHOLOGIST.TITLE
    } especializado em ${CLINIC_INFO.PSYCHOLOGIST.SPECIALTIES.join(
      ", "
    )}. Atendimento presencial e online em Sorocaba.`,
    DEFAULT_KEYWORDS: [
      ...CLINIC_INFO.PSYCHOLOGIST.SPECIALTIES,
      "psicólogo",
      "terapia",
      "Sorocaba",
      "consulta online",
      "saúde mental",
    ],
  },

  DATES: {
    DEFAULT_LOCALE: "pt-BR",
    DEFAULT_TIMEZONE: CLINIC_INFO.HOURS.TIMEZONE,
  },
} as const;

// ============================================
// 🎨 TEMAS E CORES
// ============================================
export const THEME = {
  COLORS: {
    PRIMARY: "#ffbf9e",
    SECONDARY: "#c4d6ed",
    FOREGROUND: "#2e5597",
    BACKGROUND: "#ffffff",
    DARK: {
      PRIMARY: "#ffbf9e",
      SECONDARY: "#2a2a2a",
      FOREGROUND: "#fafafa",
      BACKGROUND: "#001046",
    },
  },

  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
  },

  ANIMATIONS: {
    DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
    },
  },
} as const;

// ============================================
// 📱 REDES SOCIAIS E LINKS EXTERNOS
// ============================================
export const EXTERNAL_LINKS = {
  WHATSAPP: `https://wa.me/${CLINIC_INFO.CONTACT.WHATSAPP}`,
  EMAIL: `mailto:${CLINIC_INFO.CONTACT.EMAIL}`,
  GOOGLE_MAPS: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${CLINIC_INFO.ADDRESS.STREET}, ${CLINIC_INFO.ADDRESS.NEIGHBORHOOD}, ${CLINIC_INFO.ADDRESS.CITY} - ${CLINIC_INFO.ADDRESS.STATE}`
  )}`,
  TEST_BAI:
    "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
} as const;

// Type helpers
export type AppointmentStatus = keyof typeof APPOINTMENT.STATUS;
export type AppointmentModality = keyof typeof APPOINTMENT.MODALITY;
export type MediaCategory = keyof typeof MEDIA.CATEGORIES;
export type RouteKey = keyof typeof ROUTES;
export type AdminRouteKey = keyof typeof ROUTES.ADMIN;
