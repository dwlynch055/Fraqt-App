import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface UploadOptions {
  bucket: 'profile-images' | 'pass-assets' | 'certificates';
  path: string;
  file: File;
  onProgress?: (progress: number) => void;
}

export interface StorageError extends Error {
  statusCode?: number;
}

export function useStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<StorageError | null>(null);

  const upload = useCallback(async ({ bucket, path, file, onProgress }: UploadOptions) => {
    setLoading(true);
    setError(null);

    try {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Upload file
      const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        onUploadProgress: onProgress
          ? (progress) => onProgress((progress.loaded / progress.total) * 100)
          : undefined,
      });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(data.path);

      return { path: data.path, url: publicUrl };
    } catch (err) {
      const storageError: StorageError = err instanceof Error ? err : new Error('Upload failed');

      if (err instanceof Error && 'statusCode' in err) {
        storageError.statusCode = (err as any).statusCode;
      }

      setError(storageError);
      throw storageError;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (bucket: string, path: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) throw error;
    } catch (err) {
      const storageError: StorageError = err instanceof Error ? err : new Error('Delete failed');

      setError(storageError);
      throw storageError;
    } finally {
      setLoading(false);
    }
  }, []);

  const list = useCallback(async (bucket: string, path: string = '') => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.storage.from(bucket).list(path);

      if (error) throw error;
      return data;
    } catch (err) {
      const storageError: StorageError = err instanceof Error ? err : new Error('List failed');

      setError(storageError);
      throw storageError;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    upload,
    remove,
    list,
  };
}
