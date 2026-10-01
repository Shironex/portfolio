'use client'

import type { ReactNode } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import {
  Copy,
  Diamond,
  Link,
  Moon,
  Palette,
  Search,
  SquareX,
  Sun,
} from 'lucide-react'

import { GithubIcon } from '@/components/icons/github-icon'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import { PALETTES, type PaletteId } from '@/lib/os/appearance'
import { cn, onBackdropDismiss } from '@/lib/utils'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'
import { pluralWord } from '@/lib/utils/plural'

import { projectsData } from '@/data/projects-data'
import { useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { Theme } from '@/hooks/use-theme'
import type { Project } from '@/types'

import { type AccentRole, accentFor, accentTileStyle } from './accent-map'
import { APPS, COPY_LINK_LABEL, EYEBROW_CLASS } from './constants'
import { Kbd } from './kbd'
import type { AppId } from './types'

interface CmdPaletteProps {
  onClose: () => void
  onLaunch: (appId: AppId) => void
  onOpenProject: (project: Project) => void
  theme: Theme
  onToggleTheme: () => void
  onCloseAll: () => void
  /** Copies a link to the topmost window; absent when nothing is open. */
  onCopyLink?: () => void
  palette: PaletteId
  onSelectPalette: (id: PaletteId) => void
}

interface PaletteItem {
  ic: ReactNode
  accent: AccentRole
  label: string
  hint: string
  onClick: () => void
  search: string
  /**
   * Renders this row's swatch in the named palette instead of the active one.
   * Only the palette rows set it, so ⌘K previews all six colours at once.
   */
  swatchPalette?: PaletteId
}

/**
 * ⌘K command palette overlay. Merges APPS + system actions + projects into a
 * filterable list. Implements the combobox/listbox pattern for arrow-key
 * navigation: focus stays on the input and `aria-activedescendant` points at
 * the selected option, so the options themselves are not tab stops. A modal
 * layer: traps focus, makes everything behind inert, and returns focus to the
 * previously focused element on close.
 */
export function CmdPalette({
  onClose,
  onLaunch,
  onOpenProject,
  theme,
  onToggleTheme,
  onCloseAll,
  onCopyLink,
  palette,
  onSelectPalette,
}: CmdPaletteProps) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useFocusTrap(panelRef, true)
  useEscapeLayer('palette', onClose)

  const items = useMemo<PaletteItem[]>(() => {
    const appItems: PaletteItem[] = APPS.map((app) => {
      const Icon = app.icon
      return {
        ic: <Icon size={14} strokeWidth={1.75} />,
        accent: app.accent,
        label: `Open ${app.name}`,
        hint: 'app',
        onClick: () => {
          onLaunch(app.id)
          onClose()
        },
        search: `${app.name} app`.toLowerCase(),
      }
    })

    const actionItems: PaletteItem[] = [
      {
        ic:
          theme === 'dark' ? (
            <Sun size={14} strokeWidth={1.75} />
          ) : (
            <Moon size={14} strokeWidth={1.75} />
          ),
        accent: 'warm',
        label:
          theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        hint: 'action',
        onClick: () => {
          onToggleTheme()
          onClose()
        },
        search: 'theme dark light mode toggle switch',
      },
      {
        ic: <Copy size={14} strokeWidth={1.75} />,
        accent: 'primary',
        label: 'Copy email address',
        hint: 'action',
        onClick: async () => {
          await copyToClipboard(EMAIL_CONTACT, 'Email copied')
          onClose()
        },
        search: 'copy email address contact mail',
      },
      ...(onCopyLink
        ? [
            {
              ic: <Link size={14} strokeWidth={1.75} />,
              accent: 'primary',
              label: COPY_LINK_LABEL,
              hint: 'action',
              onClick: () => {
                onCopyLink()
                onClose()
              },
              search: 'copy link url share window deep link',
            } satisfies PaletteItem,
          ]
        : []),
      {
        ic: <GithubIcon className="size-3.5" />,
        accent: 'deep',
        label: 'Open GitHub profile',
        hint: 'action',
        onClick: () => {
          window.open(GITHUB_URL, '_blank', 'noopener')
          onClose()
        },
        search: 'github profile source code repositories',
      },
      {
        ic: <SquareX size={14} strokeWidth={1.75} />,
        accent: 'neutral',
        label: 'Close all windows',
        hint: 'action',
        onClick: () => {
          onCloseAll()
          onClose()
        },
        search: 'close all windows clear desktop',
      },
    ]

    const paletteItems: PaletteItem[] = PALETTES.map((p) => ({
      ic: <Palette size={14} strokeWidth={1.75} />,
      accent: 'primary',
      swatchPalette: p.id,
      label: `Palette: ${p.name}`,
      hint: p.id === palette ? 'active' : 'theme',
      onClick: () => {
        onSelectPalette(p.id)
        onClose()
      },
      search: `${p.name} palette theme colour color`.toLowerCase(),
    }))

    const projectItems: PaletteItem[] = projectsData.map((project) => ({
      ic: <Diamond size={14} strokeWidth={1.75} />,
      accent: accentFor(project.slug),
      label: project.title,
      hint: project.projectType ?? 'project',
      onClick: () => {
        onOpenProject(project)
        onClose()
      },
      search: [
        project.title,
        project.projectType ?? 'project',
        project.technologies.join(' '),
        project.summary,
      ]
        .join(' ')
        .toLowerCase(),
    }))

    const all = [...appItems, ...actionItems, ...paletteItems, ...projectItems]
    if (!q) return all
    const needle = q.toLowerCase()
    return all.filter((item) => item.search.includes(needle))
  }, [
    q,
    onLaunch,
    onOpenProject,
    onClose,
    theme,
    onToggleTheme,
    onCloseAll,
    onCopyLink,
    palette,
    onSelectPalette,
  ])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keep the keyboard selection visible: without this, arrowing past the
  // fold moves the active item out of the scrolled listbox.
  useEffect(() => {
    document
      .getElementById(`${listId}-item-${sel}`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [sel, listId])

  // A new query starts at the top of its results.
  const search = (value: string) => {
    setQ(value)
    setSel(0)
  }

  const clearSearch = () => {
    search('')
    inputRef.current?.focus()
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => Math.min(items.length - 1, s + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => Math.max(0, s - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      items[sel]?.onClick()
    }
  }

  return (
    <div
      className="bg-ink/30 z-palette fixed inset-0 flex items-start justify-center pt-[12dvh] backdrop-blur-sm"
      onMouseDown={onBackdropDismiss(onClose)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="border-rule-2 bg-surf-solid shadow-elev-4 font-body animate-cp-in w-[min(620px,92vw)] overflow-hidden rounded-2xl border motion-reduce:animate-none"
      >
        <div className="border-rule flex items-center gap-3 border-b px-4 py-3">
          <Search aria-hidden className="text-ink-3 size-4" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => search(e.target.value)}
            onKeyDown={handleKey}
            placeholder="type a command or project name…"
            aria-label="Search apps and projects"
            aria-autocomplete="list"
            aria-controls={listId}
            aria-activedescendant={
              items[sel] ? `${listId}-item-${sel}` : undefined
            }
            role="combobox"
            aria-expanded="true"
            // No `outline-none` here: as a utility it would beat `.focus-ring`,
            // which already clears the default outline.
            className="focus-ring text-ink placeholder:text-ink-4 flex-1 rounded bg-transparent text-sm"
          />
          <Kbd className="pointer-coarse:hidden">esc</Kbd>
        </div>

        {/* A sibling of the listbox, not a child: a listbox owns only options. */}
        <div
          role="status"
          className={cn(EYEBROW_CLASS, 'text-ink-4 px-4 pt-3.5 pb-1.5')}
        >
          {q
            ? `${items.length} ${pluralWord(items.length, 'result', 'results')}`
            : 'quick actions'}
        </div>
        <div
          id={listId}
          role="listbox"
          aria-label="Results"
          className="max-h-[50dvh] overflow-auto pb-2"
        >
          {items.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              id={`${listId}-item-${i}`}
              type="button"
              role="option"
              tabIndex={-1}
              aria-selected={i === sel}
              onClick={item.onClick}
              onMouseEnter={() => setSel(i)}
              className={cn(
                'focus-ring flex w-full items-center gap-3 px-4 py-2 text-left text-sm',
                i === sel ? 'bg-miku/10' : 'hover:bg-surf-soft'
              )}
            >
              <span
                aria-hidden
                data-palette={item.swatchPalette}
                className="flex size-6 items-center justify-center rounded"
                style={accentTileStyle(item.accent)}
              >
                {item.ic}
              </span>
              <span className="text-ink flex-1">{item.label}</span>
              <span className="text-ink-4 font-mono text-xs">{item.hint}</span>
            </button>
          ))}
        </div>
        {items.length === 0 && (
          <div className="text-ink-3 flex flex-col items-center gap-3 px-6 pt-4 pb-8 text-center font-mono text-xs">
            <p>
              No matches for &ldquo;{q}&rdquo;. Try &ldquo;about&rdquo;,
              &ldquo;automaker&rdquo;, or any tech name.
            </p>
            <button
              type="button"
              onClick={clearSearch}
              className="focus-ring border-rule-2 bg-surf-0 text-ink hover:bg-surf-soft rounded-lg border px-3 py-1.5"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="border-rule bg-surf-soft text-ink-4 flex items-center gap-4 border-t px-4 py-2 font-mono text-[11px] pointer-coarse:hidden">
          <span>
            <Kbd>↑↓</Kbd> navigate
          </span>
          <span>
            <Kbd>⏎</Kbd> select
          </span>
          <span>
            <Kbd>esc</Kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}
