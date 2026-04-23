'use client'

import type { KeyboardEvent } from 'react'
import { useState } from 'react'

import { APPS } from './constants'
import type { AppId } from './types'

interface DesktopIconsProps {
  onLaunch: (appId: AppId) => void
}

/**
 * Desktop icons. Mouse: single-click selects, double-click launches.
 * Keyboard: Enter or Space launches the focused icon directly.
 */
export function DesktopIcons({ onLaunch }: DesktopIconsProps) {
  const [selectedId, setSelectedId] = useState<AppId | null>(null)

  const handleKey =
    (appId: AppId) => (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onLaunch(appId)
      }
    }

  return (
    <div className="absolute top-16 left-4 z-10 flex flex-col gap-4">
      {APPS.map((app) => {
        const isSelected = selectedId === app.id
        const Icon = app.icon
        return (
          <button
            key={app.id}
            type="button"
            aria-label={`${app.name} — press Enter to open`}
            onClick={() => setSelectedId(app.id)}
            onDoubleClick={() => onLaunch(app.id)}
            onKeyDown={handleKey(app.id)}
            className={`focus-ring flex w-20 flex-col items-center gap-1.5 rounded-lg p-2 transition-colors ${
              isSelected
                ? 'ring-miku/60 bg-surf-0/80 ring-2'
                : 'hover:bg-surf-0/40'
            }`}
          >
            <span
              aria-hidden
              className="shadow-elev-1 flex size-12 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${app.color}25`,
                color: app.color,
              }}
            >
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className="font-body text-ink text-xs">{app.name}</span>
          </button>
        )
      })}
    </div>
  )
}
