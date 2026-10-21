'use client'

import { useCallback, useMemo, useSyncExternalStore } from 'react'

import { useAnnounce } from '@/components/os/announcer'

import {
  PREF_COPY,
  PREF_IDS,
  type PrefId,
  readPref,
  subscribePrefs,
  writePref,
} from '@/lib/os/prefs'

export type Prefs = Record<PrefId, boolean>

/** The settings as one string (`'100'`), so the snapshot compares by value. */
function snapshot(): string {
  return PREF_IDS.map((id) => (readPref(id) ? '1' : '0')).join('')
}

/** The server render and the page before hydration: the defaults. */
const DEFAULT_SNAPSHOT = PREF_IDS.map((id) => (id === 'pets' ? '1' : '0')).join(
  ''
)

/**
 * The View settings (Pets, Pause animations, Readable text) and the one way
 * to flip them: `toggle` changes the flag and its storage (`prefs.ts`) and
 * says the outcome through the shell's announcer ("Pets hidden"). The state
 * follows the flags on <html>, so every control that shows a setting (the
 * View menu, the palette, later the mobile launcher) agrees without passing
 * state around.
 */
export function usePrefs() {
  const say = useAnnounce()
  const current = useSyncExternalStore(
    subscribePrefs,
    snapshot,
    () => DEFAULT_SNAPSHOT
  )
  const prefs = useMemo(
    () =>
      Object.fromEntries(
        PREF_IDS.map((id, i) => [id, current[i] === '1'])
      ) as Prefs,
    [current]
  )

  const toggle = useCallback(
    (id: PrefId) => {
      const on = !readPref(id)
      writePref(id, on)
      say(PREF_COPY[id].said[on ? 1 : 0])
    },
    [say]
  )

  return { prefs, toggle }
}
