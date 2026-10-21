'use client'

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { AppIcon, ProjectGlyph } from '@/components/pixel/app-icon'
import { MascotHead } from '@/components/pixel/mascot-head'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { AUTHOR_NAME, EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import { artPx, floorToArt, onArtPixelChange, snapToArt } from '@/lib/os/pixel'
import { cn, onBackdropDismiss } from '@/lib/utils'
import { getPinnedProjects } from '@/lib/utils/projects'

import { projectsData } from '@/data/projects-data'
import { useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { Project } from '@/types'

import { APPS, CMD_PALETTE_SHORTCUT } from './constants'
import { ExternalLink } from './external-link'
import { Kbd } from './kbd'
import { START_BUTTON_ATTRIBUTE } from './taskbar'
import type { AppId } from './types'

interface StartMenuProps {
  onClose: () => void
  onLaunch: (appId: AppId) => void
  onOpenProject: (p: Project) => void
  onOpenCmd: () => void
}

/**
 * Width of the menu, the gap over the Start button and the side margin, in
 * art px. 218 leaves the pinned grid three even 68 px columns.
 */
const MENU_WIDTH = 218
const ANCHOR_GAP = 2
const EDGE_MARGIN = 4

interface Placement {
  left: number
  bottom: number
  width: number
}

/**
 * Where the menu goes: its left edge on the Start button's, just above it,
 * on whole art px and inside the viewport. `null` before the first measure
 * and when there is no Start button.
 */
function measurePlacement(): Placement | null {
  const start = document.querySelector(`[${START_BUTTON_ATTRIBUTE}]`)
  if (!start) return null
  const box = start.getBoundingClientRect()
  const margin = artPx(EDGE_MARGIN)
  const width = Math.min(
    artPx(MENU_WIDTH),
    floorToArt(window.innerWidth - 2 * margin)
  )
  const left = Math.max(
    margin,
    Math.min(
      snapToArt(box.left),
      floorToArt(window.innerWidth - margin - width)
    )
  )
  const bottom = snapToArt(window.innerHeight - box.top + artPx(ANCHOR_GAP))
  return { left, bottom, width }
}

const SECTION_HEADING_CLASS = 'text-label px-4 text-(--meta) uppercase'

/** A row or tile of the menu: the selection teal under the pointer. */
const ITEM_CLASS = 'focus-ring hover:bg-(--select)'

/**
 * The Start menu: a popover anchored above the Start button.
 *
 * Modeled as a dialog (not an ARIA menu) because children include a mix of
 * buttons, links, and static content that don't fit the strict menuitem
 * pattern. A modal layer: traps focus, makes the desktop behind inert,
 * restores focus on close, dismisses on Esc or on the scrim.
 *
 * Night chrome in both Lamp modes (`os-night`), on a 50% navy dither scrim
 * instead of a blur.
 */
export function StartMenu({
  onClose,
  onLaunch,
  onOpenProject,
  onOpenCmd,
}: StartMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLButtonElement>(null)
  const pinnedId = useId()
  const recentId = useId()
  const [placement, setPlacement] = useState<Placement | null>(null)

  useFocusTrap(panelRef, true)

  // Measured before paint, and again when the viewport or the art pixel
  // changes under the open menu.
  useLayoutEffect(() => {
    const place = () => setPlacement(measurePlacement())
    place()
    window.addEventListener('resize', place)
    const stopPx = onArtPixelChange(place)
    return () => {
      window.removeEventListener('resize', place)
      stopPx()
    }
  }, [])

  const recentProjects = useMemo<Project[]>(
    () =>
      getPinnedProjects(projectsData, {
        cap: 6,
        order: 'in-progress-first',
        dedupeBy: 'id',
      }),
    []
  )

  // Focus the search once the panel is placed: until then it is
  // `invisible`, and a hidden button cannot take focus.
  const placed = placement !== null
  useEffect(() => {
    if (placed) searchRef.current?.focus()
  }, [placed])

  useEscapeLayer('start', onClose)

  return (
    <div
      className="px-tile-shadow z-overlay fixed inset-0"
      onMouseDown={onBackdropDismiss(onClose)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Start menu"
        style={
          placement
            ? {
                left: placement.left,
                bottom: placement.bottom,
                width: placement.width,
              }
            : undefined
        }
        className={cn(
          'os-night px-popover animate-cp-in font-body absolute flex flex-col gap-3 p-3 motion-reduce:animate-none',
          // Until it is measured (one layout pass), out of sight.
          !placement && 'invisible'
        )}
      >
        <button
          ref={searchRef}
          type="button"
          onClick={() => {
            onOpenCmd()
            onClose()
          }}
          aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
          className="focus-ring px-well text-label flex h-18 w-full items-center gap-3 px-3 text-left text-(--meta) hover:text-(--ink)"
        >
          <PixelIcon name="search" />
          <span className="flex-1 truncate">
            Type to search apps &amp; projects…
          </span>
          <Kbd>⌘K</Kbd>
        </button>

        <h2 id={pinnedId} className={SECTION_HEADING_CLASS}>
          Pinned
        </h2>
        <ul aria-labelledby={pinnedId} className="grid grid-cols-3 gap-2">
          {APPS.map((app) => (
            <li key={app.id} className="flex">
              <button
                type="button"
                aria-label={`Open ${app.name}`}
                onClick={() => {
                  onLaunch(app.id)
                  onClose()
                }}
                className={cn(
                  ITEM_CLASS,
                  'group flex flex-1 flex-col items-center gap-2 p-2 text-center'
                )}
              >
                <AppIcon id={app.id} size={32} />
                <span className="text-body text-(--ink)">{app.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <h2 id={recentId} className={SECTION_HEADING_CLASS}>
          Recent
        </h2>
        <ul aria-labelledby={recentId}>
          {recentProjects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onOpenProject(p)
                  onClose()
                }}
                className={cn(
                  ITEM_CLASS,
                  'flex w-full items-center gap-3 px-2 py-1 text-left'
                )}
              >
                <ProjectGlyph slug={p.slug} />
                <span className="min-w-0 flex-1">
                  <span className="text-body block truncate text-(--ink)">
                    {p.title}
                  </span>
                  <span className="text-label block truncate text-(--meta)">
                    {p.projectType ?? 'project'} ·{' '}
                    {p.technologies.slice(0, 3).join(' · ')}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div aria-hidden className="rule-dotted" />
        <div className="flex items-center gap-3 px-2">
          {/* The menu covers the desktop, so the desktop's pause would
              hold it; here it is what is in view, so it keeps blinking. */}
          <MascotHead pausesWithDesktop={false} />
          <div className="min-w-0 flex-1">
            <div className="text-title truncate text-(--ink)">
              {AUTHOR_NAME}
            </div>
            <a
              href={`mailto:${EMAIL_CONTACT}`}
              className="focus-ring text-label block truncate text-(--meta) hover:text-(--link)"
            >
              {EMAIL_CONTACT}
            </a>
          </div>
          <ExternalLink
            href={GITHUB_URL}
            aria-label="Open GitHub profile"
            onClick={onClose}
            className="focus-ring flex size-12 flex-none items-center justify-center text-(--meta) hover:bg-(--select) hover:text-(--ink) pointer-coarse:size-(--target)"
          >
            <PixelIcon name="github" />
          </ExternalLink>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close start menu"
            className="focus-ring flex size-12 flex-none items-center justify-center text-(--meta) hover:bg-(--select) hover:text-(--ink) pointer-coarse:size-(--target)"
          >
            <PixelIcon name="close" />
          </button>
        </div>
      </div>
    </div>
  )
}
