import { useState } from 'react';
import { petService } from '../lib/supabase/services';

export function useMediaUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadMedia = async (files: File[]): Promise<{ url: string }[]> => {
    try {
      setUploading(true);
      setError(null);

      // Since our service only handles single file upload,
      // we'll upload the first file only
      const file = files[0];
      if (!file) {
        throw new Error('No file provided');
      }

      const url = await petService.uploadFile(file);
      
      return [{ url }];
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to upload media');
      setError(error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadMedia,
    uploading,
    error
  };
}