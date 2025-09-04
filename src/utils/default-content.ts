// src/utils/default-content.ts
// Conteúdos padrão das páginas - fallback quando não há dados no banco

export const DEFAULT_HERO_CONTENT = {
  mainText: "Já pensou em como seria ter uma vida mais tranquila e leve, com menos ansiedade? Lidar com isso pode ser difícil, mas você não precisa enfrentar tudo sozinho. Como psicólogo, estou aqui para te ouvir, acolher e ajudar a encontrar caminhos que tragam mais calma e equilíbrio ao seu dia a dia. Cada passo nessa jornada é importante, e eu estarei ao seu lado para apoiar você em cada um deles!",
  ctaText: "Agende sua consulta e comece a reescrever sua história hoje mesmo:",
  disclaimer: "*Atendimentos a partir de 20 anos de idade",
  backgroundImage: "/assets/horizonte.jpg",
  // Limites de caracteres para manter estrutura
  maxCharacters: {
    mainText: 600, // Limite para texto principal
    ctaText: 100,  // Limite para call-to-action
    disclaimer: 50 // Limite para disclaimer
  }
};

export const DEFAULT_WELCOME_CONTENT = {
  title: "Seja Bem-Vindo!",
  content: `Sentir-se sobrecarregado, ansioso ou constantemente em alerta pode parecer um fardo solitário, mas saiba que você não está sozinho. A ansiedade é uma reação natural do corpo, mas, quando começa a afetar sua vida, é hora de buscar ajuda.

A ansiedade pode surgir de muitas formas: preocupações excessivas no trabalho, dificuldades nos relacionamentos, tensões familiares ou até mesmo cobranças que você impõe a si mesmo. Talvez você se reconheça em momentos como:

• Procrastinar por medo de errar ou não ser bom o suficiente.
• Evitar discussões ou situações sociais por receio de julgamento.
• Ter dificuldade para dormir devido a pensamentos incessantes.
• Sentir que o coração acelera ou que o ar parece faltar, mesmo sem motivo aparente.

Aqui, a psicoterapia é um espaço para você entender e transformar essas sensações. A abordagem que utilizo é a **Análise do Comportamental** (TCC), uma ciência que busca compreender o impacto das situações e das experiências na sua maneira de agir, pensar e sentir. Juntos, investigaremos como os padrões de comportamento relacionados à ansiedade se formaram e como você pode transformá-los de forma prática e eficaz.

No tratamento, você irá:

1. Compreender os contextos que desencadeiam sua ansiedade.
2. Aprender formas de lidar com as situações que mais afetam seu bem-estar.
3. Desenvolver habilidades para construir relações mais saudáveis e funcionais.
4. Recuperar a autonomia e a segurança em suas escolhas.

Você não precisa enfrentar tudo sozinho. Estou aqui para oferecer suporte e ajudá-lo a encontrar novos caminhos.

**Dê o primeiro passo e agende uma consulta.**

Cuidar da sua saúde emocional é um presente que transforma a maneira como você vive e se relaciona com o mundo.`,
  profileImage: "/assets/michel1.svg",
  // Limites de caracteres
  maxCharacters: {
    title: 50,
    content: 2500 // Limite maior para o conteúdo completo
  }
};

