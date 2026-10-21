'use client'

import { memo, useCallback, useRef, useState } from 'react'

import { AppLogo } from '@/components/pixel/app-icon'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import type { SkyId } from '@/lib/os/appearance'
import { PREF_COPY, PREF_IDS } from '@/lib/os/prefs'
import { cn } from '@/lib/utils'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'

import { usePrefs } from '@/hooks/use-prefs'
import { type Theme, lampLabel } from '@/hooks/use-theme'

import { Clock } from './clock'
import { CMD_PALETTE_SHORTCUT } from './constants'
import {
  MENU_TRIGGER_ATTRIBUTE,
  MenuDropdown,
  type MenuDropdownSection,
  type MenuFocusEdge,
  type MenuStep,
} from './menu-dropdown'
import { SkyPicker } from './sky-picker'
import type { AppId } from './types'

const MENU_IDS = ['file', 'edit', 'view', 'go', 'help'] as const

type DropdownId = (typeof MENU_IDS)[number]

const MENU_LABELS: Record<DropdownId, string> = {
  file: 'File',
  edit: 'Edit',
  view: 'View',
  go: 'Go',
  help: 'Help',
}

interface MenuBarProps {
  onOpenCmd: () => void
  onLaunchApp: (id: AppId) => void
  onCloseAll: () => void
  theme: Theme
  onToggleTheme: () => void
  sky: SkyId
  onSelectSky: (id: SkyId) => void
}

/**
 * Fixed top menu bar, the page's `<header>`. Three sections: logo (left),
 * menu items (center), Lamp toggle + clock (right). File/Edit/View/Go/Help
 * all expand into dropdowns.
 *
 * The menu items are a `role="menubar"` with a roving tabindex: one tab stop,
 * Left/Right move between the menus (wrapping) and, when a menu is open, open
 * the neighbour instead. The keys inside a menu are in `MenuDropdown`.
 *
 * The View menu holds the Lamp, the sky and the three settings (Pets, Pause
 * animations, Readable text) as checkbox items; the settings come from
 * `usePrefs`, so the bar re-renders when one changes and the shell does not.
 *
 * Memoized: the shell re-renders on every frame of a window drag, and none
 * of that reaches the bar.
 */
