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
      original: "https://picsum.photos/800/600",
      thumbnail: "https://picsum.photos/800/600",
      originalAlt: "Espaço de Consultório - Área de Acolhimento",
      originalTitle: "Espaço de Consultório",
      description: "Ambiente acolhedor e tranquilo projetado para proporcionar conforto e segurança.",
      order: 1,
      active: true
    },
    {
      id: 2,
      original: "https://picsum.photos/800/600",
      thumbnail: "https://picsum.photos/800/600",
      originalAlt: "Espaço de Consultório - Sala de Terapia",
      originalTitle: "Sala de Terapia",
      description: "Sala de terapia com iluminação natural e design minimalista para promover relaxamento.",
      order: 2,
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

export const DEFAULT_CONTENT = {
  hero: DEFAULT_HERO_CONTENT,
  welcome: DEFAULT_WELCOME_CONTENT,
  services: DEFAULT_SERVICES_CONTENT,
  clinic: DEFAULT_CLINIC_CONTENT,
  about: DEFAULT_ABOUT_CONTENT,
} as const;