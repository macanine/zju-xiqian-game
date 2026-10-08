import { assetUrl } from "./content";

const decodedCache = new Set<string>();

/**
 * Preload and asynchronously decode an image off the main thread.
 * This ensures that when the image is rendered, no main-thread decoding jank occurs.
 */
export async function preloadImage(path: string): Promise<void> {
  if (!path || decodedCache.has(path)) return;

  try {
    const url = assetUrl(path);
    const img = new Image();
    img.src = url;

    if (typeof img.decode === "function") {
      await img.decode();
    } else {
      await new Promise<void>((resolve, reject) => {
        const target = img as HTMLImageElement;
        target.onload = () => resolve();
        target.onerror = () => reject();
      });
    }

    decodedCache.add(path);
  } catch {
    // Graceful fallback if network or format issue
  }
}

/**
 * Preload all images for a story node in parallel.
 */
export async function preloadNodeImages(images: string[]): Promise<void> {
  if (!images || images.length === 0) return;
  await Promise.all(images.map((img) => preloadImage(img)));
}
