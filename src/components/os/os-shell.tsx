'use client'

import dynamic from 'next/dynamic'
import { useCallback, useMemo, useRef, useState } from 'react'

import type { DeepLinkTarget } from '@/lib/os/deep-link'
import { isEditable } from '@/lib/os/dom'
import { projectWindowId } from '@/lib/os/window-factory'

import { useDeepLink } from '@/hooks/use-deep-link'
import { isLayerOpenAbove, useEscapeLayer } from '@/hooks/use-escape-layer'
import { useHotkeys } from '@/hooks/use-hotkeys'
import { useHydrated } from '@/hooks/use-hydrated'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useOsWindows } from '@/hooks/use-os-windows'
import { useSessionRestore } from '@/hooks/use-session-restore'
import { useStackIds } from '@/hooks/use-stack-ids'
import { useTheme } from '@/hooks/use-theme'
import { useWindowFocus } from '@/hooks/use-window-focus'
import type { Project } from '@/types'

import { AmbientPause } from './ambient-pause'
import { Announcer } from './announcer'
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
  SHELL_READY_ATTRIBUTE,
  SHELL_ROOT_ATTRIBUTE,
} from './noscript-fallback'
import { ShellMain } from './static-layer'
import { Taskbar } from './taskbar'
import type { AppId, WindowId } from './types'
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
 * The server cannot know the viewport, so its HTML carries both shells and
 * CSS shows the one that fits (`md:hidden` / `max-md:hidden`, the breakpoint
 * of `MOBILE_QUERY`): the first paint is right on a phone with no script.
 * Hydration then drops the other shell, so from then on one tree is mounted,
 * with one set of landmarks.
 *
 * Layers, bottom to top (z tokens in globals.css): desktop, windows, chrome
 * (menubar, taskbar, mobile bars), overlay (start menu, mobile sheets),
 * palette, boot. The windows live in one `isolate` container and stack
 * 1..n inside it, so no amount of focusing lifts a window over the chrome.
 * Escape closes only the top open layer (`useEscapeLayer`); a window is the
 * lowest, and is left alone while focus is in a field. ⌘K does nothing while
 * a layer above the palette (lightbox, boot splash) is open.
 *
 * Landmarks: the menubar is the `<header>`, the desktop content the `<main>`,
 * the taskbar the `<nav>`; the mobile shell has its own three.
 *
 * Each `Window` is memoized and gets only stable callbacks, so a drag (which
 * does not touch state until release), a focus change or a re-render of the
 * shell for its own reasons re-renders just the windows whose state changed,
 * and never the app inside one. The desktop panels, the icons and the taskbar
 * are memoized the same way, and the taskbar's id lists keep their identity
 * while the stack does (`useStackIds`). Pausing the wallpaper under an open
 * layer does not go through this component at all (`AmbientPause`).
 *
 * The boot splash, cmd palette, and noscript fallback are shared across both
 * modes, and so is the live region that announces keyboard window snaps. Hotkeys stay bound in both (⌘K still works on tablets with a
 * keyboard).
 *
 * `initialWindow` lets a server route boot the shell with a window already
 * open (and the boot splash skipped). Without it the shell falls back to the
 * `?open=` / `?project=` deep-link params. A project route renders the project
 * as static HTML under the shell: in the server HTML the hero headline steps
 * down to `h2` there and the shell's `main` is a plain `div` (`ShellMain`),
 * and without JavaScript the shell is hidden instead of showing its fallback.
 * Once hydrated the static copy is inert and the hero is the page `h1` on
 * every route, window open or not.
 */
