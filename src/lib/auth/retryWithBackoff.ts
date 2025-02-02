import { AuthError } from '@supabase/supabase-js';

interface RetryOptions {
  maxAttempts?: number;
  initialDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 5000,
    shouldRetry = (error) => {
      return (
        error?.name === 'AuthRetryableFetchError' ||
        error?.name === 'FetchError' ||
        error?.status === 0
      );
    },
  } = options;

  let attempts = 0;
  let delay = initialDelay;

  const isOnline = () => navigator.onLine;

  while (attempts < maxAttempts) {
    try {
      if (!isOnline()) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      return await operation();
    } catch (error) {
      attempts++;

      if (attempts === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      console.warn(`Auth operation failed, retrying (${attempts}/${maxAttempts})...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, maxDelay);
      continue;
    }
  }

  throw new Error('Connection failed. Please check your internet and try again.');
}
