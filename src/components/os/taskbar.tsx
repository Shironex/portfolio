'use client'

import { Search } from 'lucide-react'

import { useClock } from '@/hooks/use-clock'

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
 * Ported from new-design/index.html `function Taskbar()`.
 */
export function Taskbar({
  openIds,
  minimizedIds,
  onLaunch,
  onRestore,
  onOpenStart,
  onOpenCmd,
}: TaskbarProps) {
  const now = useClock()
  const time = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
  const date = now.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-3 py-2 rounded-2xl border border-rule-2 bg-surf-2 backdrop-blur-xl shadow-[0_10px_40px_-5px_rgba(13,27,42,0.2)] font-body">
      <button
        type="button"
        onClick={onOpenStart}
        className="bg-gradient-to-r from-miku to-pink px-3 py-1.5 rounded-lg text-cloud font-semibold text-xs flex items-center gap-1.5"
      >
        <span>♪</span>
        <span>Start</span>
      </button>

      <span className="h-6 w-px bg-rule-2" />

      <button
        type="button"
        onClick={onOpenCmd}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surf-0 text-ink-3 hover:bg-surf-1 text-xs min-w-[220px]"
      >
        <Search size={14} />
        <span>search apps &amp; projects…</span>
        <kbd className="ml-auto px-1.5 py-0.5 rounded border border-rule bg-surf-solid/60 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      <span className="h-6 w-px bg-rule-2" />

      <div className="flex items-center gap-1">
        {APPS.map((app) => {
          const isOpen = openIds.includes(app.id)
          const isMinimized = minimizedIds.includes(app.id)
          return (
            <div key={app.id} className="group relative">
              <button
                type="button"
                onClick={() =>
                  isOpen ? onRestore(app.id) : onLaunch(app.id)
                }
                className="relative flex items-center justify-center size-9 rounded-lg transition-colors hover:bg-surf-0"
              >
                <span style={{ color: app.color }}>{app.icon}</span>
                {isOpen && (
                  <span
                    className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 size-1 rounded-full ${
                      isMinimized ? 'bg-miku/40' : 'bg-miku'
                    }`}
                  />
                )}
              </button>
              <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-rule-2 bg-surf-solid text-ink text-[10px] font-mono px-2 py-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {app.name}
              </span>
            </div>
          )
        })}
      </div>

      <span className="h-6 w-px bg-rule-2" />

      <div className="flex items-center gap-2 font-mono text-[11px] text-ink-3 px-1">
        <span>♪</span>
        <span>✧</span>
        <span>{time}</span>
        <span>{date}</span>
      </div>
    </div>
  )
}
