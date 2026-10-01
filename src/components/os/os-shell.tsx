'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'

import type { DeepLinkTarget } from '@/lib/os/deep-link'

import { useDeepLink } from '@/hooks/use-deep-link'
import { useHotkeys } from '@/hooks/use-hotkeys'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useOsWindows } from '@/hooks/use-os-windows'
import { useSessionRestore } from '@/hooks/use-session-restore'
import { useTheme } from '@/hooks/use-theme'

import { Announcer } from './announcer'
import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
import { TerminalPanel } from './apps/panels/terminal-panel'
import { DesktopCanvas } from './desktop-canvas'
import { DesktopIcons } from './desktop-icons'
import { MenuBar } from './menubar'
import { MobileShell } from './mobile-shell'
import {
  NoscriptFallback,
  NoscriptStaticPage,
  SHELL_ROOT_ATTRIBUTE,
} from './noscript-fallback'
import { Taskbar } from './taskbar'
import { Window } from './window'

const Boot = dynamic(() => import('./boot').then((m) => m.Boot), {
  ssr: false,
})
const CmdPalette = dynamic(
  () => import('./cmd-palette').then((m) => m.CmdPalette),
  { ssr: false }
)
const StartMenu = dynamic(
  () => import('./start-menu').then((m) => m.StartMenu),
  { ssr: false }
)

interface OsShellProps {
  initialWindow?: DeepLinkTarget
}

/**
 * Root ShiroOS shell.
 *
 * Owns window state (`useOsWindows`), theme, and palette/start-menu toggles.
 * On desktop the open windows are kept in `sessionStorage`, so a reload in
 * the same tab restores them (`useSessionRestore`).
 * Branches on viewport:
 *   - `>= 768px`: full desktop metaphor (menubar, wallpaper canvas, draggable
 *     windows, taskbar, start menu)
 *   - `< 768px`: vertical feed + bottom dock (`<MobileShell>`), where open
 *     windows render as full-screen sheets instead of draggable Windows
 *
 * The boot splash, cmd palette, and noscript fallback are shared across both
 * modes, and so is the live region that announces keyboard window snaps. Hotkeys stay bound in both (⌘K still works on tablets with a
 * keyboard).
 *
 * `initialWindow` lets a server route boot the shell with a window already
 * open (and the boot splash skipped). Without it the shell falls back to the
 * `?open=` / `?project=` deep-link params. A project route renders the project
 * as static HTML under the shell: there the hero headline steps down to `h2`,
 * and without JavaScript the shell is hidden instead of showing its fallback.
 */