function MenuBarImpl({
  onOpenCmd,
  onLaunchApp,
  onCloseAll,
  theme,
  onToggleTheme,
  sky,
  onSelectSky,
}: MenuBarProps) {
  const [open, setOpen] = useState<{
    id: DropdownId
    edge: MenuFocusEdge
  } | null>(null)
  // The one menu in the tab order.
  const [rovingId, setRovingId] = useState<DropdownId>(MENU_IDS[0])
  const barRef = useRef<HTMLDivElement>(null)
  const { prefs, toggle: togglePref } = usePrefs()

  // Closes only the menu that asks, so a menu losing focus to its neighbour
  // does not close the neighbour that just opened.
  const close = useCallback(
    (id: DropdownId) =>
      setOpen((current) => (current?.id === id ? null : current)),
    []
  )

  const openMenu = useCallback(
    (id: DropdownId, edge: MenuFocusEdge) => setOpen({ id, edge }),
    []
  )

  const step = useCallback(
    (from: DropdownId, direction: MenuStep, fromOpenMenu: boolean) => {
      const index =
        (MENU_IDS.indexOf(from) + direction + MENU_IDS.length) % MENU_IDS.length
      const next = MENU_IDS[index]
      setRovingId(next)
      if (fromOpenMenu) {
        setOpen({ id: next, edge: 'first' })
        return
      }
      barRef.current
        ?.querySelectorAll<HTMLElement>(`[${MENU_TRIGGER_ATTRIBUTE}]`)
        [index]?.focus()
    },
    []
  )

  const fileSections: MenuDropdownSection[] = [
    {
      items: [
        { label: 'Open readme', onClick: () => onLaunchApp('readme') },
        { label: 'Open projects', onClick: () => onLaunchApp('projects') },
      ],
    },
    {
      divider: true,
      items: [{ label: 'Close all windows', onClick: onCloseAll }],
    },
  ]

  const editSections: MenuDropdownSection[] = [
    {
      items: [
        {
          label: 'Copy email',
          onClick: () => copyToClipboard(EMAIL_CONTACT, 'Email copied'),
        },
        {
          label: 'Copy GitHub URL',
          onClick: () => copyToClipboard(GITHUB_URL, 'GitHub URL copied'),
        },
      ],
    },
  ]

  const goSections: MenuDropdownSection[] = [
    {
      items: [
        {
          label: 'Command palette',
          kbd: '⌘K',
          keyShortcuts: CMD_PALETTE_SHORTCUT,
          onClick: onOpenCmd,
        },
      ],
    },
    {
      divider: true,
      items: [
        {
          label: 'GitHub profile',
          onClick: () => window.open(GITHUB_URL, '_blank', 'noopener'),
        },
        {
          label: 'Email me',
          onClick: () => {
            window.location.href = `mailto:${EMAIL_CONTACT}`
          },
        },
      ],
    },
  ]

  const viewSections: MenuDropdownSection[] = [
    {
      items: [
        {
          label: lampLabel(theme),
          icon: <PixelIcon name={theme === 'dark' ? 'lamp-off' : 'lamp-on'} />,
          onClick: onToggleTheme,
        },
      ],
    },
    {
      divider: true,
      node: <SkyPicker value={sky} onSelect={onSelectSky} inMenu />,
    },
    {
      // Pets, Pause animations, Readable text: checkbox items.
      divider: true,
      items: PREF_IDS.map((id) => ({
        label: PREF_COPY[id].menu,
        checked: prefs[id],
        onClick: () => togglePref(id),
      })),
    },
    {
      divider: true,
      items: [
        { label: 'Open about.me', onClick: () => onLaunchApp('about') },
        { label: 'Open monitor.sys', onClick: () => onLaunchApp('skills') },
      ],
    },
  ]

  const helpSections: MenuDropdownSection[] = [
    {
      items: [
        { label: 'About ShiroOS', onClick: () => onLaunchApp('readme') },
        {
          // The readme documents the full shortcut set, richer than the old
          // two-item toast.
          label: 'Keyboard shortcuts',
          onClick: () => onLaunchApp('readme'),
        },
      ],
    },
  ]

  const sections: Record<DropdownId, MenuDropdownSection[]> = {
    file: fileSections,
    edit: editSections,
    view: viewSections,
    go: goSections,
    help: helpSections,
  }

  return (
    // The 20 art px bar on the ground navy (22 under a coarse pointer).
    // Night in both Lamp modes.
    <header className="os-night z-chrome fixed inset-x-0 top-0 flex h-20 items-center gap-4 bg-(--ground) px-3 pointer-coarse:h-22">
      {/* The 1 art px teal rule under the bar: a box, since a border width
          is snapped to whole px and would not stay one art px. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 bg-(--select)"
      />
      {/* Left: the 16x16 logo and the wordmark. */}
      <div className="flex items-center gap-3">
        <AppLogo />
        <span className="text-title text-(--lamp)">ShiroOS</span>
      </div>

      {/* Center: menu items */}
      <div
        ref={barRef}
        role="menubar"
        aria-label="ShiroOS"
        className="flex items-center"
      >
        {MENU_IDS.map((id) => (
          <MenuDropdown
            key={id}
            id={id}
            label={MENU_LABELS[id]}
            sections={sections[id]}
            isOpen={open?.id === id}
            focusEdge={open?.edge ?? 'first'}
            tabIndex={rovingId === id ? 0 : -1}
            onOpen={openMenu}
            onClose={close}
            onStep={step}
            onTriggerFocus={setRovingId}
          />
        ))}
      </div>

      {/* Right: the Lamp toggle (the bulb as it is now) and the clock. */}
      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={lampLabel(theme)}
          className={cn(
            'focus-ring flex h-16 w-14 items-center justify-center hover:bg-(--select) pointer-coarse:size-22',
            theme === 'dark' ? 'text-(--meta)' : 'text-(--lamp)'
          )}
        >
          <PixelIcon name={theme === 'dark' ? 'lamp-off' : 'lamp-on'} />
        </button>
        <Clock className="text-(--meta)" />
      </div>
    </header>
  )
}

export const MenuBar = memo(MenuBarImpl)
