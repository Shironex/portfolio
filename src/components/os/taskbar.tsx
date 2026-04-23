'use client'

import { Search } from 'lucide-react'

import { APPS } from './constants'
import { Clock } from './clock'
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
      className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-3 py-2 rounded-2xl border border-rule-2 bg-surf-2 backdrop-blur-xl shadow-elev-2 font-body"
    >
      <button
        type="button"
        onClick={onOpenStart}
        aria-label="Open Start menu"
        className="focus-ring bg-miku hover:bg-miku-2 transition-colors px-3 py-1.5 rounded-lg text-cloud font-semibold text-xs"
      >
        Start
      </button>

      <span aria-hidden className="h-6 w-px bg-rule-2" />

      <button
        type="button"
        onClick={onOpenCmd}
        aria-label="Open command palette"
        className="focus-ring flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surf-0 text-ink-3 hover:bg-surf-1 text-xs min-w-[220px]"
      >
        <Search aria-hidden size={14} />
        <span>search apps &amp; projects…</span>
        <kbd className="ml-auto px-1.5 py-0.5 rounded border border-rule bg-surf-solid/60 text-[11px] font-mono">
          ⌘K
        </kbd>
      </button>

      <span aria-hidden className="h-6 w-px bg-rule-2" />

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
                onClick={() =>
                  isOpen ? onRestore(app.id) : onLaunch(app.id)
                }
                className="focus-ring relative flex items-center justify-center size-9 pointer-coarse:size-11 rounded-lg transition-colors hover:bg-surf-0"
              >
                <span aria-hidden style={{ color: app.color }}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {isOpen && (
                  <span
                    aria-hidden
                    className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full ${
                      isMinimized ? 'bg-miku/40' : 'bg-miku'
                    }`}
                  />
                )}
              </button>
              <span
                aria-hidden
                className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-rule-2 bg-surf-solid text-ink text-[10px] font-mono px-2 py-1 shadow-sm opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
              >
                {app.name}
              </span>
            </div>
          )
        })}
      </div>

      <span aria-hidden className="h-6 w-px bg-rule-2" />

      <div className="flex items-center gap-2 font-mono text-[11px] text-ink-3 px-1">
        <Clock />
      </div>
    </div>
  )
}
