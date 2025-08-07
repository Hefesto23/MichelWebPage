// src/utils/default-content.ts
// Conteúdos padrão das páginas - fallback quando não há dados no banco

export const DEFAULT_HERO_CONTENT = {
  mainText: "Já pensou em como seria ter uma vida mais tranquila e leve, com menos ansiedade? Lidar com isso pode ser difícil, mas você não precisa enfrentar tudo sozinho. Como psicólogo, estou aqui para te ouvir, acolher e ajudar a encontrar caminhos que tragam mais calma e equilíbrio ao seu dia a dia. Cada passo nessa jornada é importante, e eu estarei ao seu lado para apoiar você em cada um deles!",
  ctaText: "Agende sua consulta e comece a reescrever sua história hoje mesmo:",
  disclaimer: "*Atendimentos a partir de 20 anos de idade",
  // Limites de caracteres para manter estrutura
  maxCharacters: {
    mainText: 600, // Limite para texto principal
    ctaText: 100,  // Limite para call-to-action
    disclaimer: 50 // Limite para disclaimer
  }
};

export const DEFAULT_CONTENT = {
  hero: DEFAULT_HERO_CONTENT,
  // Aqui podem ser adicionados outros conteúdos padrão futuramente
  // about: DEFAULT_ABOUT_CONTENT,
  // services: DEFAULT_SERVICES_CONTENT,
} as const;