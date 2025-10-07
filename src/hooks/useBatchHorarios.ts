import { useState, useEffect, useCallback, useRef } from 'react';
import { format } from 'date-fns';

interface UseBatchHorariosResult {
  horarios: Record<string, string[]>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  getHorariosForDate: (date: string) => string[];
}

const REVALIDATE_INTERVAL = 30000; // 30 segundos

/**
 * Hook customizado para batch prefetch de horários disponíveis
 * Busca TODAS as datas do período de uma vez e revalida periodicamente
 */
export const useBatchHorarios = (
  startDate: Date,
  endDate: Date
): UseBatchHorariosResult => {
  const [horarios, setHorarios] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchBatch = useCallback(async (isInitialLoad = false) => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      if (isInitialLoad) {
        setLoading(true);
      }

      const start = format(startDate, 'yyyy-MM-dd');
      const end = format(endDate, 'yyyy-MM-dd');

      console.log(`🚀 Prefetch batch: ${start} até ${end}`);

      const response = await fetch(
        `/api/calendario/horarios/batch?startDate=${start}&endDate=${end}`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar horários em lote');
      }

      const data = await response.json();

      console.log(`✅ Batch recebido: ${Object.keys(data).length} datas`);

      setHorarios(data);
      setError(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('🚫 Requisição cancelada');
        return;
      }

      console.error('Erro no batch prefetch:', err);
      setError(err.message || 'Erro ao carregar horários');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  }, [startDate, endDate]);

  // Fetch inicial + setup de revalidação periódica
  useEffect(() => {
    // Fetch inicial
    fetchBatch(true);

    // Revalidar a cada 30 segundos (dados sempre frescos!)
    intervalRef.current = setInterval(() => {
      console.log('🔄 Revalidando horários em background...');
      fetchBatch(false);
    }, REVALIDATE_INTERVAL);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBatch]);

  // Helper para obter horários de uma data específica
  const getHorariosForDate = useCallback((date: string): string[] => {
    return horarios[date] || [];
  }, [horarios]);

  // Função para forçar refetch manual
  const refetch = useCallback(async () => {
    await fetchBatch(true);
  }, [fetchBatch]);

  return {
    horarios,
    loading,
    error,
    refetch,
    getHorariosForDate,
  };
};
