import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Analytics } from '../types/database';
import { useDataStore } from '../stores/dataStore';

export function useAnalytics(merchantId: string | undefined) {
  const { analytics, setAnalytics } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!merchantId || analytics) {
      setLoading(false);
      return;
    }

    async function fetchAnalytics() {
      try {
        const { data, error } = await supabase
          .rpc('get_merchant_analytics', { merchant_id_param: merchantId });

        if (error) throw error;
        setAnalytics(data as Analytics);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [merchantId, analytics, setAnalytics]);

  return { data: analytics, loading, error };
}