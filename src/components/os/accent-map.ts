/**
 * Per-project accent colors used by ShiroOS desktop panels and windows.
 *
 * Keys map to the `slug` field on each {@link Project} entry in
 * `@/data/projects-data`. Each hex value is chosen thematically to echo
 * the project's vibe on the wallpaper canvas.
 */
export const projectAccent: Record<string, string> = {
  automaker: '#f97a5a',
  omniscribe: '#7cb8e3',
  shiroani: '#c9a4ff',
  shiranami: '#69d9c8',
  kodama: '#9ef0c2',
  shiroku: '#ffb58c',
  toriime: '#ff8ecf',
  gitchorus: '#ffd36e',
  sudeko: '#b79dff',
  matmajka: '#6ae3da',
  'write-wiz': '#a9dcff',
  'claude-code-discord-bot': '#ff5fa8',
  'cli-template': '#39c5bb',
  'gh-labels-cli': '#9ef0c2',
  'shinijs-logger': '#7cb8e3',
  'shinijs-rate-limit': '#ffd36e',
}

export const DEFAULT_ACCENT = '#39c5bb'

/**
 * Resolve the accent color for a given project slug (or id — they match
 * across the current dataset). Falls back to {@link DEFAULT_ACCENT} when
 * no mapping exists, so callers always receive a valid hex string.
 */
export function accentFor(idOrSlug: string): string {
  return projectAccent[idOrSlug] ?? DEFAULT_ACCENT
}
