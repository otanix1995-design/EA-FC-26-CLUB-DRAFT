/**
 * Helper utility to resize and compress images (Files or data URLs) down to max dimensions
 * to fit safely inside localStorage without throwing QuotaExceededError.
 */
export function resizeImage(source: File | string, maxDim = 180, quality = 0.8): Promise<string> {
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
        let width = img.naturalWidth || img.width || maxDim;
        let height = img.naturalHeight || img.height || maxDim;

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
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Try canvas PNG or WEBP/JPEG
          let dataUrl = canvas.toDataURL('image/png');
          // If PNG string is over 120KB, compress with webp/jpeg
          if (dataUrl.length > 120000) {
            const webp = canvas.toDataURL('image/webp', quality);
            if (webp && webp.startsWith('data:image/webp')) {
              dataUrl = webp;
            } else {
              dataUrl = canvas.toDataURL('image/jpeg', quality);
            }
          }
          resolve(dataUrl);
        } else {
          resolve(fallbackUrl);
        }
      } catch (err) {
        console.warn('Error resizing image on canvas:', err);
        resolve(fallbackUrl);
      }
    };

    const loadAndProcess = (dataUrl: string) => {
      const img = new Image();
      // CRITICAL: DO NOT set img.crossOrigin for data: URIs as it causes onerror on mobile/Chrome webviews!
      if (typeof dataUrl === 'string' && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => processImageObj(img, dataUrl);
      img.onerror = (err) => {
        console.warn('Image load error during resize:', err);
        resolve(dataUrl);
      };
      img.src = dataUrl;
    };

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || '';
        if (!dataUrl) return resolve('');
        loadAndProcess(dataUrl);
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(source);
    } else {
      loadAndProcess(source);
    }
  });
}

