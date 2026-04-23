'use client'

import { Menu, Search, X } from 'lucide-react'
import { useCallback, useState } from 'react'

import type { OsWindowsApi } from '@/hooks/use-os-windows'

import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
import { NowPlaying } from './apps/panels/now-playing'
import { APPS } from './constants'
import { MobileSheet } from './mobile-sheet'
import type { AppId } from './types'

interface MobileShellProps {
  os: OsWindowsApi
  onOpenCmd: () => void
}

/**
 * Mobile-only layout for ShiroOS (< 768px).
 *
 * Replaces the draggable desktop metaphor with a vertical feed:
 *   - 48px top bar with logo + launcher menu
 *   - hero plate, github activity, featured projects, now-playing
 *   - closing "signal" card that opens the contact sheet
 *   - 56px bottom dock with app icons + ⌘K search pill
 *
 * Open windows (`os.windows`) render as full-screen slide-up sheets stacked
 * by z-index — the same `useOsWindows` state drives both desktop and mobile.
 */
export function MobileShell({ os, onOpenCmd }: MobileShellProps) {
  const [launcherOpen, setLauncherOpen] = useState(false)

  const openApp = useCallback(
    (id: AppId) => {
      os.openApp(id)
      setLauncherOpen(false)
    },
    [os]
  )

  const openContact = useCallback(() => os.openApp('contact'), [os])

  // Render only the topmost non-minimized window as a sheet. The feed
  // keeps rendering underneath; the sheet covers it fully.
  const visibleWindows = os.windows.filter((w) => !w.minimized)

  return (
    <>
      {/* Top bar */}
      <div className="fixed inset-x-0 top-0 z-[100] flex h-12 items-center justify-between gap-3 border-b border-rule bg-surf-1 px-4 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-5 rounded-md"
            style={{
              backgroundImage:
                'linear-gradient(140deg, var(--color-miku) 0%, var(--color-pink) 100%)',
              boxShadow: '0 2px 8px -2px rgba(57,197,187,0.5)',
            }}
          />
          <span className="font-display text-sm font-semibold text-ink">
            ShiroOS
          </span>
        </div>
        <button
          type="button"
          onClick={() => setLauncherOpen(true)}
          aria-label="Open app launcher"
          className="rounded-md p-2 text-ink-2 hover:bg-surf-0 hover:text-ink"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* Feed */}
      <div className="fixed inset-0 overflow-y-auto pt-12 pb-[calc(56px+env(safe-area-inset-bottom)+16px)]">
        <div className="flex flex-col gap-4 px-4 pt-4">
          <HeroPlate onOpenCmd={onOpenCmd} onOpenProjects={() => openApp('projects')} />
          <FeaturedPanel onOpenProject={os.openProject} />
          <NowPlaying />

          <div className="relative overflow-hidden rounded-2xl border border-rule-2 bg-surf-1 p-5 shadow-[0_10px_30px_-10px_rgba(13,27,42,0.18)]">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-12 -right-8 size-40 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, var(--color-pink), transparent 70%)',
              }}
            />
            <div className="relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-miku">
                ✉ send a signal
              </div>
              <div className="mt-1 font-display text-lg font-bold text-ink">
                say hi, talk shop, trade cat photos
              </div>
              <p className="mt-2 font-body text-sm text-ink-2">
                I reply within a day — usually sooner. If you&apos;ve got an
                idea brewing, a bug biting, or a freelance project, drop a
                line.
              </p>
              <button
                type="button"
                onClick={openContact}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-miku to-pink px-4 py-2 text-sm font-semibold text-cloud"
              >
                open contact ✉
              </button>
            </div>
          </div>

          <div className="pt-2 pb-4 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-4">
            ShiroOS v4.2.6 · シロOS
          </div>
        </div>
      </div>

      {/* Bottom dock */}
      <div
        className="fixed inset-x-0 bottom-0 z-[200] border-t border-rule bg-surf-1/95 backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={onOpenCmd}
            className="flex h-9 flex-1 items-center gap-2 rounded-lg bg-surf-0 px-3 text-xs text-ink-3"
            aria-label="Open command palette"
          >
            <Search size={14} />
            <span className="truncate">search apps &amp; projects…</span>
            <kbd className="ml-auto rounded border border-rule bg-surf-solid/60 px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>
          <div className="flex items-center gap-1">
            {APPS.map((app) => {
              const isOpen = os.isOpen(app.id)
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  aria-label={`Open ${app.name}`}
                  className="relative flex size-9 items-center justify-center rounded-lg transition-colors hover:bg-surf-0"
                >
                  <span style={{ color: app.color }}>{app.icon}</span>
                  {isOpen && (
                    <span className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-miku" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* App launcher sheet */}
      {launcherOpen && (
        <div
          className="fixed inset-0 z-[350] flex flex-col bg-surf-solid text-ink animate-sheet-up"
          role="dialog"
          aria-modal="true"
          aria-label="App launcher"
        >
          <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-rule bg-surf-1 px-4">
            <span className="font-mono text-xs text-ink-2">launcher</span>
            <button
              type="button"
              onClick={() => setLauncherOpen(false)}
              aria-label="Close launcher"
              className="-mr-1 rounded-md p-2 text-ink-3 transition-colors hover:bg-surf-0 hover:text-ink"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="grid grid-cols-3 gap-3">
              {APPS.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-rule bg-surf-0 px-2 py-4 transition-colors hover:bg-surf-1"
                >
                  <span
                    className="flex size-12 items-center justify-center rounded-xl text-xl"
                    style={{
                      backgroundColor: `${app.color}25`,
                      color: app.color,
                    }}
                  >
                    {app.icon}
                  </span>
                  <span className="font-display text-sm text-ink">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stacked mobile sheets (one per open window). */}
      {visibleWindows.map((w) => (
        <MobileSheet
          key={w.id}
          title={w.title}
          icon={w.icon}
          zIndex={400 + w.z}
          onClose={() => os.close(w.id)}
        >
          <AppBody window={w} onOpenProject={os.openProject} />
        </MobileSheet>
      ))}
    </>
  )
}