export const DEFAULT_SERVICES_CONTENT = {
  title: "Primeiros Passos",
  description: "Navegue pelos serviços e descubra como posso ajudar você...",
  cards: [
    {
      id: 1,
      title: "Terapias",
      description: "Descubra as diferentes abordagens terapêuticas para sua saúde mental.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/terapias",
      order: 1,
      active: true
    },
    {
      id: 2,
      title: "Sobre o Psicólogo",
      description: "Conheça minha história, formação e abordagem profissional.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/about",
      order: 2,
      active: true
    },
    {
      id: 3,
      title: "Artigos",
      description: "Insights e informações úteis sobre saúde mental.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/artigos",
      order: 3,
      active: true
    },
    {
      id: 4,
      title: "Agendar Consulta",
      description: "Marque sua primeira sessão de forma rápida e fácil.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/agendamento",
      order: 4,
      active: true
    },
    {
      id: 5,
      title: "Avaliações",
      description: "Saiba mais sobre os processos de avaliação psicológica.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/avaliacoes",
      order: 5,
      active: true
    },
    {
      id: 6,
      title: "Contato",
      description: "Entre em contato para esclarecer todas as suas dúvidas.",
      imageUrl: "/assets/terapias1.jpg",
      href: "/contato",
      order: 6,
      active: true
    }
  ],
  // Limites de caracteres
  maxCharacters: {
    title: 50,
    description: 200,
    cardTitle: 30,
    cardDescription: 150
  }
};

export const DEFAULT_CLINIC_CONTENT = {
  title: "Nosso Espaço",
  description: "Explore o ambiente projetado para proporcionar conforto, privacidade e bem-estar emocional.",
  images: [
    {
      id: 1,
      original: "/assets/clinic/default-1.jpg",
      thumbnail: "/assets/clinic/default-1.jpg", // Thumbnail = mesmo que original
      originalAlt: "Espaço de Consultório - Área de Acolhimento",
      originalTitle: "Área de Acolhimento",
      description: "Ambiente acolhedor e tranquilo projetado para proporcionar conforto e segurança durante o atendimento.",
      order: 1,
      active: true
    }
  ],
  // Limites de caracteres
  maxCharacters: {
    title: 50,
    description: 200,
    imageTitle: 50,
    imageDescription: 150,
    imageAlt: 100
  }
};

export const DEFAULT_ABOUT_CONTENT = {
  title: "Sobre mim",
  subtitle: "Psicólogo Clínico",
  profileImage: "/assets/michel2.png",
  content: `Olá! Sou o Michel, psicólogo especializado em transtornos emocionais, como ansiedade e depressão, e como especialista em análise do comportamento, realizo avaliação cognitiva através do teste de inteligência WAIS III.

Meu objetivo é auxiliar pessoas que estão enfrentando dificuldades psicológicas, proporcionando alívio dos sintomas e uma melhora significativa na qualidade de vida.

Minha abordagem se baseia na Análise do Comportamento, uma visão teórica da Psicologia Comportamental. Através dela, busco compreender individualmente cada pessoa, considerando tanto o ambiente quanto os comportamentos envolvidos. Acredito que essa compreensão é fundamental para alcançarmos resultados efetivos.

Estou aqui para te ajudar nessa jornada. Se você está enfrentando desafios emocionais e comportamentais devido à ansiedade e/ou depressão, será um prazer oferecer meu apoio e orientação.

Entre em contato comigo para agendar uma consulta ou para obter mais informações sobre avaliação cognitiva. Juntos, podemos trilhar um caminho de transformação e bem-estar.`,
  socialMedia: {
    title: "Minhas Redes",
    description: "Conecte-se comigo nas redes sociais para conteúdos e dicas sobre saúde mental",
    networks: [
      {
        id: "facebook",
        name: "Facebook",
        url: "https://facebook.com/michelcamargo",
        icon: "Facebook",
        enabled: true,
        order: 1
      },
      {
        id: "instagram",
        name: "Instagram", 
        url: "https://instagram.com/michelcamargo",
        icon: "Instagram",
        enabled: true,
        order: 2
      },
      {
        id: "tiktok",
        name: "TikTok",
        url: "https://tiktok.com/@michelcamargo",
        icon: "Music", // TikTok icon not in lucide, using Music as alternative
        enabled: false,
        order: 3
      },
      {
        id: "youtube",
        name: "YouTube",
        url: "https://youtube.com/@michelcamargo",
        icon: "Youtube",
        enabled: false,
        order: 4
      },
      {
        id: "linkedin",
        name: "LinkedIn",
        url: "https://linkedin.com/in/michelcamargo",
        icon: "Linkedin",
        enabled: true,
        order: 5
      }
    ]
  },
  // Limites de caracteres
  maxCharacters: {
    title: 50,
    subtitle: 100,
    content: 2000,
    socialTitle: 50,
    socialDescription: 200,
    socialUrl: 200
  }
};

