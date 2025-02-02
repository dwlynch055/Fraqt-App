import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useDataStore } from '../stores/dataStore';

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  created_by: string;
  merchant_id: string;
}

export function useApiKeys(user: User | null) {
  const { apiKeys, setApiKeys } = useDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getApiKeys = useCallback(async (merchantId: string) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    if (apiKeys) {
      return apiKeys;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select(`
          id,
          name,
          key_prefix,
          created_at,
          last_used_at,
          created_by,
          merchant_id
        `)
        .eq('merchant_id', merchantId);

      if (error) throw error;
      setApiKeys(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch API keys'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createApiKey = useCallback(async (merchantId: string, name: string) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      // Generate a random API key and prefix
      const keyBytes = Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const key = `sk_live_${keyBytes}`;
      const keyPrefix = `sk_live_${keyBytes.slice(0, 8)}`;

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          merchant_id: merchantId,
          name,
          key_hash: key, // This will be hashed by the database trigger
          key_prefix: keyPrefix,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create API key'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteApiKey = useCallback(async (id: string) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete API key'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    getApiKeys,
    createApiKey,
    deleteApiKey
  };
}