/**
 * Utility to safely normalize image sources and prevent React empty string ("") src attribute warnings.
 * In React, passing src="" causes redundant network round-trips and console errors.
 * Passing a non-empty string or null prevents this behavior.
 */

export function safeImageSrc(
  src?: string | null,
  fallback: string | null = null
): string | null {
  if (typeof src === 'string' && src.trim().length > 0) {
    return src.trim();
  }
  if (typeof fallback === 'string' && fallback.trim().length > 0) {
    return fallback.trim();
  }
  return null;
}
