/**
 * The once-per-tab flag of the boot splash, in `sessionStorage`. Apart from
 * `boot.tsx`, so the e2e helpers can read the key without the splash's art.
 */
export const BOOT_STORAGE_KEY = 'shiroos:booted'

/**
 * Reading the flag fails toward SHOWING the splash.
 *
 * A `typeof window` check guards SSR, not the access: `sessionStorage` throws
 * outright in a browser set to block site data, inside a sandboxed iframe, and
 * under a partitioned store. An unreadable flag is treated as an unset one, so
 * a tab that cannot remember replays the greeting. That is the harmless
 * direction for something skippable that lasts 2.4 seconds.
 */
export function readBootFlag(): string | null {
  try {
    return window.sessionStorage.getItem(BOOT_STORAGE_KEY)
  } catch {
    return null
  }
}

/** Writing fails silently: an unrecordable boot is a replay, not a crash. */
export function writeBootFlag(): void {
  try {
    window.sessionStorage.setItem(BOOT_STORAGE_KEY, '1')
  } catch {
    /* Blocked storage or an exhausted quota. The splash shows again next time. */
  }
}
