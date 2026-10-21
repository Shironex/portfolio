import { SETTING_FLAGS, type SettingId } from './appearance'

/**
 * The three View settings (SPEC 2.3 and 3.6): Pets, Pause animations and
 * Readable text. Each is a flag on <html> (`data-pets="hidden"`,
 * `data-motion="paused"`, `data-text="readable"`) that the boot script in
 * `appearance.ts` applies before first paint from the same storage keys, so
 * CSS and the art scripts read the attribute and never this module. This
 * module only reads and flips the flags afterwards, and names them for the
 * View menu, the command palette and the announcer.
 *
 * Each is described as the checkbox the View menu shows: `on` is Pets shown,
 * animations paused, readable text on. Pets is the one that is on by
 * default, so its flag is set while it is off.
 */
export type PrefId = SettingId

export const PREF_IDS: readonly PrefId[] = ['pets', 'motion', 'text']

interface PrefCopy {
  /** The View menu's checkbox item. */
  menu: string
  /** The palette action that turns it off, then the one that turns it on. */
  action: readonly [off: string, on: string]
  /** What the announcer says once it is off, then once it is on. */
  said: readonly [off: string, on: string]
  /** Extra words the palette search matches. */
  search: string
}

export const PREF_COPY: Record<PrefId, PrefCopy> = {
  pets: {
    menu: 'Pets',
    action: ['Hide pets', 'Show pets'],
    said: ['Pets hidden', 'Pets shown'],
    search: 'pets mascot desktop pet hide show',
  },
  motion: {
    menu: 'Pause animations',
    action: ['Resume animations', 'Pause animations'],
    said: ['Animations resumed', 'Animations paused'],
    search: 'pause resume play animations motion stop',
  },
  text: {
    menu: 'Readable text',
    action: ['Turn readable text off', 'Turn readable text on'],
    said: ['Readable text off', 'Readable text on'],
    search: 'readable text font atkinson legible reading pixel',
  },
}

/** Whether the flag is set while the setting is on (all but Pets). */
function onWhenFlagged(id: PrefId): boolean {
  return id !== 'pets'
}

/** Whether a setting is on now; the server and a page with no flag say off. */
export function readPref(id: PrefId): boolean {
  if (typeof document === 'undefined') return !onWhenFlagged(id)
  const flagged =
    document.documentElement.dataset[id] === SETTING_FLAGS[id].value
  return flagged === onWhenFlagged(id)
}

/**
 * Turns a setting on or off: the flag on <html> at once (everything that
 * reads it follows), then storage, so a reload keeps it. A throwing storage
 * (private mode) still changes the page for this visit.
 */
export function writePref(id: PrefId, on: boolean) {
  const { key, value } = SETTING_FLAGS[id]
  const flag = on === onWhenFlagged(id)
  const root = document.documentElement
  if (flag) root.dataset[id] = value
  else delete root.dataset[id]
  try {
    if (flag) window.localStorage.setItem(key, value)
    else window.localStorage.removeItem(key)
  } catch {
    // The attribute is already set; only the next visit forgets it.
  }
}

/** The attributes the settings live in, for observers. */
export const PREF_ATTRIBUTES = PREF_IDS.map((id) => `data-${id}`)

/**
 * Calls `listener` whenever any setting changes, wherever from (this module,
 * another tab's script, a test). Returns the unsubscribe.
 */
export function subscribePrefs(listener: () => void): () => void {
  if (typeof document === 'undefined') return () => {}
  const observer = new MutationObserver(listener)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: PREF_ATTRIBUTES,
  })
  return () => observer.disconnect()
}
