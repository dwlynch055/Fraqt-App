import { beforeAll } from 'vitest';
import { supabase } from '../lib/supabase';

beforeAll(async () => {
  // Ensure we have a valid session before running tests
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session || error) {
    throw new Error('No valid session found. Please authenticate before running tests.');
  }

  console.log('Test setup complete - authenticated session found');
});
