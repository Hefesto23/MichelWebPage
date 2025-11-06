// src/lib/env.ts
/**
 * 🌍 Configuração Centralizada de Ambiente
 *
 * Este arquivo centraliza toda a detecção de ambiente e configurações
 * relacionadas, garantindo consistência em toda a aplicação.
 *
 * AMBIENTES SUPORTADOS:
 * - development: Local (npm run dev)
 * - preview/staging: Vercel Preview Deployments (VERCEL_ENV=preview)
 * - production: Vercel Production (VERCEL_ENV=production)
 */

// ============================================
// 🎯 DETECÇÃO DE AMBIENTE
// ============================================

/**
 * Sistema de detecção de ambiente usando APP_ENV
 *
 * PROBLEMA: Next.js sobrescreve NODE_ENV automaticamente:
 * - npm run dev → NODE_ENV="development" (sempre)
 * - npm run build → NODE_ENV="production" (sempre)
 *
 * SOLUÇÃO: Usar APP_ENV para controlar o ambiente real
 *
 * PRIORIDADE:
 * 1. APP_ENV (customizado, não sobrescrito pelo Next.js)
 * 2. VERCEL_ENV (fornecido automaticamente pelo Vercel)
 * 3. Fallback para development
 *
 * VALORES SUPORTADOS:
 * - APP_ENV="development" → michel-psi/dev
 * - APP_ENV="staging" → michel-psi/staging
 * - APP_ENV="production" → michel-psi/prod
 * - VERCEL_ENV="preview" → michel-psi/staging (Vercel Preview)
 * - VERCEL_ENV="production" → michel-psi/prod (Vercel Production)
 */

// Detectar ambiente atual baseado em APP_ENV, VERCEL_ENV e NODE_ENV
const detectEnvironment = (): "production" | "staging" | "development" => {
  // 1. PRIORIDADE: APP_ENV (não é sobrescrito pelo Next.js)
  const appEnv = process.env.APP_ENV;

  if (appEnv === "production") return "production";
  if (appEnv === "staging") return "staging";
  if (appEnv === "development") return "development";

  // 2. VERCEL_ENV (quando deployado no Vercel)
  const vercelEnv = process.env.VERCEL_ENV;

  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "staging";

  // 3. FALLBACK: development
  return "development";
};

const currentEnv = detectEnvironment();

export const ENV = {
  // Ambiente Node.js padrão
  NODE_ENV: process.env.NODE_ENV || "development",

  // Ambiente Vercel (se disponível)
  VERCEL_ENV: process.env.VERCEL_ENV,

  // Ambiente detectado (híbrido)
  CURRENT_ENV: currentEnv,

  // Helpers de detecção
  IS_PRODUCTION: currentEnv === "production",
  IS_STAGING: currentEnv === "staging",
  IS_DEVELOPMENT: currentEnv === "development",
} as const;

// ============================================
// ☁️ CONFIGURAÇÃO CLOUDINARY
// ============================================

export const CLOUDINARY_CONFIG = {
  // Credenciais (obrigatórias)
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  API_SECRET: process.env.CLOUDINARY_API_SECRET!,

  // Pasta base do projeto
  BASE_FOLDER: "michel-psi",

  /**
   * 🗂️ Determina a pasta do Cloudinary baseado no ambiente
   *
   * Estrutura:
   * - michel-psi/prod     → Production (vercel.com/production)
   * - michel-psi/staging  → Staging (vercel.com/preview)
   * - michel-psi/dev      → Development (localhost)
   *
   * OVERRIDE: Use CLOUDINARY_FOLDER no .env para forçar uma pasta específica
   */
  getFolder: (): string => {
    // Permitir override manual via env var (útil para testes)
    if (process.env.CLOUDINARY_FOLDER) {
      return process.env.CLOUDINARY_FOLDER;
    }

    const baseFolder = CLOUDINARY_CONFIG.BASE_FOLDER;

    // Detecção automática baseada no ambiente
    if (ENV.IS_PRODUCTION) {
      console.log("📁 Cloudinary folder: production");
      return `${baseFolder}/prod`;
    }

    if (ENV.IS_STAGING) {
      console.log("📁 Cloudinary folder: staging");
      return `${baseFolder}/staging`;
    }

    // Development (local)
    console.log("📁 Cloudinary folder: development");
    return `${baseFolder}/dev`;
  },

  /**
   * 🖼️ Normaliza public_id para garantir o folder correto
   *
   * Casos tratados:
   * 1. URL completa Cloudinary → extrai public_id
   * 2. public_id com folder → mantém
   * 3. public_id sem folder → adiciona folder do ambiente atual
   *
   * @param publicIdOrUrl - Public ID ou URL completa
   * @returns Public ID normalizado com folder correto
   */
  normalizePublicId: (publicIdOrUrl: string): string => {
    if (!publicIdOrUrl) return "";

    // Se é URL completa do Cloudinary, extrair public_id
    if (publicIdOrUrl.includes("cloudinary.com") || publicIdOrUrl.includes("res.cloudinary.com")) {
      const publicId = extractPublicIdFromUrl(publicIdOrUrl);
      return publicId;
    }

    // Se já começa com o BASE_FOLDER, está OK
    if (publicIdOrUrl.startsWith(`${CLOUDINARY_CONFIG.BASE_FOLDER}/`)) {
      return publicIdOrUrl;
    }

    // Caso contrário, adicionar folder do ambiente atual
    const folder = CLOUDINARY_CONFIG.getFolder();
    return `${folder}/${publicIdOrUrl}`;
  },

  /**
   * 🔗 Gera URL completa do Cloudinary para um public_id
   *
   * @param publicId - Public ID (com ou sem folder)
   * @param transformations - Transformações adicionais (opcional)
   * @returns URL completa e segura
   */
  getImageUrl: (publicId: string, transformations?: string): string => {
    const normalizedId = CLOUDINARY_CONFIG.normalizePublicId(publicId);
    const cloudName = CLOUDINARY_CONFIG.CLOUD_NAME;

    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

    if (transformations) {
      return `${baseUrl}/${transformations}/${normalizedId}`;
    }

    return `${baseUrl}/${normalizedId}`;
  },

  /**
   * 📋 Lista imagens de um ambiente específico
   *
   * @param environment - 'prod' | 'staging' | 'dev' | undefined (usa atual)
   * @returns Folder path para busca
   */
  getFolderForEnvironment: (environment?: "prod" | "staging" | "dev"): string => {
    if (!environment) {
      return CLOUDINARY_CONFIG.getFolder();
    }

    return `${CLOUDINARY_CONFIG.BASE_FOLDER}/${environment}`;
  },
} as const;