export default function OsShell({ initialWindow }: OsShellProps) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const os = useOsWindows()
  const { theme, palette, toggleTheme, setPalette } = useTheme()
  const isMobile = useIsMobile()
  // Before useDeepLink, so a deep-linked window that was also in the stored
  // session keeps its rect and is raised instead of being opened fresh.
  useSessionRestore(os)
  const { copyLink } = useDeepLink(os, initialWindow)
  // A project route has its own server-rendered article with the page `h1`.
  const onProjectRoute = initialWindow?.kind === 'project'
  const heroHeadingLevel = onProjectRoute ? 2 : 1

  const toggleCmd = useCallback(() => {
    setStartOpen(false)
    setCmdOpen((o) => !o)
  }, [])
  const closeCmd = useCallback(() => setCmdOpen(false), [])
  const openCmd = useCallback(() => setCmdOpen(true), [])
  const openStart = useCallback(() => setStartOpen(true), [])
  const closeStart = useCallback(() => setStartOpen(false), [])
  const openContact = useCallback(() => os.openApp('contact'), [os])
  const { topmostId } = os
  const copyTopmostLink = useMemo(
    () => (topmostId ? () => copyLink(topmostId) : undefined),
    [topmostId, copyLink]
  )

  const handleEscape = useCallback(() => {
    if (cmdOpen) {
      setCmdOpen(false)
      return
    }
    if (startOpen) {
      setStartOpen(false)
      return
    }
    if (os.topmostId) os.close(os.topmostId)
  }, [cmdOpen, startOpen, os])

  useHotkeys({
    'mod+k': toggleCmd,
    escape: handleEscape,
  })

  const openIds = useMemo(() => os.windows.map((w) => w.id), [os.windows])
  const minimizedIds = useMemo(
    () => os.windows.filter((w) => w.minimized).map((w) => w.id),
    [os.windows]
  )

  return (
    // Opaque cream ground for the whole shell. On desktop `DesktopCanvas`
    // paints its richer wallpaper over this, so it's invisible there; on
    // mobile `MobileShell` renders a transparent feed, so this layer is what
    // the user actually sees behind the cards — without it the near-black
    // `body` background and the SSR `StaticHero` bleed through the gaps.
    <div
      {...{ [SHELL_ROOT_ATTRIBUTE]: '' }}
      className="text-ink from-sky-0 via-sky-1 to-sky-2 fixed inset-0 overflow-hidden bg-gradient-to-br"
    >
      {onProjectRoute ? <NoscriptStaticPage /> : <NoscriptFallback />}
      <Boot initialWindow={initialWindow} />
      {isMobile ? (
        <MobileShell
          os={os}
          onOpenCmd={openCmd}
          onCopyLink={copyLink}
          theme={theme}
          onToggleTheme={toggleTheme}
          palette={palette}
          onSelectPalette={setPalette}
          heroHeadingLevel={heroHeadingLevel}
        />
      ) : (
        <>
          <MenuBar
            onOpenCmd={openCmd}
            onLaunchApp={os.openApp}
            onCloseAll={os.closeAll}
            theme={theme}
            onToggleTheme={toggleTheme}
            palette={palette}
            onSelectPalette={setPalette}
          />

          <DesktopCanvas>
            <DesktopIcons onLaunch={os.openApp} />

            <div className="relative flex min-h-screen flex-col px-6 pt-14 pb-24 md:pr-8 md:pl-32 lg:pr-16 lg:pl-36 xl:pr-24 xl:pl-40">
              <div className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
                <HeroPlate
                  onOpenCmd={openCmd}
                  onOpenContact={openContact}
                  headingLevel={heroHeadingLevel}
                />
                <div className="flex flex-col gap-3">
                  <TerminalPanel />
                  <FeaturedPanel onOpenProject={os.openProject} />
                </div>
              </div>
            </div>
          </DesktopCanvas>

          <Announcer>
            {os.windows.map((w) => (
              <Window
                key={w.id}
                window={w}
                isFocused={w.id === os.topmostId}
                onClose={os.close}
                onFocus={os.focus}
                onMove={os.move}
                onMinimize={os.minimize}
                onMaximize={os.toggleMaximize}
                onSnap={os.snap}
                onRestore={os.restore}
                onResize={os.resize}
                onCopyLink={copyLink}
              >
                <AppBody window={w} onOpenProject={os.openProject} />
              </Window>
            ))}
          </Announcer>

          <Taskbar
            openIds={openIds}
            minimizedIds={minimizedIds}
            topmostId={os.topmostId}
            onLaunch={os.openApp}
            onActivate={os.activate}
            onOpenStart={openStart}
            onOpenCmd={openCmd}
          />

          {startOpen && (
            <StartMenu
              onClose={closeStart}
              onLaunch={os.openApp}
              onOpenProject={os.openProject}
              onOpenCmd={openCmd}
            />
          )}
        </>
      )}

      {cmdOpen && (
        <CmdPalette
          onClose={closeCmd}
          onLaunch={os.openApp}
          onOpenProject={os.openProject}
          theme={theme}
          onToggleTheme={toggleTheme}
          onCloseAll={os.closeAll}
          onCopyLink={copyTopmostLink}
          palette={palette}
          onSelectPalette={setPalette}
        />
      )}
    </div>
  )
}
