import { useState, useEffect } from 'react';
import type { Merchant } from '../types/database';
import { mockMerchant } from '../lib/mock-data';

export function useMerchant(userId: string | undefined) {
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    async function fetchMerchant() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
        setMerchant(mockMerchant);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch merchant'));
      } finally {
        setLoading(false);
      }
    }

    fetchMerchant();
  }, [userId]);

  return { merchant, loading, error };
}
