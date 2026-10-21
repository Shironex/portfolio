'use client'

import type { ReactNode } from 'react'
import { useEffect, useId, useMemo, useRef, useState } from 'react'

import { AppIcon, ProjectGlyph } from '@/components/pixel/app-icon'
import { PetOnLedge } from '@/components/pixel/pet-stills'
import {
  PixelIcon,
  type PixelIconName,
} from '@/components/pixel/pixel-icon.generated'

import { EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import { SKIES, type SkyId } from '@/lib/os/appearance'
import { PREF_COPY, PREF_IDS, type PrefId } from '@/lib/os/prefs'
import { cn, onBackdropDismiss } from '@/lib/utils'
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard'
import { pluralWord } from '@/lib/utils/plural'

import { projectsData } from '@/data/projects-data'
import { useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import { type Prefs, usePrefs } from '@/hooks/use-prefs'
import { type Theme, lampLabel } from '@/hooks/use-theme'
import type { Project } from '@/types'

import { type AccentRole, accentIcon } from './accent-map'
import { APPS, COPY_LINK_LABEL } from './constants'
import { Kbd } from './kbd'
import { SkySwatch } from './sky-picker'
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
  sky: SkyId
  onSelectSky: (id: SkyId) => void
}

interface PaletteItem {
  /** What fills the 16x16 icon slot of the row. */
  ic: ReactNode
  label: string
  hint: string
  onClick: () => void
  search: string
}

/** An action's glyph in the 16x16 slot, in its accent's icon colour. */
function actionIcon(name: PixelIconName, accent: AccentRole): ReactNode {
  return (
    <span
      className="flex size-16 items-center justify-center"
      style={{ color: accentIcon(accent) }}
    >
      <PixelIcon name={name} />
    </span>
  )
}

/** The glyph and accent of a setting's action, by what it does next. */
function prefIcon(id: PrefId, prefs: Prefs): ReactNode {
  if (id === 'pets') return actionIcon('paw', 'bright')
  if (id === 'motion') {
    return actionIcon(prefs.motion ? 'play' : 'pause', 'primary')
  }
  return actionIcon('book', 'deep')
}

/**
 * A sky's 12x8 art px thumbnail in the 16x16 slot, so ⌘K previews every sky
 * at once. A 1 art px navy outline keeps the day sky off a paper row.
 */
function skyIcon(swatch: string): ReactNode {
  return (
    <span className="flex size-16 items-center justify-center">
      <SkySwatch swatch={swatch} />
    </span>
  )
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
  sky,
  onSelectSky,
}: CmdPaletteProps) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const { prefs, toggle: togglePref } = usePrefs()

  useFocusTrap(panelRef, true)
  useEscapeLayer('palette', onClose)

  const items = useMemo<PaletteItem[]>(() => {
    const appItems: PaletteItem[] = APPS.map((app) => ({
      ic: <AppIcon id={app.id} />,
      label: `Open ${app.name}`,
      hint: 'app',
      onClick: () => {
        onLaunch(app.id)
        onClose()
      },
      search: `${app.name} app`.toLowerCase(),
    }))

    const actionItems: PaletteItem[] = [
      {
        ic: actionIcon(theme === 'dark' ? 'lamp-off' : 'lamp-on', 'warm'),
        label: lampLabel(theme),
        hint: 'action',
        onClick: () => {
          onToggleTheme()
          onClose()
        },
        search: 'lamp theme night paper dark light mode toggle switch',
      },
      {
        ic: actionIcon('copy', 'primary'),
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
              ic: actionIcon('link', 'primary'),
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
        ic: actionIcon('github', 'deep'),
        label: 'Open GitHub profile',
        hint: 'action',
        onClick: () => {
          window.open(GITHUB_URL, '_blank', 'noopener')
          onClose()
        },
        search: 'github profile source code repositories',
      },
      {
        ic: actionIcon('close', 'neutral'),
        label: 'Close all windows',
        hint: 'action',
        onClick: () => {
          onCloseAll()
          onClose()
        },
        search: 'close all windows clear desktop',
      },
      // The View settings, each named by what it does now ("Hide pets").
      ...PREF_IDS.map((id): PaletteItem => {
        const label = PREF_COPY[id].action[prefs[id] ? 0 : 1]
        return {
          ic: prefIcon(id, prefs),
          label,
          hint: 'setting',
          onClick: () => {
            togglePref(id)
            onClose()
          },
          search: `${label} ${PREF_COPY[id].search}`.toLowerCase(),
        }
      }),
    ]

    const skyItems: PaletteItem[] = SKIES.map((s) => ({
      ic: skyIcon(s.swatch),
      label: `Sky: ${s.name}`,
      hint: s.id === sky ? 'active' : 'sky',
      onClick: () => {
        onSelectSky(s.id)
        onClose()
      },
      search: `${s.name} sky wallpaper theme`.toLowerCase(),
    }))

    const projectItems: PaletteItem[] = projectsData.map((project) => ({
      ic: <ProjectGlyph slug={project.slug} />,
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

    const all = [...appItems, ...actionItems, ...skyItems, ...projectItems]
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
    sky,
    onSelectSky,
    prefs,
    togglePref,
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
    // The 50% navy dither scrim; the panel centred in a row that is a whole
    // even number of art px wide, so it lands on an art pixel.
    <div
      className="px-tile-shadow z-palette fixed inset-0"
      onMouseDown={onBackdropDismiss(onClose)}
    >
      {/* Click-through, so a press beside the panel lands on the scrim. */}
      <div className="pointer-events-none flex w-[round(down,100%,calc(2*var(--px)))] justify-center pt-[round(12dvh,var(--px))]">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="px-window-focused font-body animate-cp-in pointer-events-auto flex w-[min(calc(310*var(--px)),round(down,92vw,calc(2*var(--px))))] flex-col motion-reduce:animate-none"
        >
          {/* The input is a well, night in both Lamp modes, with a lamp
              block caret. */}
          <div className="p-3">
            <div className="os-night px-well flex h-18 items-center gap-2 px-2">
              <PixelIcon name="search" className="text-(--meta)" />
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
                // No `outline-none` here: as a utility it would beat
                // `.focus-ring`, which already clears the default outline.
                className="focus-ring text-body min-w-0 flex-1 bg-transparent text-(--ink) caret-(--lamp) [caret-shape:block] placeholder:text-(--meta)"
              />
              <Kbd className="pointer-coarse:hidden">esc</Kbd>
            </div>
          </div>

          {/* A sibling of the listbox, not a child: a listbox owns only
              options. */}
          <div
            role="status"
            className="text-label px-4 pb-1 text-(--meta) uppercase"
          >
            {q
              ? `${items.length} ${pluralWord(items.length, 'result', 'results')}`
              : 'quick actions'}
          </div>
          <div
            id={listId}
            role="listbox"
            aria-label="Results"
            className="max-h-[50dvh] overflow-auto px-1 pb-2"
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
                  'focus-ring text-body flex h-18 w-full items-center gap-2 px-1 text-left text-(--ink)',
                  i === sel && 'bg-(--select)'
                )}
              >
                {/* The lamp marker of the selected row. */}
                <PixelIcon
                  name="chevron-right"
                  className={cn(
                    'text-(--heading)',
                    i === sel ? 'visible' : 'invisible'
                  )}
                />
                <span aria-hidden className="flex">
                  {item.ic}
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {/* Meta is under 4.5:1 on the night selection teal. */}
                <span
                  className={cn(
                    'text-label',
                    i === sel ? 'text-(--ink)' : 'text-(--meta)'
                  )}
                >
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-label flex flex-col items-center gap-4 px-6 pt-2 pb-8 text-center text-(--meta)">
              <PetOnLedge />
              <p>
                No matches for &ldquo;{q}&rdquo;. Try &ldquo;about&rdquo;,
                &ldquo;automaker&rdquo;, or any tech name.
              </p>
              <button
                type="button"
                onClick={clearSearch}
                className="os-night focus-ring px-button-secondary text-body px-4 text-(--ink)"
              >
                Clear search
              </button>
            </div>
          )}

          <div aria-hidden className="rule-dotted mx-3 pointer-coarse:hidden" />
          <div className="text-label flex items-center gap-6 px-4 py-2 text-(--meta) pointer-coarse:hidden">
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
    </div>
  )
}
