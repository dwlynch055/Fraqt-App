import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ProfileData {
  name: string;
  phone: string;
  sidebar_collapsed?: boolean;
}

export function useProfile(user: User | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateProfile = useCallback(async (data: ProfileData) => {
    if (!user) throw new Error('No user logged in');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: data.name,
          phone: data.phone,
          sidebar_collapsed: data.sidebar_collapsed,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update profile'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getProfile = useCallback(async () => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // First try to get existing profile
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one
      if (error && error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{ id: user.id }])
          .select()
          .single();
          
        if (createError) throw createError;
        return newProfile;
      } else if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    error,
    updateProfile,
    getProfile
  };
}