import {
  DEFAULT_SKY,
  GROUND,
  SKIES,
  type SkyId,
} from '@/lib/os/tokens.generated'

export { DEFAULT_SKY, GROUND, SKIES }
export type { SkyId }

/**
 * The Lamp: `dark` is night window bodies (the Lamp off, the default) and
 * `light` is paper bodies (the Lamp on). The ground, the bars and the
 * wallpaper are night in both. The axis keeps its old name, values and
 * storage key, so a stored choice carries over.
 */
export type Mode = 'light' | 'dark'

/** A sky that paints; `live` resolves to one of these. */
export type FixedSky = Exclude<SkyId, 'live'>

/**
 * Appearance is two independent axes. Keeping them as one value means the
 * hook, the boot script, and storage all agree on what "current" means
 * instead of each tracking half of it.
 */
export interface Appearance {
  mode: Mode
  sky: SkyId
}

export const MODE_STORAGE_KEY = 'shiroos:theme'
export const SKY_STORAGE_KEY = 'shiroos:sky'
/** `readable`: long text in Atkinson Hyperlegible Next (`data-text` on `<html>`). */
export const TEXT_STORAGE_KEY = 'shiroos:text'
/** `paused`: every ambient loop holds still (`data-motion` on `<html>`). */
export const MOTION_STORAGE_KEY = 'shiroos:motion'

export const DEFAULT_APPEARANCE: Appearance = {
  mode: 'dark',
  sky: DEFAULT_SKY,
}

const SKY_IDS: readonly string[] = SKIES.map((s) => s.id)

/** Hour in Warsaw at which each part of the Live sky begins. */
export const LIVE_SKY_HOURS = { dawn: 5, day: 8, dusk: 18, night: 21 } as const

const LIVE_TIME_ZONE = 'Europe/Warsaw'

/** The hour (0 to 23) in Warsaw, or the local hour if the zone is unknown. */
export function warsawHour(date = new Date()): number {
  try {
    return Number(
      new Intl.DateTimeFormat('en-GB', {
        timeZone: LIVE_TIME_ZONE,
        hour: 'numeric',
        hourCycle: 'h23',
      }).format(date)
    )
  } catch {
    return date.getHours()
  }
}

/** The sky Live shows at an hour in Warsaw. */
export function liveSky(hour: number): FixedSky {
  const h = LIVE_SKY_HOURS
  if (hour >= h.night || hour < h.dawn) return 'night'
  if (hour < h.day) return 'dawn'
  if (hour < h.dusk) return 'day'
  return 'dusk'
}

/** The sky that paints for a choice, now. */
export function resolveSky(sky: SkyId, date = new Date()): FixedSky {
  return sky === 'live' ? liveSky(warsawHour(date)) : sky
}

export function isSkyId(value: unknown): value is SkyId {
  return typeof value === 'string' && SKY_IDS.includes(value)
}

export function isMode(value: unknown): value is Mode {
  return value === 'light' || value === 'dark'
}

/**
 * localStorage is untyped input, so both axes are parsed rather than cast.
 * A key written by an older build (or by hand) falls back to the default.
 */
export function readStoredAppearance(): Appearance {
  if (typeof window === 'undefined') return DEFAULT_APPEARANCE
  try {
    const mode = window.localStorage.getItem(MODE_STORAGE_KEY)
    const sky = window.localStorage.getItem(SKY_STORAGE_KEY)
    return {
      mode: isMode(mode) ? mode : DEFAULT_APPEARANCE.mode,
      sky: isSkyId(sky) ? sky : DEFAULT_APPEARANCE.sky,
    }
  } catch {
    return DEFAULT_APPEARANCE
  }
}

export function writeStoredAppearance(next: Appearance) {
  try {
    window.localStorage.setItem(MODE_STORAGE_KEY, next.mode)
    window.localStorage.setItem(SKY_STORAGE_KEY, next.sky)
  } catch {
    // Private mode or a full quota. The class and attribute are already on
    // the document, so the current session still looks right.
  }
}

/**
 * Both axes land on <html>: the Lamp as the `dark` class (night bodies), the
 * sky as `data-sky`, resolved, so CSS only ever sees a sky that paints. The
 * `theme-color` meta is the ground, which is night in both modes, so it
 * never changes.
 */
export function applyAppearance(appearance: Appearance) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', appearance.mode === 'dark')
  root.dataset.sky = resolveSky(appearance.sky)
}

/**
 * Runs before first paint, from a blocking inline <script> in the document
 * head. Without it the server-rendered default paints for a frame before
 * React applies the stored appearance, which reads as a flash of the wrong
 * mode on every load.
 *
 * It sets, in order:
 *   - the art pixel (SPEC 2.1): `--px` is a whole number of device pixels, at
 *     least 2, `--hpx` a whole number for the small labels, `--dpr` the ratio
 *     itself. A change of resolution (browser zoom, a move to another screen)
 *     re-runs it and fires `shiroos:px` on window for `src/lib/os/pixel.ts`.
 *   - the Lamp (`dark` class, night by default, which is also the server
 *     render and the no-JavaScript page), the sky (`data-sky`; Live resolves
 *     to the part of the day in Warsaw), readable text (`data-text`) and
 *     paused motion (`data-motion`).
 * A throwing localStorage (private mode, blocked cookies) leaves the night
 * defaults in place.
 */
export const APPEARANCE_BOOT_SCRIPT = [
  '(function(){var r=document.documentElement,s=r.style;',
  'function px(){var d=window.devicePixelRatio||1,',
  'n=Math.max(2,Math.round(2*d)),h=Math.max(1,Math.round(d));',
  "s.setProperty('--px',n/d+'px');s.setProperty('--hpx',h/d+'px');",
  "s.setProperty('--dpr',String(d));",
  "try{matchMedia('(resolution: '+d+'dppx)').addEventListener('change',px,{once:true});",
  "window.dispatchEvent(new Event('shiroos:px'))}catch(e){}}",
  'px();',
  `var m=${JSON.stringify(DEFAULT_APPEARANCE.mode)},k=${JSON.stringify(DEFAULT_SKY)};`,
  'try{',
  `if(localStorage.getItem(${JSON.stringify(MODE_STORAGE_KEY)})==='light')m='light';`,
  `var y=localStorage.getItem(${JSON.stringify(SKY_STORAGE_KEY)});`,
  `if(${JSON.stringify(SKY_IDS)}.indexOf(y)>-1)k=y;`,
  `if(localStorage.getItem(${JSON.stringify(TEXT_STORAGE_KEY)})==='readable')r.dataset.text='readable';`,
  `if(localStorage.getItem(${JSON.stringify(MOTION_STORAGE_KEY)})==='paused')r.dataset.motion='paused';`,
  '}catch(e){}',
  "r.classList.toggle('dark',m==='dark');",
  "if(k==='live'){var t;try{t=+new Intl.DateTimeFormat('en-GB',",
  `{timeZone:${JSON.stringify(LIVE_TIME_ZONE)},hour:'numeric',hourCycle:'h23'}).format(new Date())}`,
  'catch(e){t=new Date().getHours()}',
  `k=t>=${LIVE_SKY_HOURS.night}||t<${LIVE_SKY_HOURS.dawn}?'night':`,
  `t<${LIVE_SKY_HOURS.day}?'dawn':t<${LIVE_SKY_HOURS.dusk}?'day':'dusk'}`,
  'r.dataset.sky=k',
  '})()',
].join('')