export const DEFAULT_TERAPIAS_CONTENT = {
  title: "Modalidades de Atendimentos",
  description: "Os atendimentos são realizados dentro da visão teórica da Análise do Comportamento, buscando compreender e transformar comportamentos para uma melhor qualidade de vida.",
  therapyModalities: [
    {
      id: 1,
      imageUrl: "/assets/terapias1.jpg",
      title: "Psicoterapia individual - Presencial",
      description: "Modalidade de atendimento de um paciente através de técnicas personalizadas em encontros presenciais no consultório.",
      href: "/presencial",
      order: 1,
      active: true
    },
    {
      id: 2,
      imageUrl: "/assets/terapias1.jpg",
      title: "Psicoterapia individual - On-line",
      description: "Modalidade de terapia que permite o atendimento feito à distância, com todo o conforto e privacidade que você precisa.",
      href: "/online",
      order: 2,
      active: true
    },
    {
      id: 3,
      imageUrl: "/assets/terapias1.jpg",
      title: "Plantão Psicológico",
      description: "Serviço de atendimento rápido e pontual, oferecido para pessoas que precisam de suporte emocional imediato e urgente.",
      href: "/plantao",
      order: 3,
      active: true
    }
  ],
  maxCharacters: {
    title: 80,
    description: 300,
    modalityTitle: 60,
    modalityDescription: 200
  }
};

export const DEFAULT_AVALIACOES_CONTENT = {
  title: "Testes Psicológicos",
  description: "Instrumentos técnicos e científicos que auxiliam na compreensão de aspectos específicos da saúde mental e cognitiva. Cada teste oferece insights importantes sobre diferentes dimensões psicológicas.",
  testModalities: [
    {
      id: 1,
      imageUrl: "/assets/terapias1.jpg",
      title: "Teste de Ansiedade - Escala BAI",
      description: "A Escala de Ansiedade de Beck (BAI) é um instrumento de avaliação que ajuda a identificar e medir a severidade dos sintomas de ansiedade. Composta por 21 questões, permite uma análise rápida e objetiva do estado atual de ansiedade do indivíduo.",
      href: "https://kiai.med.br/test/teste-online-de-ansiedade-escala-de-beck-bai/",
      order: 1,
      active: true
    },
    {
      id: 2,
      imageUrl: "/assets/terapias1.jpg",
      title: "Teste de Inteligência WAIS III",
      description: "A Escala Wechsler de Inteligência (WAIS III) é um instrumento completo para avaliação cognitiva, composto por subtestes que analisam diferentes aspectos da inteligência, como compreensão verbal, raciocínio perceptual, memória de trabalho e velocidade de processamento.",
      href: "/wais-iii",
      order: 2,
      active: true
    }
  ],
  maxCharacters: {
    title: 80,
    description: 300,
    testTitle: 60,
    testDescription: 250
  }
};

