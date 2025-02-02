import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PassTemplate, Pass } from '../types/database';

export function useDatabase() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMerchant = useCallback(
    async (data: any) => {
      return execute(async () => {
        const { data: merchant, error } = await supabase
          .from('merchants')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return merchant;
      });
    },
    [execute]
  );

  const createPassTemplate = useCallback(
    async (data: Omit<PassTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      return execute(async () => {
        const { data: template, error } = await supabase
          .from('pass_templates')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return template;
      });
    },
    [execute]
  );

  const createPass = useCallback(
    async (data: Omit<Pass, 'id' | 'created_at' | 'updated_at'>) => {
      return execute(async () => {
        const { data: pass, error } = await supabase
          .from('passes')
          .insert([data])
          .select()
          .single();

        if (error) throw error;
        return pass;
      });
    },
    [execute]
  );

  const getPassesWithTemplates = useCallback(
    async (merchantId: string) => {
      return execute(async () => {
        const { data, error } = await supabase
          .from('passes')
          .select(
            `
          *,
          template:pass_templates(*)
        `
          )
          .eq('merchant_id', merchantId);

        if (error) throw error;
        return data;
      });
    },
    [execute]
  );

  const inviteMember = useCallback(
    async (merchantId: string, email: string, role: string) => {
      return execute(async () => {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // First check if there's already a pending invitation
        const { data: existingInvitation } = await supabase
          .from('team_invitations')
          .select('*')
          .eq('merchant_id', merchantId)
          .eq('email', email)
          .eq('status', 'pending')
          .single();

        if (existingInvitation) {
          throw new Error('An invitation has already been sent to this email');
        }

        // Create new invitation
        const { data: invitation, error } = await supabase
          .from('team_invitations')
          .insert([
            {
              merchant_id: merchantId,
              email,
              role,
              status: 'pending',
              expires_at: expiresAt.toISOString(),
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error('Failed to send invitation');
        }

        return invitation;
      });
    },
    [execute]
  );

  return {
    loading,
    error,
    createMerchant,
    createPassTemplate,
    createPass,
    getPassesWithTemplates,
    inviteMember,
  };
}
