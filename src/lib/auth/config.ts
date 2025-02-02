import { AuthConfig } from '@supabase/supabase-js';

export const authConfig: AuthConfig = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  storageKey: 'fraqt-auth-token',
  flowType: 'pkce',
};
