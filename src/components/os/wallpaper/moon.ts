/**
 * The moon of the wallpaper: which of the 8 drawn phases shows tonight.
 *
 * The fixed skies keep a waxing gibbous moon (faint in dusk and dawn), as
 * the mocks draw it; Live shows the
 * real phase, from the mean synodic month counted from a known new moon. The
 * mean month drifts from the true one by under a day, which is less than one
 * of the 8 drawn phases (about 3.7 days each).
 */

export const MOON_PHASES = [
  'moon_new',
  'moon_waxing_crescent',
  'moon_first_quarter',
  'moon_waxing_gibbous',
  'moon_full',
  'moon_waning_gibbous',
  'moon_last_quarter',
  'moon_waning_crescent',
] as const

export type MoonPiece = (typeof MOON_PHASES)[number]

/** The new moon of 6 January 2000, 18:14 UTC. */
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14)
const SYNODIC_MONTH_MS = 29.530588853 * 24 * 60 * 60 * 1000

/** The moon's age as a share of the month: 0 new, 0.5 full. */
export function moonAge(date = new Date()): number {
  const months = (date.getTime() - KNOWN_NEW_MOON) / SYNODIC_MONTH_MS
  return months - Math.floor(months)
}

/** The drawn phase nearest the moon's age. */
export function moonPhase(date = new Date()): MoonPiece {
  const index =
    Math.round(moonAge(date) * MOON_PHASES.length) % MOON_PHASES.length
  return MOON_PHASES[index]
}
