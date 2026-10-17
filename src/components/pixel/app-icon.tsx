import { accentFor, accentIcon } from '@/components/os/accent-map'
import { isAppId } from '@/components/os/constants'
import type { AppId, WindowState } from '@/components/os/types'

import { cn } from '@/lib/utils'

import sheet16 from '@/assets/pixel/icons/app-icons-16.png'
import sheet32 from '@/assets/pixel/icons/app-icons-32.png'

import { PixelIcon } from './pixel-icon.generated'

/** The two app icon sizes, in art px (SPEC 2.4, Icons). */
export type AppIconSize = 16 | 32

/**
 * The name each app is drawn under in `os-app-icons.aseprite` (its slices
 * and tags, so its classes in pixel-sprites.css).
 */
const ART_NAME: Record<AppId, string> = {
  projects: 'projects',
  about: 'about',
  skills: 'monitor',
  contact: 'contact',
  writing: 'writing',
  readme: 'readme',
}

/**
 * Plays the 32 px loop while the control around the icon (its `group`) is
 * hovered or focused from the keyboard, and rests on the still otherwise.
 * `ambient-loop` holds it under the pause rules, and the reduced motion rule
 * cuts it to the still.
 */
const HOVER_LOOP_CLASS =
  'ambient-loop group-hover:animate-(--px-loop) group-focus-visible:animate-(--px-loop)'

interface AppIconProps {
  id: AppId
  size?: AppIconSize
  className?: string
}

/**
 * An app's icon in its slot: 16x16 art px (taskbar, title bars, palette
 * rows, dock), or 32x32 on its navy tile (desktop, Start menu, launcher).
 * Decorative: the control around it carries the name.
 *
 * The 16 px art keeps a 1 art px transparent margin, so it sits on a 16 art
 * px title bar.
 */
export function AppIcon({ id, size = 16, className }: AppIconProps) {
  const sheet = size === 32 ? sheet32 : sheet16
  const stem = `px-app-icons-${size}`
  return (
    <span
      aria-hidden
      data-app-icon={id}
      className={cn(
        'block flex-none',
        stem,
        `${stem}-${ART_NAME[id]}`,
        size === 32 && HOVER_LOOP_CLASS,
        className
      )}
      style={{ backgroundImage: `url(${sheet.src})` }}
    />
  )
}

/** The 16x16 ShiroOS logo: the Start button and the menubar. */
export function AppLogo({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'px-app-icons-16 px-app-icons-16-logo block flex-none',
        className
      )}
      style={{ backgroundImage: `url(${sheet16.src})` }}
    />
  )
}

interface ProjectGlyphProps {
  slug: string
  /** The slot the 8x8 diamond is centred in, in art px. */
  slot?: 8 | 16
  className?: string
}

/**
 * A project in a small context (title bar, palette row, Start menu recents):
 * the 8x8 diamond tinted by the project's accent, so no 16 px project icons
 * are needed.
 */
export function ProjectGlyph({
  slug,
  slot = 16,
  className,
}: ProjectGlyphProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex flex-none items-center justify-center',
        slot === 16 ? 'size-16' : 'size-8',
        className
      )}
      style={{ color: accentIcon(accentFor(slug)) }}
    >
      <PixelIcon name="diamond" />
    </span>
  )
}

/** The icon of a window's title bar: its app, or its project's diamond. */
export function WindowIcon({
  win,
  className,
}: {
  win: Pick<WindowState, 'id' | 'project'>
  className?: string
}) {
  if (isAppId(win.id)) return <AppIcon id={win.id} className={className} />
  return (
    <ProjectGlyph slug={win.project?.slug ?? win.id} className={className} />
  )
}
