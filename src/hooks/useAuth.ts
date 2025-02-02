import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import { getAuthErrorMessage } from '../lib/auth/errors';
import { retryWithBackoff } from '../lib/auth/retryWithBackoff';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      if (!navigator.onLine) {
        throw new Error(
          'No internet connection available. Please check your network connection and try again.'
        );
      }

      const {
        data: { user },
        error,
      } = await retryWithBackoff(() =>
        supabase.auth.signInWithPassword({
          email,
          password,
        })
      );

      if (error) {
        throw new Error(getAuthErrorMessage(error));
      }

      setUser(user);
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      if (!navigator.onLine) {
        throw new Error(
          'No internet connection available. Please check your network connection and try again.'
        );
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new Error(getAuthErrorMessage(error));
      }

      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw error;
    }
  }, []);

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
