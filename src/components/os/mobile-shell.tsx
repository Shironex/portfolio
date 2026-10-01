'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'

import { LayoutGrid, Menu, Moon, Search, Sun } from 'lucide-react'

import { GithubIcon } from '@/components/icons/github-icon'

import { GITHUB_URL } from '@/lib/constants'
import type { PaletteId } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import type { OsWindowsApi } from '@/hooks/use-os-windows'
import type { Theme } from '@/hooks/use-theme'

import { accentColor, accentTint } from './accent-map'
import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
import {
  APPS,
  CMD_PALETTE_SHORTCUT,
  MOBILE_BAR_CLASS,
  MOBILE_GUTTER_CLASS,
  windowIconFor,
} from './constants'
import { ExternalLink } from './external-link'
import { MobileSheet } from './mobile-sheet'
import { PalettePicker } from './palette-picker'
import { ShellMain } from './static-layer'
import type { AppId, HeadingLevel, WindowId } from './types'

const LAUNCHER_HEADING_CLASS =
  'text-ink-4 mb-3 font-mono text-[10px] font-normal tracking-[0.22em] uppercase'

interface MobileShellProps {
  os: OsWindowsApi
  onOpenCmd: () => void
  onCopyLink: (id: WindowId) => void
  theme: Theme
  onToggleTheme: () => void
  palette: PaletteId
  onSelectPalette: (id: PaletteId) => void
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
 *   - 56px bottom dock (`<nav>`) with app icons + ⌘K search pill
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
  palette,
  onSelectPalette,
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
      {/* Top bar */}
      <header
        className={cn(
          'border-rule bg-surf-1 z-chrome fixed inset-x-0 top-0 flex items-center justify-between gap-3 border-b backdrop-blur-md',
          MOBILE_BAR_CLASS,
          MOBILE_GUTTER_CLASS
        )}
      >
        <div className="flex items-center gap-2">
          <Image
            aria-hidden
            src="/mascot.png"
            alt=""
            width={44}
            height={44}
            priority
            className="border-rule bg-miku/10 size-5 rounded-full border object-cover object-top"
          />
          <span className="font-display text-ink text-sm font-semibold">
            ShiroOS
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark'
                ? 'Switch to light theme'
                : 'Switch to dark theme'
            }
            className="focus-ring text-ink-2 hover:bg-surf-0 hover:text-miku-2 flex size-11 items-center justify-center rounded-md"
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
            className="focus-ring text-ink-2 hover:bg-surf-0 hover:text-ink flex size-11 items-center justify-center rounded-md"
          >
            <Menu aria-hidden size={18} />
          </button>
        </div>
      </header>

      {/* Feed */}
      <ShellMain
        overStaticLayer={overStaticLayer}
        className="fixed inset-0 overflow-y-auto pt-[calc(3rem+env(safe-area-inset-top))] pb-[calc(56px+env(safe-area-inset-bottom)+16px)]"
      >
        <div className={cn('flex flex-col gap-4 pt-4', MOBILE_GUTTER_CLASS)}>
          <HeroPlate
            onOpenCmd={onOpenCmd}
            onOpenContact={openContact}
            headingLevel={heroHeadingLevel}
          />
          <FeaturedPanel onOpenProject={os.openProject} />

          <div className="border-rule-2 bg-surf-solid shadow-elev-2 relative overflow-hidden rounded-2xl border p-5">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-8 size-40 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, var(--color-pink), transparent 70%)',
              }}
            />
            <div className="relative">
              <h2 className="font-display text-ink text-lg font-bold">
                Hiring, a contract, or an MVP to build
              </h2>
              <p className="font-body text-ink-2 mt-2 text-sm">
                Open to full-time remote roles and to contracts or MVPs. Remote,
                CET (UTC+1). I reply within 24 hours.
              </p>
              <button
                type="button"
                onClick={openContact}
                className="focus-ring bg-miku text-cloud hover:bg-miku-2 mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              >
                Get in touch
              </button>
            </div>
          </div>

          <div className="text-ink-4 pt-2 pb-4 text-center font-mono text-[10px] tracking-[0.22em] uppercase">
            ShiroOS · シロOS
          </div>
        </div>
      </ShellMain>

      {/* Bottom dock */}
      <nav
        aria-label="Dock"
        className="border-rule bg-surf-1/95 z-chrome fixed inset-x-0 bottom-0 border-t pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] backdrop-blur-md"
      >
        {/* Seven 44px targets fill a 320px screen edge to edge, so below
            440px search is an icon and the apps spread across what is left;
            from there up it grows back into the labelled pill. */}
        <div className="flex h-14 items-center px-1.5 min-[360px]:gap-2 min-[360px]:px-3">
          <button
            type="button"
            onClick={onOpenCmd}
            aria-label="Search apps and projects"
            aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
            className="focus-ring bg-surf-0 text-ink-3 flex size-11 shrink-0 items-center justify-center gap-2 rounded-lg text-xs min-[440px]:w-auto min-[440px]:min-w-0 min-[440px]:flex-1 min-[440px]:shrink min-[440px]:justify-start min-[440px]:px-3"
          >
            <Search aria-hidden size={14} className="shrink-0" />
            <span aria-hidden className="hidden truncate min-[440px]:inline">
              search apps &amp; projects…
            </span>
          </button>
          <div className="flex flex-1 items-center justify-between min-[440px]:flex-none min-[440px]:justify-start min-[440px]:gap-1">
            {APPS.map((app) => {
              const isOpen = os.isOpen(app.id)
              const Icon = app.icon
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  aria-label={`Open ${app.name}`}
                  className="focus-ring hover:bg-surf-0 relative flex size-11 shrink-0 items-center justify-center rounded-lg transition-colors"
                >
                  <span aria-hidden style={{ color: accentColor(app.accent) }}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  {isOpen && (
                    <span
                      aria-hidden
                      className="bg-miku absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full"
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
          <ul className="grid grid-cols-3 gap-3">
            {APPS.map((app) => {
              const Icon = app.icon
              return (
                <li key={app.id} className="flex">
                  <button
                    type="button"
                    onClick={() => openApp(app.id)}
                    aria-label={`Open ${app.name}`}
                    className="focus-ring border-rule bg-surf-0 hover:bg-surf-1 flex flex-1 flex-col items-center gap-2 rounded-xl border px-2 py-4 transition-colors"
                  >
                    <span
                      aria-hidden
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: accentTint(app.accent, 15),
                        color: accentColor(app.accent),
                      }}
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <span className="font-display text-ink text-sm">
                      {app.name}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="border-rule mt-6 border-t pt-5">
            <h3 className={LAUNCHER_HEADING_CLASS}>Elsewhere</h3>
            <ExternalLink
              href={GITHUB_URL}
              onClick={closeLauncher}
              className="focus-ring border-rule bg-surf-0 hover:bg-surf-1 text-ink flex h-11 items-center gap-3 rounded-xl border px-3 text-sm transition-colors"
            >
              <GithubIcon className="text-miku size-[18px]" />
              GitHub profile
            </ExternalLink>
          </div>

          <div className="border-rule mt-6 border-t pt-5">
            <h3 className={LAUNCHER_HEADING_CLASS}>Palette</h3>
            <PalettePicker value={palette} onSelect={onSelectPalette} />
          </div>
        </MobileSheet>
      )}

      {/* Top mobile sheet only — the rest of the window stack waits behind it. */}
      {topSheet &&
        (() => {
          const SheetIcon = windowIconFor(topSheet.id)
          return (
            <MobileSheet
              key={topSheet.id}
              title={topSheet.title}
              icon={<SheetIcon size={16} strokeWidth={1.75} />}
              onClose={closeTopSheet}
              onCopyLink={() => onCopyLink(topSheet.id)}
            >
              <AppBody
                window={topSheet}
                onOpenProject={os.openProject}
                projectTitleLevel={1}
              />
            </MobileSheet>
          )
        })()}
    </>
  )
}
