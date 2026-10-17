'use client'

import { memo } from 'react'

import { AppIcon, AppLogo } from '@/components/pixel/app-icon'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { cn } from '@/lib/utils'

import { Clock } from './clock'
import { APPS, CMD_PALETTE_SHORTCUT } from './constants'
import { Kbd } from './kbd'
import type { AppId, WindowId } from './types'

/** Marks the Start button, which the Start menu opens above. */
export const START_BUTTON_ATTRIBUTE = 'data-start-button'

interface TaskbarProps {
  openIds: WindowId[]
  minimizedIds: WindowId[]
  topmostId: WindowId | null
  onLaunch: (appId: AppId) => void
  /** Restores a minimized window, minimizes the top one, raises any other. */
  onActivate: (id: WindowId) => void
  onOpenStart: () => void
  onOpenCmd: () => void
}

/** A 22 art px button of the bar, around a 16x16 icon. */
const ICON_BUTTON_CLASS =
  'focus-ring flex size-22 flex-none items-center justify-center hover:bg-(--select) pointer-coarse:size-(--target)'

/**
 * Bottom taskbar: Start, search, the app buttons and the clock. The page's
 * `<nav>`: every stop in it opens or switches to something.
 *
 * The `taskbar` 9-slice, night in both Lamp modes. Every part has a fixed
 * size in art px (the clock and search text included), so the bar is a whole
 * even number of art px wide. It is centred by flex in a full-width row that
 * is itself a whole even number of art px wide, so its left edge lands on an
 * art pixel: no `translate(-50%)`, which put it on half a device pixel.
 *
 * Memoized: its id lists come from `useStackIds`, so moving, resizing or
 * restacking a window does not re-render it.
 */
function TaskbarImpl({
  openIds,
  minimizedIds,
  topmostId,
  onLaunch,
  onActivate,
  onOpenStart,
  onOpenCmd,
}: TaskbarProps) {
  return (
    <div className="z-chrome pointer-events-none fixed bottom-[calc(4*var(--px)+env(safe-area-inset-bottom))] left-0 flex w-[round(down,100%,calc(2*var(--px)))] justify-center">
      <nav
        aria-label="Taskbar"
        // 262x28 art px: its parts and gaps, the 2 art px frame and 1 of
        // padding on each side; with the 4 art px under it, the 32 a
        // maximized window leaves free. Set, so a border width the browser
        // snaps to whole px does not change it.
        className="os-night px-taskbar pointer-events-auto flex h-28 w-262 items-center gap-2 p-1 pointer-coarse:size-auto"
      >
        <button
          type="button"
          onClick={onOpenStart}
          aria-label="Open Start menu"
          aria-haspopup="dialog"
          {...{ [START_BUTTON_ATTRIBUTE]: '' }}
          className={ICON_BUTTON_CLASS}
        >
          <AppLogo />
        </button>

        <button
          type="button"
          onClick={onOpenCmd}
          aria-label="search apps and projects"
          aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
          className="focus-ring px-well text-label flex h-22 w-64 flex-none items-center gap-2 px-2 text-(--meta) hover:text-(--ink)"
        >
          <PixelIcon name="search" />
          <span aria-hidden>search</span>
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>

        <div className="flex items-center">
          {APPS.map((app) => {
            const isOpen = openIds.includes(app.id)
            const isMinimized = minimizedIds.includes(app.id)
            // The label names what the click will do, so it tracks
            // `onActivate`.
            const label = isOpen
              ? isMinimized
                ? `${app.name} (minimized) - restore`
                : app.id === topmostId
                  ? `${app.name} - minimize`
                  : `${app.name} - bring to front`
              : `Open ${app.name}`
            return (
              <div key={app.id} className="group relative">
                <button
                  type="button"
                  aria-label={label}
                  onClick={() =>
                    isOpen ? onActivate(app.id) : onLaunch(app.id)
                  }
                  className={cn(ICON_BUTTON_CLASS, 'relative')}
                >
                  <AppIcon id={app.id} />
                  {/* The running pip: 2x1 art px of lamp, dimmed while the
                      window is minimized. */}
                  {isOpen && (
                    <span
                      aria-hidden
                      className={cn(
                        'absolute bottom-0 left-10 h-1 w-2',
                        isMinimized ? 'bg-(--frame-dim)' : 'bg-(--lamp)'
                      )}
                    />
                  )}
                </button>
                {/* Left-aligned with the button: centring it on a label of
                    any width would put it on half a pixel. */}
                <span
                  aria-hidden
                  className="px-tooltip text-label pointer-events-none absolute bottom-full left-0 mb-2 px-2 whitespace-nowrap text-(--ink) opacity-0 group-hover:opacity-100 group-has-focus-visible:opacity-100"
                >
                  {app.name}
                </span>
              </div>
            )
          })}
        </div>

        {/* Time only: the menubar already shows the full date. Wide enough
            for a 12-hour time (`08:15 PM`). */}
        <Clock
          showDate={false}
          className="w-32 flex-none text-center text-(--meta)"
        />
      </nav>
    </div>
  )
}

export const Taskbar = memo(TaskbarImpl)
