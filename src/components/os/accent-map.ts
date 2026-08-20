/**
 * Accent roles, not colours.
 *
 * A ShiroOS surface names the role it means and the active palette decides the
 * hex, so switching palettes reaches app icons, project tiles and the command
 * palette without any of them knowing a colour exists. The six roles are
 * exactly what the palette table in `scripts/gen-palettes.mjs` defines; there
 * is deliberately no escape hatch for an arbitrary colour, because one would
 * be the colour that stops changing when the palette does.
 */
export const ACCENT_ROLES = [
  'primary',
  'deep',
  'bright',
  'warm',
  'warm-2',
  'neutral',
] as const

export type AccentRole = (typeof ACCENT_ROLES)[number]

const ROLE_VAR: Record<AccentRole, string> = {
  primary: '--color-miku',
  deep: '--color-miku-2',
  bright: '--color-miku-3',
  warm: '--color-peach',
  'warm-2': '--color-peach-2',
  neutral: '--color-lav',
}

/** Resolved colour for a role, for use in an inline `style`. */
export function accentColor(role: AccentRole): string {
  return `var(${ROLE_VAR[role]})`
}

/**
 * Translucent fill of an accent. Replaces the `${hex}25` suffix trick, which
 * only worked while accents were literal hex strings.
 */
export function accentTint(role: AccentRole, percent: number): string {
  return `color-mix(in oklab, var(${ROLE_VAR[role]}) ${percent}%, transparent)`
}

/**
 * Per-project accent role. Keys map to the `slug` field on each `Project`
 * entry in `@/data/projects-data`.
 */
export const projectAccent: Record<string, AccentRole> = {
  automaker: 'warm',
  omniscribe: 'primary',
  shiroani: 'bright',
  shiranami: 'deep',
  kodama: 'bright',
  shiroku: 'warm',
  toriime: 'warm-2',
  gitchorus: 'warm',
  sudeko: 'deep',
  matmajka: 'bright',
  'kirei-manga': 'warm-2',
  moekoder: 'deep',
  'write-wiz': 'primary',
  'claude-code-discord-bot': 'deep',
  'cli-template': 'primary',
  'gh-labels-cli': 'bright',
  'shinijs-logger': 'primary',
  'shinijs-rate-limit': 'warm',
}

export const DEFAULT_ACCENT: AccentRole = 'primary'

/**
 * Resolve the accent role for a given project slug (or id — they match across
 * the current dataset). Falls back to {@link DEFAULT_ACCENT} when no mapping
 * exists.
 */
export function accentFor(idOrSlug: string): AccentRole {
  return projectAccent[idOrSlug] ?? DEFAULT_ACCENT
}
