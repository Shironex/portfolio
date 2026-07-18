'use client'

import { APPS } from './constants'
import type { AppId } from './types'

interface DesktopIconsProps {
  onLaunch: (appId: AppId) => void
}

/**
 * Desktop icons. A single click (or Enter/Space) launches the app — web
 * visitors don't expect the double-click ritual, and a click that only
 * "selects" reads as broken.
 */
export function DesktopIcons({ onLaunch }: DesktopIconsProps) {
  return (
    <div className="absolute top-16 left-4 z-10 flex flex-col gap-4">
      {APPS.map((app) => {
        const Icon = app.icon
        return (
          <button
            key={app.id}
            type="button"
            aria-label={`Open ${app.name}`}
            onClick={() => onLaunch(app.id)}
            className="focus-ring hover:bg-surf-0/60 flex w-20 flex-col items-center gap-1.5 rounded-lg p-2 transition-colors"
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
