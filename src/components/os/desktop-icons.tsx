'use client'

import { memo } from 'react'

import { TINT } from '@/lib/os/tokens.generated'

import { accentIcon, accentTintLayer } from './accent-map'
import { APPS } from './constants'
import type { AppId } from './types'

interface DesktopIconsProps {
  onLaunch: (appId: AppId) => void
}

/**
 * Desktop icons. A single click (or Enter/Space) launches the app: web
 * visitors don't expect the double-click ritual, and a click that only
 * "selects" reads as broken.
 *
 * They sit on the sky, so they are night in both Lamp modes (`os-night`),
 * and the tile and the label each sit on a ground plate: no sky is a ground
 * text or an icon was measured on.
 */
function DesktopIconsImpl({ onLaunch }: DesktopIconsProps) {
  return (
    <div className="os-night z-desktop absolute top-32 left-8 flex flex-col gap-8">
      {APPS.map((app) => {
        const Icon = app.icon
        return (
          <button
            key={app.id}
            type="button"
            aria-label={`Open ${app.name}`}
            onClick={() => onLaunch(app.id)}
            className="focus-ring hover:bg-surf-0/60 flex w-40 flex-col items-center gap-3 rounded-lg p-4 transition-colors"
          >
            <span
              aria-hidden
              className="bg-ground shadow-elev-1 flex size-24 items-center justify-center rounded-xl"
              style={{
                backgroundImage: accentTintLayer(app.accent, TINT.icon),
                color: accentIcon(app.accent),
              }}
            >
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className="font-body text-ink bg-ground px-2 text-xs">
              {app.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export const DesktopIcons = memo(DesktopIconsImpl)
