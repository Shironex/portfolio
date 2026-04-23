'use client'

import { useState } from 'react'

import { APPS } from './constants'
import type { AppId } from './types'

interface DesktopIconsProps {
  onLaunch: (appId: AppId) => void
}

/**
 * PostHog-inspired desktop icons rendered on the wallpaper.
 * Single-click selects, double-click launches the app.
 */
export function DesktopIcons({ onLaunch }: DesktopIconsProps) {
  const [selectedId, setSelectedId] = useState<AppId | null>(null)

  return (
    <div className="absolute left-4 top-16 z-10 flex flex-col gap-4">
      {APPS.map((app) => {
        const isSelected = selectedId === app.id
        return (
          <button
            key={app.id}
            type="button"
            onClick={() => setSelectedId(app.id)}
            onDoubleClick={() => onLaunch(app.id)}
            className={`flex w-20 flex-col items-center gap-1.5 rounded-lg p-2 transition-colors ${
              isSelected
                ? 'ring-2 ring-miku/60 bg-surf-0/80'
                : 'hover:bg-surf-0/40'
            }`}
          >
            <span
              className="flex size-12 items-center justify-center rounded-xl shadow-md"
              style={{
                backgroundColor: `${app.color}25`,
                color: app.color,
              }}
            >
              <span className="text-2xl">{app.icon}</span>
            </span>
            <span className="font-body text-xs text-ink">{app.name}</span>
          </button>
        )
      })}
    </div>
  )
}
