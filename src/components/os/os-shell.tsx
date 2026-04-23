'use client'

import { useCallback, useMemo, useState } from 'react'

import { useHotkeys } from '@/hooks/use-hotkeys'
import { useIsMobile } from '@/hooks/use-is-mobile'
import { useOsWindows } from '@/hooks/use-os-windows'
import { useTheme } from '@/hooks/use-theme'

import { AppBody } from './app-registry'
import { FeaturedPanel } from './apps/panels/featured-panel'
import { HeroPlate } from './apps/panels/hero-plate'
import { TerminalPanel } from './apps/panels/terminal-panel'
import { Boot } from './boot'
import { CmdPalette } from './cmd-palette'
import { DesktopCanvas } from './desktop-canvas'
import { DesktopIcons } from './desktop-icons'
import { MenuBar } from './menubar'
import { MobileShell } from './mobile-shell'
import { NoscriptFallback } from './noscript-fallback'
import { StartMenu } from './start-menu'
import { Taskbar } from './taskbar'
import { Window } from './window'

/**
 * Root ShiroOS shell.
 *
 * Owns window state (`useOsWindows`), theme, and palette/start-menu toggles.
 * Branches on viewport:
 *   - `>= 768px`: full desktop metaphor (menubar, wallpaper canvas, draggable
 *     windows, taskbar, start menu)
 *   - `< 768px`: vertical feed + bottom dock (`<MobileShell>`), where open
 *     windows render as full-screen sheets instead of draggable Windows
 *
 * The boot splash, cmd palette, and noscript fallback are shared across both
 * modes. Hotkeys stay bound in both (⌘K still works on tablets with a
 * keyboard).
 */
export default function OsShell() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const os = useOsWindows()
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()

  const toggleCmd = useCallback(() => {
    setStartOpen(false)
    setCmdOpen((o) => !o)
  }, [])
  const closeCmd = useCallback(() => setCmdOpen(false), [])
  const openCmd = useCallback(() => setCmdOpen(true), [])
  const openStart = useCallback(() => setStartOpen(true), [])
  const closeStart = useCallback(() => setStartOpen(false), [])
  const openContact = useCallback(() => os.openApp('contact'), [os])

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
    <div className="text-ink fixed inset-0 overflow-hidden">
      <NoscriptFallback />
      <Boot />
      {isMobile ? (
        <MobileShell os={os} onOpenCmd={openCmd} />
      ) : (
        <>
          <MenuBar
            onOpenCmd={openCmd}
            onLaunchApp={os.openApp}
            onCloseAll={os.closeAll}
            theme={theme}
            onToggleTheme={toggleTheme}
          />

          <DesktopCanvas>
            <DesktopIcons onLaunch={os.openApp} />

            <div className="relative flex min-h-screen flex-col px-6 pt-14 pb-24 md:pr-8 md:pl-32 lg:pr-16 lg:pl-36 xl:pr-24 xl:pl-40">
              <div className="grid flex-1 gap-6 md:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)]">
                <HeroPlate onOpenCmd={openCmd} onOpenContact={openContact} />
                <div className="flex flex-col gap-3">
                  <TerminalPanel />
                  <FeaturedPanel onOpenProject={os.openProject} />
                </div>
              </div>
            </div>
          </DesktopCanvas>

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
              onResize={os.resize}
            >
              <AppBody window={w} onOpenProject={os.openProject} />
            </Window>
          ))}

          <Taskbar
            openIds={openIds}
            minimizedIds={minimizedIds}
            onLaunch={os.openApp}
            onRestore={os.toggleMinimize}
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
        />
      )}
    </div>
  )
}
