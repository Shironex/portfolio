/**
 * Per-project accent colors. Collapsed to a teal-weighted palette with an
 * ochre for warm outliers — so project cards still read as distinct without
 * returning to the old pastel rainbow.
 *
 * Keys map to the `slug` field on each {@link Project} entry in
 * `@/data/projects-data`.
 */
export const projectAccent: Record<string, string> = {
  automaker: '#b87a1e',
  omniscribe: '#0f7c74',
  shiroani: '#1ca59b',
  shiranami: '#0a5954',
  kodama: '#1ca59b',
  shiroku: '#b87a1e',
  toriime: '#cf8a33',
  gitchorus: '#b87a1e',
  sudeko: '#0a5954',
  matmajka: '#1ca59b',
  'kirei-manga': '#cf8a33',
  moekoder: '#0a5954',
  'write-wiz': '#0f7c74',
  'claude-code-discord-bot': '#0a5954',
  'cli-template': '#0f7c74',
  'gh-labels-cli': '#1ca59b',
  'shinijs-logger': '#0f7c74',
  'shinijs-rate-limit': '#b87a1e',
}

export const DEFAULT_ACCENT = '#0f7c74'

/**
 * Resolve the accent color for a given project slug (or id — they match
 * across the current dataset). Falls back to {@link DEFAULT_ACCENT} when
 * no mapping exists.
 */
export function accentFor(idOrSlug: string): string {
  return projectAccent[idOrSlug] ?? DEFAULT_ACCENT
}
