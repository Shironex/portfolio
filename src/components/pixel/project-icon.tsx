import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import sheet from '@/assets/pixel/project-icons/project-icons-32.png'
import '@/styles/sprites/project-icons-32.css'

/**
 * The projects with a drawn 32x32 icon (SPEC 2.4, Icons; section 9): the six
 * of `os-project-icons.aseprite` and the seven README icons, cut into one
 * sheet by `gen-project-icons.mjs`, each tag named by its slug. The others
 * get their letter on the bare tile (`ProjectAvatar`, decision 3).
 */
const ICON_SLUGS = new Set([
  'moekoder',
  'rumi',
  'nysia',
  'matmajka',
  'shirone-blog',
  'sudeko',
  'automaker',
  'business-erp',
  'eslint-plugins',
  'omniscribe',
  'shiranami',
  'shiroani',
  'night-maze',
])

/** Whether a project has a drawn 32x32 icon. */
export function hasProjectIcon(slug: string): boolean {
  return ICON_SLUGS.has(slug)
}

/**
 * Plays the icon's tag once when the control around it (its `group`) is
 * hovered or focused from the keyboard, then rests on the still again
 * (frame 1 of the tag, SPEC section 9), with the frame timings as drawn. The
 * reduced motion rule and the Pause animations setting hold it on the still
 * (`px-hover-loop` in globals.css). The count sits in each variant: the
 * `animation` shorthand the hover sets would reset a count set outside it.
 */
const HOVER_ONCE_CLASS = [
  'px-hover-loop',
  'group-hover:animate-(--px-loop) group-hover:[animation-iteration-count:1]',
  'group-focus-visible:animate-(--px-loop) group-focus-visible:[animation-iteration-count:1]',
].join(' ')

/** Icon scales: 32 art px, or 64 for the project window's hero. */
export type ProjectIconScale = 1 | 2

interface ProjectIconProps {
  slug: string
  /** 2 draws each art px of the icon as two, for the project hero. */
  scale?: ProjectIconScale
  className?: string
}

/**
 * A project's 32x32 icon on its tile. Decorative: keep the project's name
 * and description beside it (rumi and nysia are both terminals). Renders
 * nothing for a project with no icon; `ProjectAvatar` falls back to the
 * letter tile.
 */
export function ProjectIcon({ slug, scale = 1, className }: ProjectIconProps) {
  if (!hasProjectIcon(slug)) return null
  return <TileSprite tag={slug} scale={scale} className={className} />
}

interface ProjectTileProps {
  /** The letter on the tile, usually the project's first. */
  letter: string
  scale?: ProjectIconScale
  className?: string
}

/**
 * The bare navy tile the icons sit on, with a letter in the Lamp's warm
 * ink: the picture of a project with no drawn icon (decision 3). Decorative.
 */
export function ProjectTile({
  letter,
  scale = 1,
  className,
}: ProjectTileProps) {
  return (
    <TileSprite
      tag="tile"
      scale={scale}
      className={className}
      spriteClassName={cn(
        'os-night flex items-center justify-center text-(--heading) uppercase',
        scale === 2 ? 'text-display' : 'text-heading'
      )}
    >
      {letter}
    </TileSprite>
  )
}

interface TileSpriteProps {
  tag: string
  scale: ProjectIconScale
  /** Classes for the outer element (the wrapper at scale 2). */
  className?: string
  /** Classes for the sprite itself. */
  spriteClassName?: string
  children?: string
}

/**
 * One cell of the sheet. At scale 2 a wrapper doubles the art px it
 * inherits (`--px`, set inline on <html>) into `--px-2x`, and the sprite
 * takes that as its own `--px`: on one element the two would be a cycle.
 */
function TileSprite({
  tag,
  scale,
  className,
  spriteClassName,
  children,
}: TileSpriteProps) {
  const sprite = (
    <span
      aria-hidden
      data-project-icon={tag}
      className={cn(
        'px-project-icons-32 block flex-none',
        `px-project-icons-32-${tag}`,
        tag !== 'tile' && HOVER_ONCE_CLASS,
        scale === 2 && '[--px:var(--px-2x)]',
        scale === 1 && className,
        spriteClassName
      )}
      style={{ backgroundImage: `url(${sheet.src})` }}
    >
      {children}
    </span>
  )
  if (scale === 1) return sprite
  return (
    <span
      aria-hidden
      className={cn('block flex-none', className)}
      style={{ '--px-2x': 'calc(2 * var(--px))' } as CSSProperties}
    >
      {sprite}
    </span>
  )
}
