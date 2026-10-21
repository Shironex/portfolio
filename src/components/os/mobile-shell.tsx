'use client'

import { useCallback, useState } from 'react'

import { AppIcon, WindowIcon } from '@/components/pixel/app-icon'
import { MascotHead } from '@/components/pixel/mascot-head'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import type { SkyId } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import bootSheet from '@/assets/pixel/boot/os-boot.png'
import type { OsWindowsApi } from '@/hooks/use-os-windows'
import { type Theme, lampLabel } from '@/hooks/use-theme'
import '@/styles/sprites/os-boot.css'

import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
import { CTA_CLASS } from './apps/panels/hero-plate-frame'
import {
  APPS,
  CMD_PALETTE_SHORTCUT,
  MOBILE_BAR_CLASS,
  MOBILE_FEED_TOP_CLASS,
  MOBILE_GUTTER_CLASS,
  PROSE_CLASS,
} from './constants'
import { MobileLauncher } from './mobile-launcher'
import { MobileSheet } from './mobile-sheet'
import { FooterRide } from './pets/footer-ride'
import { SeatedMascot } from './pets/seated-mascot'
import { ShellMain } from './static-layer'
import type { AppId, HeadingLevel, WindowId } from './types'

/**
 * A glyph button of the header: a 22 art px target (44 css), the selection
 * teal under the pointer, the glyph one art px down while pressed.
 */
const HEADER_BUTTON_CLASS =
  'focus-ring flex size-(--target) flex-none items-center justify-center hover:bg-(--select) active:[&>svg]:translate-y-1'

/**
 * Room under the feed for the dock: its 22 art px targets, its 2 art px
 * frame and 1 of padding above and below, and the home indicator.
 */
const DOCK_CLEAR_CLASS =
  'pb-[calc(var(--target)+6*var(--px)+env(safe-area-inset-bottom))]'

interface MobileShellProps {
  os: OsWindowsApi
  onOpenCmd: () => void
  onCopyLink: (id: WindowId) => void
  theme: Theme
  onToggleTheme: () => void
  sky: SkyId
  onSelectSky: (id: SkyId) => void
  /** Level of the hero headline; see `HeroText`. */
  heroHeadingLevel?: HeadingLevel
  /** Passed to {@link ShellMain}. */
  overStaticLayer?: boolean
}

/**
 * Mobile-only layout for ShiroOS (< 768px), in pixels (SPEC 1.7):
 *   - a header in the menu bar's style (`<header>`): the mascot head, the
 *     wordmark, the Lamp and the launcher button, 22 art px tall;
 *   - the feed (`<main>`): the hero plate, the featured panel and the
 *     contact card with the mascot seated on it, then the skyline footer
 *     the mini-me rides across once;
 *   - the dock (`<nav>`): search and the six apps in a taskbar 9-slice.
 *
 * The top window of `os.windows` renders as a full-screen slide-up sheet, and
 * so does the app launcher: the same `useOsWindows` state drives both desktop
 * and mobile. Bars and sheets pad themselves with the safe-area insets.
 * The header and dock are night chrome in both Lamp modes; the feed's
 * panels and the sheets' bodies follow the Lamp.
 *
 * A sheet is modal, so the feed and its `h1` are inert under it: a project
 * sheet carries the project title as the exposed `h1` instead.
 */
export function MobileShell({
  os,
  onOpenCmd,
  onCopyLink,
  theme,
  onToggleTheme,
  sky,
  onSelectSky,
  heroHeadingLevel,
  overStaticLayer,
}: MobileShellProps) {
  const [launcherOpen, setLauncherOpen] = useState(false)

  const openApp = useCallback(
    (id: AppId) => {
      os.openApp(id)
      setLauncherOpen(false)
    },
    [os]
  )

  const openContact = useCallback(() => os.openApp('contact'), [os])
  const closeLauncher = useCallback(() => setLauncherOpen(false), [])

  // Only one sheet is ever visible on mobile. Mounting every open window
  // wastes work and creates competing `body.overflow` effects, so only the
  // top window of the stack is rendered.
  const { close, topmostId } = os
  const topSheet = os.windows.find((w) => w.id === topmostId) ?? null
  const closeTopSheet = useCallback(() => {
    if (topmostId) close(topmostId)
  }, [topmostId, close])

  return (
    <>
      {/* The header: the menu bar's ground navy and its 1 art px teal rule,
          which hangs just under the bar so a pressed button never covers
          it. Solid, so nothing resamples the feed scrolling under it. */}
      <header
        className={cn(
          'os-night z-chrome fixed inset-x-0 top-0 flex items-center gap-3 bg-(--ground)',
          MOBILE_BAR_CLASS,
          MOBILE_GUTTER_CLASS
        )}
      >
        <div
          aria-hidden
          className="absolute inset-x-0 top-full h-1 bg-(--select)"
        />
        <MascotHead />
        <span className="text-title text-(--lamp)">ShiroOS</span>
        {/* Pulled out by the glyph's margin, so the last glyph lines up
            with the feed's right edge. */}
        <div className="-mr-7 ml-auto flex items-center">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={lampLabel(theme)}
            className={cn(
              HEADER_BUTTON_CLASS,
              theme === 'dark' ? 'text-(--meta)' : 'text-(--lamp)'
            )}
          >
            <PixelIcon name={theme === 'dark' ? 'lamp-off' : 'lamp-on'} />
          </button>
          <button
            type="button"
            onClick={() => setLauncherOpen(true)}
            aria-label="Open app launcher"
            aria-haspopup="dialog"
            aria-expanded={launcherOpen}
            className={cn(HEADER_BUTTON_CLASS, 'text-(--ink)')}
          >
            <PixelIcon name="menu" />
          </button>
        </div>
      </header>

      {/* Feed */}
      <ShellMain
        overStaticLayer={overStaticLayer}
        className={cn(
          'fixed inset-0 overflow-y-auto',
          MOBILE_FEED_TOP_CLASS,
          DOCK_CLEAR_CLASS
        )}
      >
        <div className={cn('flex flex-col gap-8', MOBILE_GUTTER_CLASS)}>
          <HeroPlate
            onOpenCmd={onOpenCmd}
            onOpenContact={openContact}
            headingLevel={heroHeadingLevel}
          />
          <FeaturedPanel onOpenProject={os.openProject} />
          <ContactCard onOpenContact={openContact} />
          <FeedWordmark />
        </div>
        <FooterRide />
      </ShellMain>

      <MobileDock os={os} onOpenCmd={onOpenCmd} onOpenApp={openApp} />

      {launcherOpen && (
        <MobileLauncher
          onOpenApp={openApp}
          onClose={closeLauncher}
          theme={theme}
          onToggleTheme={onToggleTheme}
          sky={sky}
          onSelectSky={onSelectSky}
        />
      )}

      {/* Top mobile sheet only: the rest of the window stack waits behind it. */}
      {topSheet && (
        <MobileSheet
          key={topSheet.id}
          title={topSheet.title}
          icon={<WindowIcon win={topSheet} />}
          onClose={closeTopSheet}
          onCopyLink={() => onCopyLink(topSheet.id)}
        >
          <AppBody
            id={topSheet.id}
            project={topSheet.project}
            onOpenProject={os.openProject}
            projectTitleLevel={1}
          />
        </MobileSheet>
      )}
    </>
  )
}

