import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useDataStore } from '../stores/dataStore';

interface TeamMember {
  id: string;
  user_id: string;
  merchant_id: string;
  role: string;
  user: {
    email: string;
    created_at: string;
  };
  created_at: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export function useTeam(merchantId: string | undefined) {
  const { members, invitations, setTeamData } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!merchantId) {
      setLoading(false);
      return;
    }

    async function fetchTeam() {
      try {
        // Fetch team members
        const { data: membersData, error: membersError } = await supabase
          .from('merchant_users_with_details')
          .select('*')
          .eq('merchant_id', merchantId);

        if (membersError) throw membersError;

        // Fetch invitations
        const { data: invitationsData, error: invitationsError } = await supabase
          .from('team_invitations')
          .select('*')
          .eq('merchant_id', merchantId)
          .eq('status', 'pending');

        if (invitationsError) throw invitationsError;
        setTeamData(
          Array.isArray(membersData) ? membersData as TeamMember[] : [],
          Array.isArray(invitationsData) ? invitationsData : []
        );
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch team'));
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, [merchantId]);

  return { members, invitations, loading, error };
}