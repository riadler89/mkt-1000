/**
 * Creates a cache-friendly timestamp for visibleAt parameters.
 * Sets seconds and milliseconds to 0 to create a 1-minute cache window,
 * preventing cache misses from constantly changing timestamps.
 */
export function createCacheFriendlyTimestamp(): string {
  const now = new Date()
  now.setSeconds(0, 0)
  return now.toISOString()
}
