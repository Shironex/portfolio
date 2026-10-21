'use client'

import { memo } from 'react'

import { AppIcon } from '@/components/pixel/app-icon'

import { APPS } from './constants'
import type { AppId } from './types'

interface DesktopIconsProps {
  onLaunch: (appId: AppId) => void
}

/**
 * Desktop icons (SPEC 1.4). A single click (or Enter/Space) launches the
 * app: web visitors don't expect the double-click ritual, and a click that
 * only "selects" reads as broken.
 *
 * Each is the 32x32 app icon on its navy tile, whose loop plays on hover and
 * keyboard focus, over a Departure Mono label on a navy plate; hover lights
 * the label in lamp instead of laying a see-through plate over the sky. They
 * sit on the wallpaper, so they are night in both Lamp modes (`os-night`).
 * On a desktop too short for the column they close up (`low-desk`), then
 * wrap into a second column.
 */
function DesktopIconsImpl({ onLaunch }: DesktopIconsProps) {
  return (
    <div className="os-night z-desktop low-desk:gap-0 absolute top-26 left-6 flex max-h-[calc(100dvh-32*var(--px))] flex-col flex-wrap content-start gap-4">
      {APPS.map((app) => (
        <button
          key={app.id}
          type="button"
          aria-label={`Open ${app.name}`}
          onClick={() => onLaunch(app.id)}
          className="group focus-ring flex w-44 flex-col items-center gap-1 p-1"
        >
          <AppIcon id={app.id} size={32} />
          <span className="px-label-plate text-label px-2 text-(--ink) group-hover:text-(--lamp) group-focus-visible:text-(--lamp)">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  )
}

export const DesktopIcons = memo(DesktopIconsImpl)
