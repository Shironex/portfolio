'use client'

import { Search } from 'lucide-react'

import { Clock } from './clock'
import { APPS } from './constants'
import type { AppId, WindowId } from './types'

interface TaskbarProps {
  openIds: WindowId[]
  minimizedIds: WindowId[]
  onLaunch: (appId: AppId) => void
  onRestore: (id: WindowId) => void
  onOpenStart: () => void
  onOpenCmd: () => void
}

/**
 * Bottom taskbar: Start button, search pill, app launcher icons, tray/clock.
 */
export function Taskbar({
  openIds,
  minimizedIds,
  onLaunch,
  onRestore,
  onOpenStart,
  onOpenCmd,
}: TaskbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Taskbar"
      className="border-rule-2 bg-surf-2 shadow-elev-2 font-body fixed bottom-2 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-2 rounded-2xl border px-3 py-2 backdrop-blur-xl"
    >
      <button
        type="button"
        onClick={onOpenStart}
        aria-label="Open Start menu"
        className="focus-ring bg-miku hover:bg-miku-2 text-cloud rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
      >
        Start
      </button>

      <span aria-hidden className="bg-rule-2 h-6 w-px" />

      <button
        type="button"
        onClick={onOpenCmd}
        className="focus-ring bg-surf-0 text-ink-3 hover:bg-surf-1 flex min-w-[220px] items-center gap-2 rounded-lg px-3 py-1.5 text-xs"
      >
        <Search aria-hidden size={14} />
        <span>search apps &amp; projects…</span>
        <kbd className="border-rule bg-surf-solid/60 ml-auto rounded border px-1.5 py-0.5 font-mono text-[11px]">
          ⌘K
        </kbd>
      </button>

      <span aria-hidden className="bg-rule-2 h-6 w-px" />

      <div className="flex items-center gap-1">
        {APPS.map((app) => {
          const isOpen = openIds.includes(app.id)
          const isMinimized = minimizedIds.includes(app.id)
          const Icon = app.icon
          const label = isOpen
            ? isMinimized
              ? `${app.name} (minimized) — restore`
              : `${app.name} — bring to front`
            : `Open ${app.name}`
          return (
            <div key={app.id} className="group relative">
              <button
                type="button"
                aria-label={label}
                onClick={() => (isOpen ? onRestore(app.id) : onLaunch(app.id))}
                className="focus-ring hover:bg-surf-0 relative flex size-9 items-center justify-center rounded-lg transition-colors pointer-coarse:size-11"
              >
                <span aria-hidden style={{ color: app.color }}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {isOpen && (
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full ${
                      isMinimized ? 'bg-miku/40' : 'bg-miku'
                    }`}
                  />
                )}
              </button>
              <span
                aria-hidden
                className="border-rule-2 bg-surf-solid text-ink pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-md border px-2 py-1 font-mono text-[10px] whitespace-nowrap opacity-0 shadow-sm transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
              >
                {app.name}
              </span>
            </div>
          )
        })}
      </div>

      <span aria-hidden className="bg-rule-2 h-6 w-px" />

      <div className="text-ink-3 flex items-center gap-2 px-1 font-mono text-[11px]">
        <Clock />
      </div>
    </div>
  )
}
