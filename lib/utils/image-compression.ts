/**
 * Client-side Automatic Image Compression Utility
 * Resizes and compresses image files directly in the browser before upload.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.82)
  outputType?: 'image/jpeg' | 'image/webp';
}

export interface CompressedImageResult {
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercent: number;
  formattedOriginalSize: string;
  formattedCompressedSize: string;
  width: number;
  height: number;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Automatically compresses an image File in the browser using HTML5 Canvas.
 * Produces an optimized JPEG/WebP File ready for upload or storage.
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressedImageResult> {
  const {
    maxWidth = 1400,
    maxHeight = 1400,
    quality = 0.82,
    outputType = 'image/jpeg',
  } = options;

  // If the file is an SVG or GIF, preserve as is
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    const dataUrl = await readFileAsDataUrl(file);
    return {
      file,
      dataUrl,
      originalSize: file.size,
      compressedSize: file.size,
      reductionPercent: 0,
      formattedOriginalSize: formatFileSize(file.size),
      formattedCompressedSize: formatFileSize(file.size),
      width: 0,
      height: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Calculate scaled dimensions while preserving aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const widthRatio = maxWidth / width;
        const heightRatio = maxHeight / height;
        const scaleFactor = Math.min(widthRatio, heightRatio);

        width = Math.round(width * scaleFactor);
        height = Math.round(height * scaleFactor);
      }

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas 2D rendering context'));
        return;
      }

      // Configure high-quality resampling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // For JPEG: fill canvas with white background in case of transparent PNGs
      if (outputType === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export as Blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image into blob'));
            return;
          }

          // Generate file extension matching outputType
          const ext = outputType === 'image/webp' ? '.webp' : '.jpg';
          const originalBaseName = file.name.replace(/\.[^/.]+$/, '');
          const newFileName = `${originalBaseName}-optimized${ext}`;

          const compressedFile = new File([blob], newFileName, {
            type: outputType,
            lastModified: Date.now(),
          });

          // Generate data URL for instant client-side preview
          const dataUrl = canvas.toDataURL(outputType, quality);

          const originalSize = file.size;
          const compressedSize = compressedFile.size;
          const reductionPercent =
            originalSize > compressedSize
              ? Number((((originalSize - compressedSize) / originalSize) * 100).toFixed(1))
              : 0;

          resolve({
            file: compressedSize < originalSize ? compressedFile : file,
            dataUrl,
            originalSize,
            compressedSize: Math.min(compressedSize, originalSize),
            reductionPercent,
            formattedOriginalSize: formatFileSize(originalSize),
            formattedCompressedSize: formatFileSize(Math.min(compressedSize, originalSize)),
            width,
            height,
          });
        },
        outputType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = objectUrl;
  });
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
