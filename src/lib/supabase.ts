import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';

// Use demo values if env vars are not set (development only)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjUwMzY4MywiZXhwIjoxOTM4MDc5NjgzfQ.KxYwV_O9t3vStD0NpKo3x3fZ6gxVrz2ktA1BzF3Rp2s';

const options: SupabaseClientOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        timeout: 30000, // 30 second timeout
      });
    },
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