/**
 * The feed's closing card, a panel 9-slice with the mascot seated on its
 * top edge (SPEC 3.8). The margin over it is the room her head needs, and
 * goes with her when Pets is off.
 */
function ContactCard({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <div className="px-panel relative mt-38 flex flex-col items-start gap-5 p-10 in-data-[pets=hidden]:mt-0">
      <SeatedMascot className="right-8" />
      <h2 className="text-title text-(--heading)">
        Hiring, a contract, or an MVP to build
      </h2>
      <p className={PROSE_CLASS}>
        Open to full-time remote roles and to contracts or MVPs. Remote, CET
        (UTC+1). I reply within 24 hours.
      </p>
      <button
        type="button"
        onClick={onOpenContact}
        className={cn(CTA_CLASS, 'os-night px-button-primary text-(--ground)')}
      >
        Get in touch
      </button>
    </div>
  )
}

/** The wordmark over the footer: the name, and the boot screen's kana. */
function FeedWordmark() {
  return (
    <p className="os-night flex items-center justify-center gap-3 pt-6">
      <span className="text-title text-(--lamp)">ShiroOS</span>
      <span
        role="img"
        aria-label="シロOS"
        className="px-label-plate block flex-none p-1"
      >
        <span
          className="px-os-boot px-os-boot-kana block"
          style={{ backgroundImage: `url(${bootSheet.src})` }}
        />
      </span>
    </p>
  )
}

interface MobileDockProps {
  os: OsWindowsApi
  onOpenCmd: () => void
  onOpenApp: (id: AppId) => void
}

/**
 * The dock: the taskbar 9-slice across the foot of the screen, night in
 * both Lamp modes, with search (a well, labelled once there is room) and the
 * six apps as 16x16 icons in 22 art px targets. An open app shows the
 * taskbar's running pip. On a 320 css screen at DPR 2 the seven targets and
 * the frame fill the width exactly; at a DPR where a target is more than
 * 2 css px per art px they may shrink, which only a fine pointer meets.
 */
function MobileDock({ os, onOpenCmd, onOpenApp }: MobileDockProps) {
  return (
    <nav
      aria-label="Dock"
      className="os-night z-chrome fixed inset-x-0 bottom-0 bg-(--ground) pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
    >
      <div className="px-taskbar flex w-[round(down,100%,var(--px))] items-center p-1 min-[360px]:gap-2">
        <button
          type="button"
          onClick={onOpenCmd}
          aria-label="Search apps and projects"
          aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
          className="focus-ring px-well text-label flex h-(--target) min-w-18 flex-1 items-center justify-center gap-2 text-(--meta) hover:text-(--ink) min-[380px]:justify-start min-[380px]:px-3"
        >
          <PixelIcon name="search" className="flex-none" />
          <span aria-hidden className="hidden truncate min-[380px]:inline">
            search…
          </span>
        </button>
        <div className="flex min-w-0 items-center">
          {APPS.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenApp(app.id)}
              aria-label={`Open ${app.name}`}
              className="focus-ring relative flex h-(--target) w-(--target) min-w-18 shrink items-center justify-center hover:bg-(--select)"
            >
              <AppIcon id={app.id} />
              {/* The running pip: 2x1 art px of lamp, centred. */}
              {os.isOpen(app.id) && (
                <span
                  aria-hidden
                  className="absolute bottom-0 left-1/2 -ml-1 h-1 w-2 bg-(--lamp)"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
