export function generateThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      video.onerror = reject;
      video.src = URL.createObjectURL(file);
    } else {
      resolve(URL.createObjectURL(file));
    }
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateMediaFile(file: File): string | null {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];

  if (!allowedTypes.includes(file.type)) {
    return 'File type not supported';
  }

  if (file.size > maxSize) {
    return 'File size exceeds 10MB limit';
  }

  return null;
}

interface ImageDimensionsResult {
  valid: boolean;
  message: string;
  width?: number;
  height?: number;
}

export function validateImageDimensions(file: File): Promise<ImageDimensionsResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const MIN_WIDTH = 400;
      const MIN_HEIGHT = 400;
      const MAX_WIDTH = 4096;
      const MAX_HEIGHT = 4096;

      if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
        resolve({
          valid: false,
          message: `Image dimensions must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels`,
          width: img.width,
          height: img.height
        });
      } else if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
        resolve({
          valid: false,
          message: `Image dimensions cannot exceed ${MAX_WIDTH}x${MAX_HEIGHT} pixels`,
          width: img.width,
          height: img.height
        });
      } else {
        resolve({
          valid: true,
          message: 'Image dimensions are valid',
          width: img.width,
          height: img.height
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        valid: false,
        message: 'Failed to load image for dimension validation'
      });
    };
  });
}