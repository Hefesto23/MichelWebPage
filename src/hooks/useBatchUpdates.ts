import { useCallback } from 'react';
import { unstable_batchedUpdates } from 'react-dom';

/**
 * Hook customizado para batch updates
 * Agrupa múltiplas atualizações de estado em uma única re-renderização
 */
export const useBatchUpdates = () => {
  const batchUpdates = useCallback((callback: () => void) => {
    unstable_batchedUpdates(callback);
  }, []);

  const batchMultipleUpdates = useCallback((updates: Array<() => void>) => {
    unstable_batchedUpdates(() => {
      updates.forEach(update => update());
    });
  }, []);

  const batchObjectUpdates = useCallback(<T extends Record<string, any>>(
    setState: (updater: (prev: T) => T) => void,
    updates: Partial<T>
  ) => {
    unstable_batchedUpdates(() => {
      setState(prev => ({ ...prev, ...updates }));
    });
  }, []);

  return {
    batchUpdates,
    batchMultipleUpdates,
    batchObjectUpdates,
  };
};