/**
 * Helper utility to resize and compress images (Files or data URLs) down to max dimensions
 * to fit safely inside localStorage without throwing QuotaExceededError.
 */
export function resizeImage(source: File | string, maxDim = 200, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    if (!source) {
      return resolve('');
    }

    // Standard http/https URLs don't need resizing
    if (typeof source === 'string' && !source.startsWith('data:image')) {
      return resolve(source);
    }

    // SVG data URLs don't need raster canvas resizing
    if (typeof source === 'string' && source.startsWith('data:image/svg+xml')) {
      return resolve(source);
    }

    if (source instanceof File && source.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(source);
      return;
    }

    const processImageObj = (img: HTMLImageElement, fallbackUrl: string) => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width || maxDim;
        let height = img.height || maxDim;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedDataUrl = canvas.toDataURL('image/png', quality);
          resolve(resizedDataUrl);
        } else {
          resolve(fallbackUrl);
        }
      } catch (err) {
        console.warn('Error resizing image on canvas:', err);
        resolve(fallbackUrl);
      }
    };

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (!dataUrl) return resolve('');
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => processImageObj(img, dataUrl);
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(source);
    } else {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => processImageObj(img, source);
      img.onerror = () => resolve(source);
      img.src = source;
    }
  });
}