export default function OsShell({ initialWindow }: OsShellProps) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const os = useOsWindows()
  const { theme, palette, toggleTheme, setPalette } = useTheme()
  const isMobile = useIsMobile()
  const hydrated = useHydrated()
  const rootRef = useRef<HTMLDivElement | null>(null)
  // Before useDeepLink, so a deep-linked window that was also in the stored
  // session keeps its rect and is raised instead of being opened fresh.
  useSessionRestore(os)
  const { copyLink } = useDeepLink(os, initialWindow)
  // A project route has its own server-rendered article with the page `h1`,
  // exposed until the shell hydrates and that article goes inert.
  const onProjectRoute = initialWindow?.kind === 'project'
  const heroHeadingLevel = onProjectRoute && !hydrated ? 2 : 1
  const stackIds = useStackIds(os.windows)
  const markUserAction = useWindowFocus(stackIds, os.topmostId, !isMobile)

  const toggleCmd = useCallback(() => {
    // Under a lightbox or the boot splash the palette would mount below what
    // covers it and make that layer inert.
    if (isLayerOpenAbove('palette')) return
    setStartOpen(false)
    setCmdOpen((o) => !o)
  }, [])
  const closeCmd = useCallback(() => setCmdOpen(false), [])
  const openCmd = useCallback(() => setCmdOpen(true), [])
  const openStart = useCallback(() => setStartOpen(true), [])
  const closeStart = useCallback(() => setStartOpen(false), [])
  // What the UI opens and activates is the user's doing, which lets the
  // window take focus; the load paths (session restore, deep link) call `os`
  // directly.
  const { openApp, openProject, activate, close, topmostId } = os
  const withUserAction = useCallback(
    <T,>(run: (target: T) => void, windowIdOf: (target: T) => WindowId) =>
      (target: T) => {
        markUserAction(windowIdOf(target))
        run(target)
      },
    [markUserAction]
  )
  const launchApp = useMemo(
    () => withUserAction(openApp, (id: AppId) => id),
    [withUserAction, openApp]
  )
  const launchProject = useMemo(
    () =>
      withUserAction(openProject, (project: Project) =>
        projectWindowId(project.slug)
      ),
    [withUserAction, openProject]
  )
  const activateWindow = useMemo(
    () => withUserAction(activate, (id: WindowId) => id),
    [withUserAction, activate]
  )
  const openContact = useCallback(() => launchApp('contact'), [launchApp])
  const copyTopmostLink = useMemo(
    () => (topmostId ? () => copyLink(topmostId) : undefined),
    [topmostId, copyLink]
  )

  // The bottom Escape layer. Mobile sheets register their own.
  const closeTopWindow = useCallback(() => {
    // Escape in a field means "leave the field alone", not "close the window".
    if (isEditable(document.activeElement)) return
    if (topmostId) close(topmostId)
  }, [topmostId, close])
  useEscapeLayer('window', closeTopWindow, !isMobile && topmostId !== null)

  useHotkeys(useMemo(() => ({ 'mod+k': toggleCmd }), [toggleCmd]))

  const desktopCovered = os.windows.some((w) => w.maximized && !w.minimized)

  // Until hydration both shells are in the tree, as in the server HTML.
  const showMobile = !hydrated || isMobile
  const showDesktop = !hydrated || !isMobile

  return (
    // Opaque cream ground for the whole shell. On desktop `DesktopCanvas`
    // paints its richer wallpaper over this, so it's invisible there; on
    // mobile `MobileShell` renders a transparent feed, so this layer is what
    // the user actually sees behind the cards — without it the near-black
    // `body` background and the SSR `StaticHero` bleed through the gaps.
    <div
      ref={rootRef}
      {...{
        [SHELL_ROOT_ATTRIBUTE]: '',
        [SHELL_READY_ATTRIBUTE]: hydrated ? '' : undefined,
      }}
      className="text-ink from-sky-0 via-sky-1 to-sky-2 fixed inset-0 overflow-hidden bg-gradient-to-br"
    >
      <AmbientPause rootRef={rootRef} covered={desktopCovered} />
      {onProjectRoute ? <NoscriptStaticPage /> : <NoscriptFallback />}
      <Boot initialWindow={initialWindow} />
      {showMobile && (
        <div className="md:hidden">
          <MobileShell
            os={os}
            onOpenCmd={openCmd}
            onCopyLink={copyLink}
            theme={theme}
            onToggleTheme={toggleTheme}
            palette={palette}
            onSelectPalette={setPalette}
            heroHeadingLevel={heroHeadingLevel}
            overStaticLayer={onProjectRoute}
          />
        </div>
      )}
      {showDesktop && (
        <div className="max-md:hidden">
          <MenuBar
            onOpenCmd={openCmd}
            onLaunchApp={launchApp}
            onCloseAll={os.closeAll}
            theme={theme}
            onToggleTheme={toggleTheme}
            palette={palette}
            onSelectPalette={setPalette}
          />

          <DesktopCanvas>
            <ShellMain overStaticLayer={onProjectRoute}>
              <DesktopIcons onLaunch={launchApp} />

              <div className="relative flex min-h-dvh flex-col px-6 pt-14 pb-24 md:pr-8 md:pl-32 lg:pr-16 lg:pl-36 xl:pr-24 xl:pl-40">
                <div className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
                  <HeroPlate
                    onOpenCmd={openCmd}
                    onOpenContact={openContact}
                    headingLevel={heroHeadingLevel}
                  />
                  <div className="flex flex-col gap-3">
                    <TerminalPanel />
                    <FeaturedPanel onOpenProject={launchProject} />
                  </div>
                </div>
              </div>
            </ShellMain>
          </DesktopCanvas>

          <Announcer>
            {/* The windows layer. Zero-sized, so it never covers the desktop;
                `isolate` keeps every window's z-index inside it. */}
            <div className="z-windows absolute top-0 left-0 isolate size-0">
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
                  onOpenProject={launchProject}
                />
              ))}
            </div>
          </Announcer>

          <Taskbar
            openIds={stackIds.openIds}
            minimizedIds={stackIds.minimizedIds}
            topmostId={os.topmostId}
            onLaunch={launchApp}
            onActivate={activateWindow}
            onOpenStart={openStart}
            onOpenCmd={openCmd}
          />

          {startOpen && (
            <StartMenu
              onClose={closeStart}
              onLaunch={launchApp}
              onOpenProject={launchProject}
              onOpenCmd={openCmd}
            />
          )}
        </div>
      )}

      {cmdOpen && (
        <CmdPalette
          onClose={closeCmd}
          onLaunch={launchApp}
          onOpenProject={launchProject}
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
