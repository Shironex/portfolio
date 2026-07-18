'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'

import type { Theme } from '@/hooks/use-theme'

import { Clock } from './clock'
import { MenuDropdown, type MenuDropdownSection } from './menu-dropdown'
import type { AppId } from './types'

type DropdownId = 'file' | 'edit' | 'view' | 'go' | 'help'

interface MenuBarProps {
  onOpenCmd: () => void
  onLaunchApp: (id: AppId) => void
  onCloseAll: () => void
  theme: Theme
  onToggleTheme: () => void
}

/**
 * Fixed top menu bar. Three sections: logo (left), menu items (center),
 * theme toggle + clock (right). File/Edit/View/Go/Help all expand into
 * dropdowns.
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
            await navigator.clipboard.writeText(EMAIL_CONTACT).catch(() => null)
            toast.success('Email copied')
          },
        },
        {
          label: 'Copy GitHub URL',
          onClick: async () => {
            await navigator.clipboard.writeText(GITHUB_URL).catch(() => null)
            toast.success('GitHub URL copied')
          },
        },
      ],
    },
  ]

  const goSections: MenuDropdownSection[] = [
    {
      items: [{ label: 'Command palette', kbd: '⌘K', onClick: onOpenCmd }],
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

  return (
    <div className="border-rule bg-surf-1 fixed inset-x-0 top-0 z-[100] flex h-11 items-center gap-3 border-b px-3 backdrop-blur-md">
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
        <MenuDropdown
          label="Go"
          sections={goSections}
          isOpen={openId === 'go'}
          onToggle={toggle('go')}
          onClose={close}
        />
        <MenuDropdown
          label="Help"
          sections={helpSections}
          isOpen={openId === 'help'}
          onToggle={toggle('help')}
          onClose={close}
        />
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
    </div>
  )
}
