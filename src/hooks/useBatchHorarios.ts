import { useState, useEffect, useCallback, useRef } from 'react';
import { format, addDays } from 'date-fns';

interface UseBatchHorariosResult {
  horarios: Record<string, string[]>;
  loading: boolean;
  loadingMore: boolean;
  ready: boolean; // ✅ NOVO: Calendário pode renderizar após quick batch
  error: string | null;
  progress: number;
  refetch: () => Promise<void>;
  getHorariosForDate: (date: string) => string[];
  loadMoreDates: (startDate: Date, endDate: Date) => Promise<void>;
  hasDateRange: (startDate: Date, endDate: Date) => boolean;
  loadedRange: { minDate: string | null; maxDate: string | null };
}

interface UseBatchHorariosOptions {
  onProgress?: (progress: number) => void;
}

const REVALIDATE_INTERVAL = 30000; // 30 segundos

/**
 * Hook customizado para batch prefetch de horários disponíveis
 * Busca horários de forma incremental e revalida periodicamente
 */
export const useBatchHorarios = (
  initialStartDate: Date,
  initialDays: number = 30,
  options?: UseBatchHorariosOptions
): UseBatchHorariosResult => {
  const [horarios, setHorarios] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ready, setReady] = useState(false); // ✅ NOVO: Estado de prontidão
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dateRanges, setDateRanges] = useState<Set<string>>(new Set());
  const [loadedRange, setLoadedRange] = useState<{
    minDate: string | null;
    maxDate: string | null;
  }>({ minDate: null, maxDate: null });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Notificar progresso via callback
  const updateProgress = useCallback((value: number) => {
    setProgress(value);
    options?.onProgress?.(value);
  }, [options]);

  // Função para verificar se já temos um intervalo de datas
  const hasDateRange = useCallback((startDate: Date, endDate: Date): boolean => {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    const rangeKey = `${start}:${end}`;
    return dateRanges.has(rangeKey);
  }, [dateRanges]);

  // Função para carregar mais datas (incremental)
  const loadMoreDates = useCallback(async (startDate: Date, endDate: Date) => {
    const start = format(startDate, 'yyyy-MM-dd');
    const end = format(endDate, 'yyyy-MM-dd');
    const rangeKey = `${start}:${end}`;

    // Se já carregamos esse range, skip
    if (dateRanges.has(rangeKey)) {
      console.log(`✅ Range já em cache: ${start} até ${end}`);
      return;
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      setLoadingMore(true);
      updateProgress(30);

      console.log(`🔄 Carregando mais datas: ${start} até ${end}`);

      const response = await fetch(
        `/api/calendario/horarios/batch?startDate=${start}&endDate=${end}`,
        { signal: abortControllerRef.current.signal }
      );

      updateProgress(70);

      if (!response.ok) {
        throw new Error('Erro ao buscar horários');
      }

      const data = await response.json();

      // Merge com dados existentes
      setHorarios(prev => ({ ...prev, ...data }));
      setDateRanges(prev => {
        const newSet = new Set(prev);
        newSet.add(rangeKey);
        return newSet;
      });

      // Atualizar range de datas carregadas
      setLoadedRange(prev => {
        const newMin = !prev.minDate || start < prev.minDate ? start : prev.minDate;
        const newMax = !prev.maxDate || end > prev.maxDate ? end : prev.maxDate;
        return { minDate: newMin, maxDate: newMax };
      });

      setError(null);
      updateProgress(100);

      console.log(`✅ Carregado +${Object.keys(data).length} datas`);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('🚫 Requisição cancelada');
        return;
      }

      console.error('Erro ao carregar mais datas:', err);
      setError(err.message || 'Erro ao carregar horários');
      updateProgress(0);
    } finally {
      setLoadingMore(false);
    }
  }, [dateRanges, updateProgress]);

  // Fetch inicial com estratégia de 7 dias + background loading
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        updateProgress(10);

        // ⚡ QUICK BATCH: Carregar 7 dias PRIMEIRO (libera calendário)
        const quickEndDate = addDays(initialStartDate, 7);
        console.log(`⚡ Quick batch: Primeiros 7 dias...`);

        await loadMoreDates(initialStartDate, quickEndDate);

        // ✅ LIBERAR CALENDÁRIO AGORA
        setReady(true);
        updateProgress(35);
        console.log(`✅ Calendário pronto! Carregando restante em background...`);

        // 🔄 BACKGROUND LOADING: Carregar restante sem bloquear
        if (initialDays > 7) {
          const fullEndDate = addDays(initialStartDate, initialDays);
          console.log(`🔄 Background: Carregando ${initialDays - 7} dias restantes...`);

          await loadMoreDates(addDays(initialStartDate, 8), fullEndDate);
          console.log(`✅ Batch completo: ${initialDays} dias carregados`);
        }

        updateProgress(100);
      } catch (err) {
        console.error('Erro no carregamento inicial:', err);
        // Se falhar, ainda deixar ready=true para não bloquear calendário
        setReady(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();

    // Setup de revalidação periódica (apenas para ranges já carregados)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Note: Este useEffect deve rodar apenas no mount inicial
    intervalRef.current = setInterval(() => {
      if (dateRanges.size > 0 && !loading && !loadingMore) {
        console.log('🔄 Revalidando horários em background...');
        // Revalidar primeiro range (mais recente)
        const rangesArray = Array.from(dateRanges.values());
        const firstRange = rangesArray[0];
        const [start, end] = firstRange.split(':');

        fetch(`/api/calendario/horarios/batch?startDate=${start}&endDate=${end}`)
          .then(res => res.json())
          .then(data => {
            setHorarios(prev => ({ ...prev, ...data }));
            console.log('✅ Revalidação completa');
          })
          .catch(err => console.error('Erro na revalidação:', err));
      }
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
  }, []); // Apenas no mount

  // Helper para obter horários de uma data específica
  const getHorariosForDate = useCallback((date: string): string[] => {
    return horarios[date] || [];
  }, [horarios]);

  // Função para forçar refetch manual
  const refetch = useCallback(async () => {
    setLoading(true);
    setDateRanges(new Set());
    setHorarios({});
    setLoadedRange({ minDate: null, maxDate: null }); // Reset range

    const endDate = addDays(initialStartDate, initialDays);
    await loadMoreDates(initialStartDate, endDate);

    setLoading(false);
  }, [initialStartDate, initialDays, loadMoreDates]);

  return {
    horarios,
    loading,
    loadingMore,
    ready, // ✅ NOVO: Estado de prontidão do calendário
    error,
    progress,
    refetch,
    getHorariosForDate,
    loadMoreDates,
    hasDateRange,
    loadedRange,
  };
};
