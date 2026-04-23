'use client'

import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import type { Theme } from '@/hooks/use-theme'
import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'

import { Clock } from './clock'
import { MenuDropdown, type MenuDropdownSection } from './menu-dropdown'
import type { AppId } from './types'

type DropdownId = 'file' | 'edit' | 'view' | 'help'

interface MenuBarProps {
  onOpenCmd: () => void
  onLaunchApp: (id: AppId) => void
  onCloseAll: () => void
  theme: Theme
  onToggleTheme: () => void
}

/**
 * Fixed top menu bar. Three sections: logo (left), menu items (center),
 * status chips + date + time (right). File/Edit/View/Help expand into
 * dropdowns; Go opens the command palette. Right-side tray hosts a theme
 * toggle before the online chip.
 */
export function MenuBar({
  onOpenCmd,
  onLaunchApp,
  onCloseAll,
  theme,
  onToggleTheme,
}: MenuBarProps) {
  const [openId, setOpenId] = useState<DropdownId | null>(null)

  const toggle = (id: DropdownId) => () =>
    setOpenId((current) => (current === id ? null : id))
  const close = () => setOpenId(null)

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
          onClick: async () => {
            await navigator.clipboard.writeText(EMAIL_CONTACT)
            toast('Email copied')
          },
        },
        {
          label: 'Copy GitHub URL',
          onClick: async () => {
            await navigator.clipboard.writeText(GITHUB_URL)
            toast('GitHub URL copied')
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
            theme === 'dark'
              ? 'Switch to light theme'
              : 'Switch to dark theme',
          icon: theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />,
          onClick: onToggleTheme,
        },
      ],
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
          label: 'Keyboard shortcuts',
          onClick: () =>
            toast('⌘K — command palette · Esc — close window'),
        },
      ],
    },
  ]

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex h-11 items-center gap-3 border-b border-rule bg-surf-1 px-3 backdrop-blur-md">
      {/* Left: logo chip */}
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="size-5 rounded-md"
          style={{
            backgroundImage:
              'linear-gradient(140deg, var(--color-miku) 0%, var(--color-pink) 100%)',
            boxShadow:
              '0 2px 8px -2px color-mix(in oklab, var(--color-miku) 50%, transparent)',
          }}
        />
        <span className="font-display text-sm font-semibold text-ink">
          ShiroOS
        </span>
      </div>

      {/* Center: menu items */}
      <div className="flex items-center gap-0.5">
        <MenuDropdown
          label="File"
          sections={fileSections}
          isOpen={openId === 'file'}
          onToggle={toggle('file')}
          onClose={close}
        />
        <MenuDropdown
          label="Edit"
          sections={editSections}
          isOpen={openId === 'edit'}
          onToggle={toggle('edit')}
          onClose={close}
        />
        <MenuDropdown
          label="View"
          sections={viewSections}
          isOpen={openId === 'view'}
          onToggle={toggle('view')}
          onClose={close}
        />
        <button
          type="button"
          onClick={onOpenCmd}
          aria-label="Open command palette"
          className="focus-ring rounded-md px-2 py-1 font-body text-sm text-ink-2 transition-colors hover:bg-surf-0 hover:text-ink"
        >
          Go
        </button>
        <MenuDropdown
          label="Help"
          sections={helpSections}
          isOpen={openId === 'help'}
          onToggle={toggle('help')}
          onClose={close}
        />
      </div>

      {/* Right: theme toggle + status + date + time */}
      <div className="ml-auto flex items-center gap-4 font-mono text-xs text-ink-3">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
          }
          className="focus-ring rounded p-1 text-ink-3 transition-colors hover:bg-surf-0 hover:text-miku-2"
        >
          {theme === 'dark' ? (
            <Sun aria-hidden size={14} />
          ) : (
            <Moon aria-hidden size={14} />
          )}
        </button>
        <Clock />
      </div>
    </div>
  )
}
