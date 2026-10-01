import type { CSSProperties } from 'react'

import { TINT } from '@/lib/os/palettes.generated'

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

/**
 * The three variables of a role: the accent itself, which is a fill, and its
 * two foregrounds. The generator derives `ink` to reach 4.5:1 and `icon` to
 * reach 3:1 on every surface and on the role's own tint, so text takes `ink`
 * and an icon takes `icon`; the fill is never a foreground. `neutral` is
 * plain ink: `ink-3` as a fill and as an icon, `ink-2` as text, which is what
 * still reads on a tint of `ink-3` (the generator gates both).
 */
const ROLE_VAR: Record<
  AccentRole,
  { fill: string; ink: string; icon: string }
> = {
  primary: accentVars('--color-miku'),
  deep: accentVars('--color-miku-2'),
  bright: accentVars('--color-miku-3'),
  warm: accentVars('--color-peach'),
  'warm-2': accentVars('--color-peach-2'),
  neutral: {
    fill: '--shiro-ink-3',
    ink: '--shiro-ink-2',
    icon: '--shiro-ink-3',
  },
}

function accentVars(fill: string) {
  return { fill, ink: `${fill}-ink`, icon: `${fill}-icon` }
}

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
 * the same role, `percent` stays within `TINT` (`palettes.generated.ts`), the
 * strengths the contrast gate ran with.
 */
export function accentTint(role: AccentRole, percent: number): string {
  return `color-mix(in oklab, var(${ROLE_VAR[role].fill}) ${percent}%, transparent)`
}

/**
 * A tint as a `background-image`, to lay over an opaque `background-color`:
 * the fill of a badge that must not let a glow behind it through.
 */
export function accentTintLayer(role: AccentRole, percent: number): string {
  const tint = accentTint(role, percent)
  return `linear-gradient(${tint}, ${tint})`
}

/** The tile behind an app icon: the role's tint with its icon colour on it. */
export function accentTileStyle(role: AccentRole): CSSProperties {
  return {
    backgroundColor: accentTint(role, TINT.icon),
    color: accentIcon(role),
  }
}

/** Colour at the centre of an `orb` glow, at one of the `GLOW` strengths. */
export function glowStyle(role: AccentRole, percent: number): CSSProperties {
  return { '--orb-color': accentTint(role, percent) } as CSSProperties
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
