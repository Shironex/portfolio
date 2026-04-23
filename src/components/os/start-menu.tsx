'use client'

import { Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useRef } from 'react'

import { useFocusTrap } from '@/hooks/use-focus-trap'

import { projectsData } from '@/data/projects-data'
import { AUTHOR_NAME, EMAIL_CONTACT } from '@/lib/constants'
import {
  getFeaturedProjects,
  getInProgressProjects,
} from '@/lib/utils/projects'
import type { Project } from '@/types'

import { accentFor } from './accent-map'
import { APPS } from './constants'
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
 * pattern. Traps focus, restores it on close, dismisses on Esc or backdrop.
 */
export function StartMenu({
  onClose,
  onLaunch,
  onOpenProject,
  onOpenCmd,
}: StartMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLButtonElement>(null)

  useFocusTrap(panelRef, true)

  const recentProjects = useMemo<Project[]>(() => {
    const featured = getFeaturedProjects(projectsData)
    const inProgress = getInProgressProjects(projectsData)
    const merged: Project[] = []
    const seen = new Set<string>()
    for (const p of [...inProgress, ...featured]) {
      if (seen.has(p.id)) continue
      seen.add(p.id)
      merged.push(p)
      if (merged.length >= 6) break
    }
    return merged
  }, [])

  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[450] bg-ink/20 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Start menu"
        className="absolute bottom-20 left-4 md:left-8 w-[min(640px,calc(100vw-2rem))] rounded-2xl border border-rule-2 bg-surf-solid/95 backdrop-blur-xl shadow-elev-4 overflow-hidden animate-cp-in motion-reduce:animate-none font-body"
      >
        <button
          ref={searchRef}
          type="button"
          onClick={() => {
            onOpenCmd()
            onClose()
          }}
          className="focus-ring flex w-full items-center gap-3 border-b border-rule bg-surf-soft px-5 py-3 text-left text-sm text-ink-3 hover:bg-surf-1 transition-colors"
        >
          <Search aria-hidden size={16} />
          <span className="flex-1">Type to search apps &amp; projects…</span>
          <kbd className="rounded border border-rule bg-surf-solid px-1.5 py-0.5 text-[11px] font-mono">
            ⌘K
          </kbd>
        </button>

        <div className="px-5 pt-4 pb-1 font-mono text-[10px] uppercase tracking-widest text-ink-4">
          Pinned
        </div>
        <div className="grid grid-cols-3 gap-2 p-5 pt-2">
          {APPS.map((app) => {
            const Icon = app.icon
            return (
              <button
                key={app.id}
                type="button"
                aria-label={`Open ${app.name}`}
                onClick={() => {
                  onLaunch(app.id)
                  onClose()
                }}
                className="focus-ring flex flex-col items-center justify-center gap-2 rounded-xl border border-rule bg-surf-0 px-3 py-4 text-center transition-colors hover:bg-surf-1 hover:border-miku/40"
              >
                <span
                  aria-hidden
                  className="flex size-11 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: app.color + '25',
                    color: app.color,
                  }}
                >
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <span className="font-body text-sm font-medium text-ink">
                  {app.name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="px-5 pt-2 pb-1 font-mono text-[10px] uppercase tracking-widest text-ink-4">
          Recent
        </div>
        <div className="pb-3">
          {recentProjects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onOpenProject(p)
                onClose()
              }}
              className="focus-ring flex w-full items-center gap-3 px-5 py-2 text-left transition-colors hover:bg-surf-soft"
            >
              <span
                aria-hidden
                className="flex size-8 items-center justify-center rounded-lg font-display text-sm font-bold"
                style={{
                  backgroundColor: accentFor(p.slug) + '25',
                  color: accentFor(p.slug),
                }}
              >
                {p.title[0]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-body text-sm text-ink truncate">
                  {p.title}
                </div>
                <div className="font-mono text-[10px] text-ink-4 truncate">
                  {p.projectType ?? 'project'} ·{' '}
                  {p.technologies.slice(0, 3).join(' · ')}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 border-t border-rule bg-surf-soft px-5 py-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-rule-2 bg-miku/15">
            <Image
              src="/mascot.png"
              alt=""
              width={80}
              height={80}
              className="size-full object-cover object-top"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-sm text-ink truncate">
              {AUTHOR_NAME}
            </div>
            <a
              href={`mailto:${EMAIL_CONTACT}`}
              className="focus-ring rounded font-mono text-[10px] text-ink-3 hover:text-miku-2"
            >
              {EMAIL_CONTACT}
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close start menu"
            className="focus-ring rounded p-1 text-ink-3 hover:bg-rule hover:text-ink"
          >
            <X aria-hidden size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
