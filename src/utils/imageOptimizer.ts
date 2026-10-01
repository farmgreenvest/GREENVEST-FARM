/**
 * Greenvest Image Optimization Utility
 * Automatically compresses client-side uploaded images before saving
 * to prevent localStorage QuotaExceededError and ensure fast page loads.
 */

export interface OptimizeImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.8)
  format?: 'image/jpeg' | 'image/webp';
}

/**
 * Optimizes an uploaded File object (PNG, JPEG, WEBP, etc.)
 * Resizes to reasonable web dimensions and compresses using HTML5 Canvas.
 * Falls back to raw data URL if canvas processing fails or for SVGs.
 */
export async function optimizeImageFile(
  file: File,
  options: OptimizeImageOptions = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8, format = 'image/jpeg' } = options;

  // SVG files are vectors - do not rasterize/compress via canvas
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => resolve('');
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      if (!rawDataUrl) return resolve('');

      const img = new Image();
      img.onerror = () => resolve(rawDataUrl);
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate scaled dimensions keeping aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(rawDataUrl);
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Fill white background for transparent images converted to JPEG
          if (format === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          const compressed = canvas.toDataURL(format, quality);
          resolve(compressed);
        } catch {
          // If any canvas error occurs, fallback safely to raw data URL
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Optimizes an existing base64 Data URL if it exceeds max size threshold.
 */
export async function optimizeImageDataUrl(
  dataUrl: string,
  options: OptimizeImageOptions = {}
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return dataUrl;
  if (dataUrl.startsWith('data:image/svg+xml')) return dataUrl;

  // If already under 120KB, don't recompress
  if (dataUrl.length < 120000) return dataUrl;

  const { maxWidth = 1200, maxHeight = 1200, quality = 0.78, format = 'image/jpeg' } = options;

  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      try {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL(format, quality);
        resolve(compressed);
      } catch {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}