export const DEFAULT_CONTACT_CONTENT = {
  // Informações do profissional
  psychologist: {
    name: "Michel de Camargo",
    fullName: "Michel de Camargo",
    title: "Psicólogo Clínico",
    crp: "CRP 06/174807",
    specialties: ["Ansiedade", "Depressão", "Análise do Comportamento"],
    approach: "Análise do Comportamento"
  },
  
  // Informações de contato
  contact: {
    whatsapp: "5515997646421",
    phoneDisplay: "+55 (15) 99764-6421",
    email: "michelcamargo.psi@gmail.com",
    social: {
      instagram: "@michelcamargo.psi",
      linkedin: "michel-camargo-psi"
    }
  },
  
  // Informações do consultório
  clinic: {
    name: "Consultório de Psicologia Michel de Camargo",
    address: {
      street: "Rua Antônio Ferreira, 171",
      neighborhood: "Parque Campolim",
      city: "Sorocaba",
      state: "SP",
      zip: "18047-636",
      country: "Brasil",
      coordinates: {
        lat: -23.493335284719095,
        lng: -47.47244788549275
      }
    },
    hours: {
      weekdays: "Segunda à Sexta",
      start: "8:00",
      end: "21:00",
      timezone: "America/Sao_Paulo",
      closedDays: ["Sexta", "Sábado", "Domingo"],
      note: "As consultas necessitam ser previamente agendadas.",
      ageRestriction: "* Atendimentos a partir de 20 anos de idade"
    }
  },
  
  // Página específica de contato
  page: {
    title: "Contato",
    description: "Entre em contato para esclarecer suas dúvidas e agendar sua consulta. Estou aqui para ajudar você em sua jornada de bem-estar emocional.",
    sections: {
      contactInfo: {
        title: "Informações de Contato",
        description: "Entre em contato através dos canais abaixo"
      },
      hours: {
        title: "Atendimento", 
        description: "Horários de funcionamento do consultório"
      },
      location: {
        title: "Localização no Mapa",
        description: "Encontre facilmente o consultório"
      }
    }
  },
  
  maxCharacters: {
    psychologistName: 50,
    phoneDisplay: 20,
    email: 50,
    address: 100,
    pageTitle: 50,
    pageDescription: 300,
    sectionTitle: 50,
    sectionDescription: 150
  }
};

export const DEFAULT_AGENDAMENTO_CONTENT = {
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
  ],
  maxCharacters: {
    title: 80,
    description: 200,
    cardTitle: 60,
    cardContent: 300
  }
};

export const DEFAULT_DIVISORIAS_CONTENT = {
  divisoria_1: {
    text: "Atendimento Segunda à Sexta das 8:00 às 21:00 - Consultas previamente agendadas para melhor atendimento",
    backgroundImage: "/assets/quotes/mindfulness.jpg"
  },
  divisoria_2: {
    text: "Plantão psicológico - serviço de atendimento pontual de suporte emocional imediato",
    backgroundImage: "/assets/quotes/growth.jpg"
  },
  divisoria_3: {
    text: "Psicoterapia online - modalidade que possibilita atendimento à distância com a mesma qualidade",
    backgroundImage: "/assets/quotes/journey.jpg"
  },
  divisoria_4: {
    text: "Ambiente acolhedor e sigiloso para seu bem-estar emocional e privacidade garantida",
    backgroundImage: "/assets/quotes/reflection.jpg"
  },
  divisoria_5: {
    text: "Primeira consulta com duração estendida para melhor compreensão do seu caso",
    backgroundImage: "/assets/quotes/rebuild.jpg"
  },
  divisoria_6: {
    text: "Acompanhamento contínuo e suporte em momentos de crise emocional",
    backgroundImage: "/assets/quotes/opportunity.jpg"
  },
  maxCharacters: {
    text: 150
  }
};

export const DEFAULT_CONTENT = {
  hero: DEFAULT_HERO_CONTENT,
  welcome: DEFAULT_WELCOME_CONTENT,
  services: DEFAULT_SERVICES_CONTENT,
  clinic: DEFAULT_CLINIC_CONTENT,
  about: DEFAULT_ABOUT_CONTENT,
  terapias: DEFAULT_TERAPIAS_CONTENT,
  avaliacoes: DEFAULT_AVALIACOES_CONTENT,
  contact: DEFAULT_CONTACT_CONTENT,
  agendamento: DEFAULT_AGENDAMENTO_CONTENT,
  divisorias: DEFAULT_DIVISORIAS_CONTENT,
} as const;