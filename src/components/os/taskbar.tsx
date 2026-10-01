'use client'

import { memo } from 'react'

import { Search } from 'lucide-react'

import { accentColor } from './accent-map'
import { Clock } from './clock'
import { APPS, CMD_PALETTE_SHORTCUT } from './constants'
import { Kbd } from './kbd'
import type { AppId, WindowId } from './types'

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

/**
 * Bottom taskbar: Start button, search pill, app launcher icons, tray/clock.
 * The page's `<nav>`: every stop in it opens or switches to something.
 *
 * `bg-surf-2` is near opaque, so the bar carries no backdrop blur: a blur
 * would resample the wallpaper behind it on every frame for nothing visible.
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
    <nav
      aria-label="Taskbar"
      className="border-rule-2 bg-surf-2 shadow-elev-2 font-body z-chrome fixed bottom-[calc(0.5rem+env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border px-3 py-2"
    >
      <button
        type="button"
        onClick={onOpenStart}
        aria-label="Open Start menu"
        aria-haspopup="dialog"
        className="focus-ring bg-miku hover:bg-miku-2 text-cloud rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
      >
        Start
      </button>

      <span aria-hidden className="bg-rule-2 h-6 w-px" />

      <button
        type="button"
        onClick={onOpenCmd}
        aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
        className="focus-ring bg-surf-0 text-ink-3 hover:bg-surf-1 flex min-w-[160px] items-center gap-2 rounded-lg px-3 py-1.5 text-xs lg:min-w-[220px]"
      >
        <Search aria-hidden size={14} />
        <span>search apps &amp; projects…</span>
        <Kbd className="ml-auto">⌘K</Kbd>
      </button>

      <span aria-hidden className="bg-rule-2 h-6 w-px" />

      <div className="flex items-center gap-1">
        {APPS.map((app) => {
          const isOpen = openIds.includes(app.id)
          const isMinimized = minimizedIds.includes(app.id)
          const Icon = app.icon
          // The label names what the click will do, so it tracks `onActivate`.
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
                onClick={() => (isOpen ? onActivate(app.id) : onLaunch(app.id))}
                className="focus-ring hover:bg-surf-0 relative flex size-9 items-center justify-center rounded-lg transition-colors pointer-coarse:size-11"
              >
                <span aria-hidden style={{ color: accentColor(app.accent) }}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {isOpen && (
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-1/2 h-1 w-2.5 -translate-x-1/2 rounded-full transition-[scale,background-color] duration-150 ${
                      isMinimized ? 'bg-miku/40 scale-x-40' : 'bg-miku'
                    }`}
                  />
                )}
              </button>
              <span
                aria-hidden
                className="border-rule-2 bg-surf-solid text-ink pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 rounded-md border px-2 py-1 font-mono text-[10px] whitespace-nowrap opacity-0 shadow-sm transition-[translate,opacity] duration-150 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
              >
                {app.name}
              </span>
            </div>
          )
        })}
      </div>

      <span aria-hidden className="bg-rule-2 h-6 w-px" />

      {/* Time only — the menubar already shows the full date. */}
      <div className="text-ink-3 flex items-center gap-2 px-1 font-mono text-[11px]">
        <Clock showDate={false} />
      </div>
    </nav>
  )
}

export const Taskbar = memo(TaskbarImpl)
