/**
 * HTML5 Canvas Image Compressor
 * Resizes images down to max 300px width/height and compresses to low-footprint JPEG (<30KB)
 * Prevents localStorage QuotaExceededError and Next.js hydration crashes.
 */

export function compressImage(fileOrDataUrl: File | string, maxDimension = 300, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      return;
    }

    const img = new Image();

    const processCanvas = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width || 100;
      canvas.height = height || 100;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(img.src);
      }
    };

    img.onload = processCanvas;
    img.onerror = () => resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          resolve('');
        }
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
