'use client'

import Image from 'next/image'
import { useEffect, useId, useMemo, useRef } from 'react'

import { Search, X } from 'lucide-react'

import { GithubIcon } from '@/components/icons/github-icon'

import { AUTHOR_NAME, EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'
import { cn, onBackdropDismiss } from '@/lib/utils'
import { getPinnedProjects } from '@/lib/utils/projects'

import { projectsData } from '@/data/projects-data'
import { useEscapeLayer } from '@/hooks/use-escape-layer'
import { useFocusTrap } from '@/hooks/use-focus-trap'
import type { Project } from '@/types'

import { accentColor, accentFor, accentTint } from './accent-map'
import { APPS, CMD_PALETTE_SHORTCUT } from './constants'
import { ExternalLink } from './external-link'
import { Kbd } from './kbd'
import { ProjectAvatar } from './project-avatar'
import type { AppId } from './types'

interface StartMenuProps {
  onClose: () => void
  onLaunch: (appId: AppId) => void
  onOpenProject: (p: Project) => void
  onOpenCmd: () => void
}

/**
 * Windows-11-inspired start menu overlay.
 *
 * Modeled as a dialog (not an ARIA menu) because children include a mix of
 * buttons, links, and static content that don't fit the strict menuitem
 * pattern. A modal layer: traps focus, makes the desktop behind inert,
 * restores focus on close, dismisses on Esc or backdrop.
 */

const SECTION_HEADING_CLASS =
  'text-ink-4 px-5 pb-1 font-mono text-[10px] font-normal tracking-widest uppercase'

export function StartMenu({
  onClose,
  onLaunch,
  onOpenProject,
  onOpenCmd,
}: StartMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLButtonElement>(null)
  const pinnedId = useId()
  const recentId = useId()

  useFocusTrap(panelRef, true)

  const recentProjects = useMemo<Project[]>(
    () =>
      getPinnedProjects(projectsData, {
        cap: 6,
        order: 'in-progress-first',
        dedupeBy: 'id',
      }),
    []
  )

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  useEscapeLayer('start', onClose)

  return (
    <div
      className="bg-ink/20 z-overlay fixed inset-0 backdrop-blur-sm"
      onMouseDown={onBackdropDismiss(onClose)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Start menu"
        className="border-rule-2 bg-surf-solid/95 shadow-elev-4 animate-cp-in font-body absolute bottom-20 left-4 w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-2xl border motion-reduce:animate-none md:left-8"
      >
        <button
          ref={searchRef}
          type="button"
          onClick={() => {
            onOpenCmd()
            onClose()
          }}
          aria-keyshortcuts={CMD_PALETTE_SHORTCUT}
          className="focus-ring border-rule bg-surf-soft text-ink-3 hover:bg-surf-1 flex w-full items-center gap-3 border-b px-5 py-3 text-left text-sm transition-colors"
        >
          <Search aria-hidden size={16} />
          <span className="flex-1">Type to search apps &amp; projects…</span>
          <Kbd>⌘K</Kbd>
        </button>

        <h2 id={pinnedId} className={cn(SECTION_HEADING_CLASS, 'pt-4')}>
          Pinned
        </h2>
        <ul
          aria-labelledby={pinnedId}
          className="grid grid-cols-3 gap-2 p-5 pt-2"
        >
          {APPS.map((app) => {
            const Icon = app.icon
            return (
              <li key={app.id} className="flex">
                <button
                  type="button"
                  aria-label={`Open ${app.name}`}
                  onClick={() => {
                    onLaunch(app.id)
                    onClose()
                  }}
                  className="focus-ring border-rule bg-surf-0 hover:bg-surf-1 hover:border-miku/40 flex flex-1 flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors"
                >
                  <span
                    aria-hidden
                    className="flex size-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: accentTint(app.accent, 15),
                      color: accentColor(app.accent),
                    }}
                  >
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <span className="font-body text-ink text-sm font-medium">
                    {app.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <h2 id={recentId} className={cn(SECTION_HEADING_CLASS, 'pt-2')}>
          Recent
        </h2>
        <ul aria-labelledby={recentId} className="pb-3">
          {recentProjects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => {
                  onOpenProject(p)
                  onClose()
                }}
                className="focus-ring hover:bg-surf-soft flex w-full items-center gap-3 px-5 py-2 text-left transition-colors"
              >
                <ProjectAvatar accent={accentFor(p.slug)} size={8} hidden>
                  {p.title[0]}
                </ProjectAvatar>
                <div className="min-w-0 flex-1">
                  <div className="font-body text-ink truncate text-sm">
                    {p.title}
                  </div>
                  <div className="text-ink-4 truncate font-mono text-[10px]">
                    {p.projectType ?? 'project'} ·{' '}
                    {p.technologies.slice(0, 3).join(' · ')}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>

        <div className="border-rule bg-surf-soft flex items-center gap-3 border-t px-5 py-3">
          <div className="border-rule-2 bg-miku/15 relative size-10 shrink-0 overflow-hidden rounded-full border">
            <Image
              src="/mascot.png"
              alt=""
              width={80}
              height={80}
              className="size-full object-cover object-top"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-ink truncate text-sm">
              {AUTHOR_NAME}
            </div>
            <a
              href={`mailto:${EMAIL_CONTACT}`}
              className="focus-ring text-ink-3 hover:text-miku-2 rounded font-mono text-[10px]"
            >
              {EMAIL_CONTACT}
            </a>
          </div>
          <ExternalLink
            href={GITHUB_URL}
            aria-label="Open GitHub profile"
            onClick={onClose}
            className="focus-ring text-ink-3 hover:bg-rule hover:text-ink rounded p-1"
          >
            <GithubIcon className="size-3.5" />
          </ExternalLink>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close start menu"
            className="focus-ring text-ink-3 hover:bg-rule hover:text-ink rounded p-1"
          >
            <X aria-hidden size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
