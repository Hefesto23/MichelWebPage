/**
 * Utilitários para timeout e retry logic
 */

interface TimeoutOptions {
  timeoutMs: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Executa uma Promise com timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Executa uma operação com retry logic
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: TimeoutOptions
): Promise<T> {
  const { timeoutMs, retries = 2, retryDelayMs = 1000 } = options;
  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await withTimeout(
        operation(),
        timeoutMs,
        `Operation timed out after ${timeoutMs}ms (attempt ${attempt + 1})`
      );
      
      if (attempt > 0) {
        console.log(`✅ Operação sucedeu na tentativa ${attempt + 1}`);
      }
      
      return result;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < retries) {
        console.log(`⚠️ Tentativa ${attempt + 1} falhou, tentando novamente em ${retryDelayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  console.error(`❌ Operação falhou após ${retries + 1} tentativas`);
  throw lastError!;
}

/**
 * Configurações específicas para diferentes operações
 */
export const TIMEOUT_CONFIGS = {
  GOOGLE_CALENDAR: {
    timeoutMs: 8000, // 8 segundos
    retries: 1,
    retryDelayMs: 500,
  },
  DATABASE: {
    timeoutMs: 5000, // 5 segundos
    retries: 2,
    retryDelayMs: 300,
  },
  EMAIL: {
    timeoutMs: 10000, // 10 segundos
    retries: 1,
    retryDelayMs: 1000,
  },
} as const;