// ============================================
// 🛠️ HELPERS
// ============================================

/**
 * Extrai public_id de uma URL completa do Cloudinary
 *
 * Exemplos suportados:
 * - https://res.cloudinary.com/cloud/image/upload/v123/michel-psi/prod/image.jpg
 * - https://res.cloudinary.com/cloud/image/upload/michel-psi/staging/image.jpg
 * - https://res.cloudinary.com/cloud/image/upload/w_300/michel-psi/dev/image.jpg
 *
 * @param url - URL completa do Cloudinary
 * @returns Public ID extraído (ex: "michel-psi/prod/image")
 */
function extractPublicIdFromUrl(url: string): string {
  try {
    // Padrão: .../upload/[transformations]/[v123]/public_id.ext
    // Queremos capturar: public_id (sem extensão)

    // Remover query params e fragmentos
    const cleanUrl = url.split("?")[0].split("#")[0];

    // Encontrar /upload/ e pegar tudo depois
    const uploadIndex = cleanUrl.indexOf("/upload/");
    if (uploadIndex === -1) {
      console.warn("⚠️ URL não contém /upload/:", url);
      return url;
    }

    const afterUpload = cleanUrl.substring(uploadIndex + 8); // 8 = length of '/upload/'

    // Remover versão (v1234567890) se existir
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");

    // Remover transformações (tudo antes de michel-psi)
    const parts = withoutVersion.split("/");
    const michelsIndex = parts.findIndex((part) => part === "michel-psi");

    if (michelsIndex === -1) {
      console.warn("⚠️ Public ID não contém 'michel-psi':", url);
      // Tentar pegar tudo após última transformação
      const lastPart = withoutVersion.split("/").slice(-3).join("/"); // últimos 3 segmentos
      return lastPart.replace(/\.[^/.]+$/, ""); // remover extensão
    }

    // Pegar do michel-psi até o final
    const publicIdWithExt = parts.slice(michelsIndex).join("/");

    // Remover extensão
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    console.error("❌ Erro ao extrair public_id:", error);
    return url;
  }
}

// ============================================
// 📊 DEBUG HELPERS
// ============================================

/**
 * Loga informações do ambiente atual (útil para debugging)
 */
export function logEnvironmentInfo(): void {
  console.log("🌍 Environment Info:");
  console.log("  NODE_ENV:", ENV.NODE_ENV);
  console.log("  VERCEL_ENV:", ENV.VERCEL_ENV);
  console.log("  Current Environment:", ENV.CURRENT_ENV);
  console.log("  Is Production:", ENV.IS_PRODUCTION);
  console.log("  Is Staging:", ENV.IS_STAGING);
  console.log("  Is Development:", ENV.IS_DEVELOPMENT);
  console.log("  Cloudinary Folder:", CLOUDINARY_CONFIG.getFolder());
}

/**
 * Valida se as configurações necessárias estão presentes
 */
export function validateEnvironmentConfig(): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
    errors.push("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME não configurado");
  }

  if (!CLOUDINARY_CONFIG.API_KEY) {
    errors.push("NEXT_PUBLIC_CLOUDINARY_API_KEY não configurado");
  }

  if (!CLOUDINARY_CONFIG.API_SECRET) {
    errors.push("CLOUDINARY_API_SECRET não configurado");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
