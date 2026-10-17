'use client'

import { memo } from 'react'

import { AppIcon } from '@/components/pixel/app-icon'

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
      {APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          aria-label={`Open ${app.name}`}
          onClick={() => onLaunch(app.id)}
          className="group focus-ring hover:bg-surf-0/60 flex w-40 flex-col items-center gap-3 p-2 transition-colors"
        >
          <AppIcon id={app.id} size={32} />
          <span className="font-body text-ink bg-ground px-2 text-xs">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export const DesktopIcons = memo(DesktopIconsImpl)
