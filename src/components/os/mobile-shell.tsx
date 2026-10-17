'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'

import { LayoutGrid, Menu, Moon, Search, Sun } from 'lucide-react'

import { GithubIcon } from '@/components/icons/github-icon'
import { AppIcon, WindowIcon } from '@/components/pixel/app-icon'

import { GITHUB_URL } from '@/lib/constants'
import type { SkyId } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import type { OsWindowsApi } from '@/hooks/use-os-windows'
import { type Theme, lampLabel } from '@/hooks/use-theme'

import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
import {
  APPS,
  CMD_PALETTE_SHORTCUT,
  EYEBROW_CLASS,
  MOBILE_BAR_CLASS,
  MOBILE_GUTTER_CLASS,
} from './constants'
import { ExternalLink } from './external-link'
import { MobileSheet } from './mobile-sheet'
import { SkyPicker } from './sky-picker'
import { ShellMain } from './static-layer'
import type { AppId, HeadingLevel, WindowId } from './types'

const LAUNCHER_HEADING_CLASS = cn(EYEBROW_CLASS, 'text-ink-4 mb-6')

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
 * Mobile-only layout for ShiroOS (< 768px).
 *
 * Replaces the draggable desktop metaphor with a vertical feed:
 *   - 48px top bar (`<header>`) with logo + launcher menu
 *   - the feed (`<main>`): hero plate, github activity, featured projects
 *   - closing "signal" card that opens the contact sheet
 *   - 28 art px (56px at DPR 1 and 2) bottom dock (`<nav>`) with app icons + ⌘K search pill
 *
 * The top window of `os.windows` renders as a full-screen slide-up sheet, and
 * so does the app launcher: the same `useOsWindows` state drives both desktop
 * and mobile. Bars and sheets pad themselves with the safe-area insets.
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
      {/* Top bar. A solid surface, in place of a see-through fill over a
          backdrop blur that resampled the feed scrolling under it on every
          frame; the dock below is the same. */}
      <header
        className={cn(
          'os-night border-rule bg-surf-solid z-chrome fixed inset-x-0 top-0 flex items-center justify-between gap-6 border-b',
          MOBILE_BAR_CLASS,
          MOBILE_GUTTER_CLASS
        )}
      >
        <div className="flex items-center gap-4">
          <Image
            aria-hidden
            src="/mascot.png"
            alt=""
            width={44}
            height={44}
            priority
            className="border-rule bg-miku/10 size-10 rounded-full border object-cover object-top"
          />
          <span className="font-display text-ink text-sm font-semibold">
            ShiroOS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={lampLabel(theme)}
            className="focus-ring text-ink-2 hover:bg-surf-0 hover:text-miku-2-icon flex size-(--target) items-center justify-center rounded-md"
          >
            {theme === 'dark' ? (
              <Sun aria-hidden size={18} />
            ) : (
              <Moon aria-hidden size={18} />
            )}
          </button>
          <button
            type="button"
            onClick={() => setLauncherOpen(true)}
            aria-label="Open app launcher"
            aria-haspopup="dialog"
            aria-expanded={launcherOpen}
            className="focus-ring text-ink-2 hover:bg-surf-0 hover:text-ink flex size-(--target) items-center justify-center rounded-md"
          >
            <Menu aria-hidden size={18} />
          </button>
        </div>
      </header>

      {/* Feed */}
      <ShellMain
        overStaticLayer={overStaticLayer}
        className="fixed inset-0 overflow-y-auto pt-[calc(3rem+env(safe-area-inset-top))] pb-[calc(var(--spacing)*36+env(safe-area-inset-bottom))]"
      >
        <div className={cn('flex flex-col gap-8 pt-8', MOBILE_GUTTER_CLASS)}>
          <HeroPlate
            onOpenCmd={onOpenCmd}
            onOpenContact={openContact}
            headingLevel={heroHeadingLevel}
          />
          <FeaturedPanel onOpenProject={os.openProject} />

          <div className="border-rule-2 bg-surf-solid shadow-elev-2 relative overflow-hidden rounded-2xl border p-10">
            <div className="relative">
              <h2 className="font-display text-ink text-lg font-bold">
                Hiring, a contract, or an MVP to build
              </h2>
              <p className="font-body text-ink-2 mt-4 text-sm">
                Open to full-time remote roles and to contracts or MVPs. Remote,
                CET (UTC+1). I reply within 24 hours.
              </p>
              <button
                type="button"
                onClick={openContact}
                className="focus-ring bg-miku text-cloud hover:bg-miku-2 mt-8 inline-flex items-center gap-4 rounded-lg px-8 py-4 text-sm font-semibold transition-colors"
              >
                Get in touch
              </button>
            </div>
          </div>

          <div
            className={cn(
              EYEBROW_CLASS,
              'os-night text-ink-4 pt-4 pb-8 text-center'
            )}
          >
            ShiroOS · シロOS
          </div>
        </div>
      </ShellMain>

      {/* Bottom dock */}
      <nav
        aria-label="Dock"
        className="os-night border-rule bg-surf-solid z-chrome fixed inset-x-0 bottom-0 border-t pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)]"
      >
        {/* Seven 44px targets fill a 320px screen edge to edge, so below
            440px search is an icon and the apps spread across what is left;
            from there up it grows back into the labelled pill. */}
        <div className="flex h-28 items-center px-3 min-[360px]:gap-4 min-[360px]:px-6">
          <button
            type="button"
            onClick={onOpenCmd}
            aria-label="Search apps and projects"
            aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
            className="focus-ring bg-surf-0 text-ink-3 flex size-(--target) shrink-0 items-center justify-center gap-4 rounded-lg text-xs min-[440px]:w-auto min-[440px]:min-w-0 min-[440px]:flex-1 min-[440px]:shrink min-[440px]:justify-start min-[440px]:px-6"
          >
            <Search aria-hidden size={14} className="shrink-0" />
            <span aria-hidden className="hidden truncate min-[440px]:inline">
              search apps &amp; projects…
            </span>
          </button>
          <div className="flex flex-1 items-center justify-between min-[440px]:flex-none min-[440px]:justify-start min-[440px]:gap-2">
            {APPS.map((app) => {
              const isOpen = os.isOpen(app.id)
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  aria-label={`Open ${app.name}`}
                  className="focus-ring hover:bg-surf-0 relative flex size-(--target) shrink-0 items-center justify-center rounded-lg transition-colors"
                >
                  <AppIcon id={app.id} />
                  {isOpen && (
                    <span
                      aria-hidden
                      className="bg-miku absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rounded-full"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* App launcher sheet */}
      {launcherOpen && (
        <MobileSheet
          title="launcher"
          label="App launcher"
          closeLabel="Close launcher"
          layer="launcher"
          icon={<LayoutGrid size={16} strokeWidth={1.75} />}
          onClose={closeLauncher}
        >
          <ul className="grid grid-cols-3 gap-6">
            {APPS.map((app) => (
              <li key={app.id} className="flex">
                <button
                  type="button"
                  onClick={() => openApp(app.id)}
                  aria-label={`Open ${app.name}`}
                  className="group focus-ring border-rule bg-surf-0 hover:bg-surf-1 flex flex-1 flex-col items-center gap-4 rounded-xl border px-4 py-8 transition-colors"
                >
                  <AppIcon id={app.id} size={32} />
                  <span className="font-display text-ink text-sm">
                    {app.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="border-rule mt-12 border-t pt-10">
            <h3 className={LAUNCHER_HEADING_CLASS}>Elsewhere</h3>
            <ExternalLink
              href={GITHUB_URL}
              onClick={closeLauncher}
              className="focus-ring border-rule bg-surf-0 hover:bg-surf-1 text-ink flex h-(--target) items-center gap-6 rounded-xl border px-6 text-sm transition-colors"
            >
              <GithubIcon className="text-miku-icon size-9" />
              GitHub profile
            </ExternalLink>
          </div>

          <div className="border-rule mt-12 border-t pt-10">
            <h3 className={LAUNCHER_HEADING_CLASS}>Sky</h3>
            <SkyPicker value={sky} onSelect={onSelectSky} />
          </div>
        </MobileSheet>
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
