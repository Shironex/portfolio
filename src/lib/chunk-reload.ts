/**
 * A deploy replaces the hashed chunk files, so a tab loaded before it can
 * ask for a chunk that no longer exists. The failed request surfaces as a
 * ChunkLoadError (webpack), "Failed to load chunk" (Turbopack) or a failed
 * dynamic import (the browser's own wording).
 */
const CHUNK_ERROR_PATTERN =
  /ChunkLoadError|Loading (CSS )?chunk [^\s]+ failed|Failed to load chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i

/** Written to sessionStorage when the page reloaded for a chunk error. */
export const CHUNK_RELOAD_KEY = 'shiroos:chunk-reload'

/** One reload per tab inside this window; a later deploy can reload again. */
export const CHUNK_RELOAD_WINDOW_MS = 60_000

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return (
    error.name === 'ChunkLoadError' || CHUNK_ERROR_PATTERN.test(error.message)
  )
}

/**
 * Whether a reload for this error is allowed now, and records it when so.
 * Without a usable sessionStorage nothing is recorded, so nothing reloads:
 * a loop is worse than the error screen.
 */
export function claimChunkReload(
  now = Date.now(),
  storage?: Pick<Storage, 'getItem' | 'setItem'>
): boolean {
  try {
    const store = storage ?? window.sessionStorage
    const last = Number(store.getItem(CHUNK_RELOAD_KEY))
    if (
      Number.isFinite(last) &&
      last > 0 &&
      now - last < CHUNK_RELOAD_WINDOW_MS
    ) {
      return false
    }
    store.setItem(CHUNK_RELOAD_KEY, String(now))
    return true
  } catch {
    return false
  }
}

/** Reloads the page once for a chunk error; false when it did not. */
export function reloadForChunkError(error: unknown): boolean {
  if (!isChunkLoadError(error) || !claimChunkReload()) return false
  window.location.reload()
  return true
}
