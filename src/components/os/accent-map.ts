/**
 * Accent roles, not colours.
 *
 * A ShiroOS surface names the role it means and the tokens decide the hex,
 * so the Lamp reaches app icons, project tiles and the command palette
 * without any of them knowing a colour exists. The six roles are exactly the
 * `ROLES` table of `scripts/gen-tokens.mjs`; there is deliberately no escape
 * hatch for an arbitrary colour, because one would be the colour that stops
 * changing with the Lamp.
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

/**
 * The three variables of a role: the accent itself, which is a fill, and its
 * two foregrounds (`--accent-<role>`, `-ink`, `-icon` in tokens.css). The
 * gate checks `ink` at 4.5:1 and `icon` at 3:1 on every body and on the
 * role's own tint, so text takes `ink` and an icon takes `icon`; the fill is
 * never a foreground.
 */
function roleVars(role: AccentRole) {
  const fill = `--accent-${role}`
  return { fill, ink: `${fill}-ink`, icon: `${fill}-icon` }
}

const ROLE_VAR = Object.fromEntries(
  ACCENT_ROLES.map((role) => [role, roleVars(role)])
) as Record<AccentRole, ReturnType<typeof roleVars>>

/** Text colour of a role, for use in an inline `style`. */
export function accentInk(role: AccentRole): string {
  return `var(${ROLE_VAR[role].ink})`
}

/** Icon colour of a role, for use in an inline `style`. */
export function accentIcon(role: AccentRole): string {
  return `var(${ROLE_VAR[role].icon})`
}

/**
 * Translucent fill of an accent. Replaces the `${hex}25` suffix trick, which
 * only worked while accents were literal hex strings. Behind a foreground of
 * the same role, `percent` stays within `TINT` (`tokens.generated.ts`), the
 * strengths the contrast gate ran with.
 */
export function accentTint(role: AccentRole, percent: number): string {
  return `color-mix(in oklab, var(${ROLE_VAR[role].fill}) ${percent}%, transparent)`
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
  'eslint-plugins': 'primary',
  nysia: 'deep',
  'shirone-blog': 'bright',
  rumi: 'warm-2',
  'business-erp': 'warm',
  'night-maze': 'warm-2',
}

export const DEFAULT_ACCENT: AccentRole = 'primary'

/**
 * Resolve the accent role for a given project slug (or id: they match across
 * the current dataset). Falls back to {@link DEFAULT_ACCENT} when no mapping
 * exists.
 */
export function accentFor(idOrSlug: string): AccentRole {
  return projectAccent[idOrSlug] ?? DEFAULT_ACCENT
}
