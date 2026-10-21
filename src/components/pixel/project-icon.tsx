import { cn } from '@/lib/utils'

import sheet from '@/assets/pixel/project-icons/readme-icons.png'
import '@/styles/sprites/readme-icons.css'

import { HOVER_LOOP_CLASS } from './app-icon'

/**
 * The project each README icon was drawn for (SPEC 2.4, Icons): its tag in
 * `readme/icons.aseprite`. The new icons of `os-project-icons.aseprite`
 * join in Phase 4 with the Projects app.
 */
const README_ICON: Partial<Record<string, string>> = {
  automaker: 'automaker',
  'business-erp': 'erp',
  'eslint-plugins': 'noctcore',
  omniscribe: 'omniscribe',
  shiranami: 'shiranami',
  shiroani: 'shiroani',
  'night-maze': 'nightmaze',
}

/** Whether a project has a drawn 32x32 icon. */
export function hasProjectIcon(slug: string): boolean {
  return README_ICON[slug] !== undefined
}

interface ProjectIconProps {
  slug: string
  className?: string
}

/**
 * A project's 32x32 icon on its tile, resting on its still and playing its
 * loop while the control around it (its `group`) is hovered or focused, as
 * the app icons do. Decorative. Renders nothing for a project with no icon;
 * check `hasProjectIcon` to show a fallback.
 */
export function ProjectIcon({ slug, className }: ProjectIconProps) {
  const name = README_ICON[slug]
  if (!name) return null
  return (
    <span
      aria-hidden
      data-project-icon={slug}
      className={cn(
        'px-readme-icons block flex-none',
        `px-readme-icons-${name}`,
        HOVER_LOOP_CLASS,
        className
      )}
      style={{ backgroundImage: `url(${sheet.src})` }}
    />
  )
}
