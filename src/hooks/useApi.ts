import { useState, useCallback } from 'react';
import { api } from '../lib/api';
import type { Member, Pass } from '../lib/api/types';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    members: {
      list: () => execute(() => api.members.list()),
      get: (id: string) => execute(() => api.members.get(id)),
      create: (data: Omit<Member, 'id'>) => execute(() => api.members.create(data)),
      update: (id: string, data: Partial<Member>) => execute(() => api.members.update(id, data)),
      delete: (id: string) => execute(() => api.members.delete(id)),
    },
    passes: {
      list: () => execute(() => api.passes.list()),
      get: (id: string) => execute(() => api.passes.get(id)),
      create: (data: Omit<Pass, 'id'>) => execute(() => api.passes.create(data)),
      update: (id: string, data: Partial<Pass>) => execute(() => api.passes.update(id, data)),
      remove: (id: string) => execute(() => api.passes.remove(id)),
    },
    analytics: {
      get: () => execute(() => api.analytics.get()),
    },
  };
}
