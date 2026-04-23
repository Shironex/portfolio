'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'

import { Menu, Search, X } from 'lucide-react'

import type { OsWindowsApi } from '@/hooks/use-os-windows'

import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
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

  // Only one sheet is ever visible on mobile. Mounting every open window
  // wastes work and creates competing `body.overflow` effects. We pick the
  // topmost non-minimized window by z-order and render just that.
  const topSheet = os.windows
    .filter((w) => !w.minimized)
    .reduce<
      (typeof os.windows)[number] | null
    >((top, w) => (top === null || w.z > top.z ? w : top), null)

  return (
    <>
      {/* Top bar */}
      <div className="border-rule bg-surf-1 fixed inset-x-0 top-0 z-[100] flex h-12 items-center justify-between gap-3 border-b px-4 backdrop-blur-md">
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
        <button
          type="button"
          onClick={() => setLauncherOpen(true)}
          aria-label="Open app launcher"
          className="focus-ring text-ink-2 hover:bg-surf-0 hover:text-ink flex size-11 items-center justify-center rounded-md"
        >
          <Menu aria-hidden size={18} />
        </button>
      </div>

      {/* Feed */}
      <div className="fixed inset-0 overflow-y-auto pt-12 pb-[calc(56px+env(safe-area-inset-bottom)+16px)]">
        <div className="flex flex-col gap-4 px-4 pt-4">
          <HeroPlate onOpenCmd={onOpenCmd} onOpenContact={openContact} />
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
              <div className="font-display text-ink text-lg font-bold">
                Hiring, freelance, or a bug I can help with
              </div>
              <p className="font-body text-ink-2 mt-2 text-sm">
                Open to full-time roles from Q2 2026 and freelance work before
                then. I reply within 24 hours.
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
      </div>

      {/* Bottom dock */}
      <div
        className="border-rule bg-surf-1/95 fixed inset-x-0 bottom-0 z-[200] border-t backdrop-blur-md"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex h-14 items-center gap-2 px-3">
          <button
            type="button"
            onClick={onOpenCmd}
            className="focus-ring bg-surf-0 text-ink-3 flex h-11 flex-1 items-center gap-2 rounded-lg px-3 text-xs"
          >
            <Search aria-hidden size={14} />
            <span className="truncate">search apps &amp; projects…</span>
            <kbd className="border-rule bg-surf-solid/60 ml-auto rounded border px-1.5 py-0.5 font-mono text-[11px]">
              ⌘K
            </kbd>
          </button>
          <div className="flex items-center gap-1">
            {APPS.map((app) => {
              const isOpen = os.isOpen(app.id)
              const Icon = app.icon
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  aria-label={`Open ${app.name}`}
                  className="focus-ring hover:bg-surf-0 relative flex size-11 items-center justify-center rounded-lg transition-colors"
                >
                  <span aria-hidden style={{ color: app.color }}>
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
      </div>

      {/* App launcher sheet */}
      {launcherOpen && (
        <div
          className="bg-surf-solid text-ink animate-sheet-up fixed inset-0 z-[350] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="App launcher"
        >
          <div className="border-rule bg-surf-1 flex h-12 shrink-0 items-center justify-between gap-3 border-b px-4">
            <span className="text-ink-2 font-mono text-xs">launcher</span>
            <button
              type="button"
              onClick={() => setLauncherOpen(false)}
              aria-label="Close launcher"
              className="focus-ring text-ink-3 hover:bg-surf-0 hover:text-ink -mr-1 flex size-11 items-center justify-center rounded-md transition-colors"
            >
              <X aria-hidden size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="grid grid-cols-3 gap-3">
              {APPS.map((app) => {
                const Icon = app.icon
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => openApp(app.id)}
                    aria-label={`Open ${app.name}`}
                    className="focus-ring border-rule bg-surf-0 hover:bg-surf-1 flex flex-col items-center gap-2 rounded-xl border px-2 py-4 transition-colors"
                  >
                    <span
                      aria-hidden
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${app.color}25`,
                        color: app.color,
                      }}
                    >
                      <Icon size={22} strokeWidth={1.75} />
                    </span>
                    <span className="font-display text-ink text-sm">
                      {app.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Top mobile sheet only — the rest of the window stack waits behind it. */}
      {topSheet && (
        <MobileSheet
          key={topSheet.id}
          title={topSheet.title}
          icon={topSheet.icon}
          zIndex={400 + topSheet.z}
          onClose={() => os.close(topSheet.id)}
        >
          <AppBody window={topSheet} onOpenProject={os.openProject} />
        </MobileSheet>
      )}
    </>
  )
}
