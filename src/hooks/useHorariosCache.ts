import { useRef, useCallback, useState } from 'react';

interface CacheEntry {
  data: any;
  timestamp: number;
  loading: boolean;
}

interface UseHorariosCacheResult {
  fetchHorarios: (data: string) => Promise<any>;
  clearCache: () => void;
  getCachedData: (data: string) => any | null;
  isLoading: (data: string) => boolean;
}

const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutos

/**
 * Hook customizado para cache inteligente de horários
 * Evita requisições desnecessárias e melhora performance
 */
export const useHorariosCache = (): UseHorariosCacheResult => {
  const cache = useRef<Map<string, CacheEntry>>(new Map());
  const [, forceUpdate] = useState(0);

  // Força re-render quando necessário
  const triggerUpdate = useCallback(() => {
    forceUpdate(prev => prev + 1);
  }, []);

  const isCacheValid = useCallback((entry: CacheEntry): boolean => {
    return Date.now() - entry.timestamp < CACHE_EXPIRY_TIME;
  }, []);

  const fetchHorarios = useCallback(async (data: string): Promise<any> => {
    const cacheKey = data;
    const cachedEntry = cache.current.get(cacheKey);

    // Se já está carregando, aguarda o resultado
    if (cachedEntry?.loading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          const entry = cache.current.get(cacheKey);
          if (entry && !entry.loading) {
            clearInterval(checkInterval);
            resolve(entry.data);
          }
        }, 100);
      });
    }

    // Se tem cache válido, retorna
    if (cachedEntry && isCacheValid(cachedEntry)) {
      return cachedEntry.data;
    }

    // Marca como carregando
    cache.current.set(cacheKey, {
      data: null,
      timestamp: Date.now(),
      loading: true,
    });
    
    triggerUpdate();

    try {
      const response = await fetch(`/api/calendario/horarios?data=${data}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar horários');
      }
      
      const result = await response.json();

      // Atualiza cache com resultado
      cache.current.set(cacheKey, {
        data: result,
        timestamp: Date.now(),
        loading: false,
      });

      triggerUpdate();
      return result;
    } catch (error) {
      // Remove entrada em caso de erro
      cache.current.delete(cacheKey);
      triggerUpdate();
      throw error;
    }
  }, [isCacheValid, triggerUpdate]);

  const clearCache = useCallback(() => {
    cache.current.clear();
    triggerUpdate();
  }, [triggerUpdate]);

  const getCachedData = useCallback((data: string): any | null => {
    const entry = cache.current.get(data);
    return entry && isCacheValid(entry) ? entry.data : null;
  }, [isCacheValid]);

  const isLoading = useCallback((data: string): boolean => {
    const entry = cache.current.get(data);
    return entry?.loading || false;
  }, []);

  return {
    fetchHorarios,
    clearCache,
    getCachedData,
    isLoading,
  };
};