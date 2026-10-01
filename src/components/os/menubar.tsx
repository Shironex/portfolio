'use client'

import Image from 'next/image'
import { memo, useCallback, useRef, useState } from 'react'

import { Moon, Sun } from 'lucide-react'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import type { PaletteId } from '@/lib/os/appearance'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'

import type { Theme } from '@/hooks/use-theme'

import { Clock } from './clock'
import { CMD_PALETTE_SHORTCUT } from './constants'
import {
  MENU_TRIGGER_ATTRIBUTE,
  MenuDropdown,
  type MenuDropdownSection,
  type MenuFocusEdge,
  type MenuStep,
} from './menu-dropdown'
import { PalettePicker } from './palette-picker'
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
  palette: PaletteId
  onSelectPalette: (id: PaletteId) => void
}

/**
 * Fixed top menu bar, the page's `<header>`. Three sections: logo (left),
 * menu items (center), theme toggle + clock (right). File/Edit/View/Go/Help
 * all expand into dropdowns.
 *
 * The menu items are a `role="menubar"` with a roving tabindex: one tab stop,
 * Left/Right move between the menus (wrapping) and, when a menu is open, open
 * the neighbour instead. The keys inside a menu are in `MenuDropdown`.
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
  palette,
  onSelectPalette,
}: MenuBarProps) {
  const [open, setOpen] = useState<{
    id: DropdownId
    edge: MenuFocusEdge
  } | null>(null)
  // The one menu in the tab order.
  const [rovingId, setRovingId] = useState<DropdownId>(MENU_IDS[0])
  const barRef = useRef<HTMLDivElement>(null)

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
          label:
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
          icon: theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />,
          onClick: onToggleTheme,
        },
      ],
    },
    {
      divider: true,
      node: <PalettePicker value={palette} onSelect={onSelectPalette} inMenu />,
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
          // The readme documents the full shortcut set — richer than the old
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
    <header className="border-rule bg-surf-1 z-chrome fixed inset-x-0 top-0 flex h-11 items-center gap-3 border-b px-3 backdrop-blur-md">
      {/* Left: logo chip */}
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

      {/* Center: menu items */}
      <div
        ref={barRef}
        role="menubar"
        aria-label="ShiroOS"
        className="flex items-center gap-0.5"
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

      {/* Right: theme toggle + status + date + time */}
      <div className="text-ink-3 ml-auto flex items-center gap-4 font-mono text-xs">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
          className="focus-ring text-ink-3 hover:bg-surf-0 hover:text-miku-2 rounded p-1 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun aria-hidden size={14} />
          ) : (
            <Moon aria-hidden size={14} />
          )}
        </button>
        <Clock />
      </div>
    </header>
  )
}

export const MenuBar = memo(MenuBarImpl)
