import React, { useCallback, useState } from 'react';
import { useStorage, type UploadOptions } from '../../hooks/useStorage';
import { Icons } from '../icons';

interface FileUploadProps {
  bucket: UploadOptions['bucket'];
  path: string;
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number;
  onError?: (error: Error) => void;
}

export function FileUpload({
  bucket,
  path,
  onUpload,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024,
  onError,
}: FileUploadProps) {
  const { upload, loading } = useStorage();
  const [progress, setProgress] = useState(0);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > maxSize) {
        const error = new Error(`File size must be less than ${maxSize / 1024 / 1024}MB`);
        onError?.(error);
        return;
      }

      try {
        const { url } = await upload({
          bucket,
          path: `${path}/${file.name}`,
          file,
          onProgress: setProgress,
        });
        onUpload(url);
      } catch (error) {
        console.error('Upload failed:', error);
        onError?.(error instanceof Error ? error : new Error('Upload failed'));
      }
    },
    [bucket, path, maxSize, upload, onUpload, onError]
  );

  return (
    <div className="relative">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
        disabled={loading}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
      <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-800 hover:border-gray-700">
        <div className="space-y-2 text-center">
          {loading ? (
            <div className="space-y-2">
              <Icons.Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
              <div className="text-sm text-gray-400">{Math.round(progress)}%</div>
            </div>
          ) : (
            <>
              <Icons.Upload className="mx-auto h-8 w-8 text-gray-400" />
              <div className="text-sm text-gray-400">
                <span className="font-medium">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-500">Max size: {maxSize / 1024 / 1024}MB</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
