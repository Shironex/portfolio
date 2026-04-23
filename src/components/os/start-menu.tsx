'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef } from 'react'

import { Search, X } from 'lucide-react'

import { AUTHOR_NAME, EMAIL_CONTACT } from '@/lib/constants'
import {
  getFeaturedProjects,
  getInProgressProjects,
} from '@/lib/utils/projects'

import { projectsData } from '@/data/projects-data'
import { useFocusTrap } from '@/hooks/use-focus-trap'
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
      className="bg-ink/20 fixed inset-0 z-[450] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Start menu"
        className="border-rule-2 bg-surf-solid/95 shadow-elev-4 animate-cp-in font-body absolute bottom-20 left-4 w-[min(640px,calc(100vw-2rem))] overflow-hidden rounded-2xl border backdrop-blur-xl motion-reduce:animate-none md:left-8"
      >
        <button
          ref={searchRef}
          type="button"
          onClick={() => {
            onOpenCmd()
            onClose()
          }}
          className="focus-ring border-rule bg-surf-soft text-ink-3 hover:bg-surf-1 flex w-full items-center gap-3 border-b px-5 py-3 text-left text-sm transition-colors"
        >
          <Search aria-hidden size={16} />
          <span className="flex-1">Type to search apps &amp; projects…</span>
          <kbd className="border-rule bg-surf-solid rounded border px-1.5 py-0.5 font-mono text-[11px]">
            ⌘K
          </kbd>
        </button>

        <div className="text-ink-4 px-5 pt-4 pb-1 font-mono text-[10px] tracking-widest uppercase">
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
                className="focus-ring border-rule bg-surf-0 hover:bg-surf-1 hover:border-miku/40 flex flex-col items-center justify-center gap-2 rounded-xl border px-3 py-4 text-center transition-colors"
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
                <span className="font-body text-ink text-sm font-medium">
                  {app.name}
                </span>
              </button>
            )
          })}
        </div>

        <div className="text-ink-4 px-5 pt-2 pb-1 font-mono text-[10px] tracking-widest uppercase">
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
              className="focus-ring hover:bg-surf-soft flex w-full items-center gap-3 px-5 py-2 text-left transition-colors"
            >
              <span
                aria-hidden
                className="font-display flex size-8 items-center justify-center rounded-lg text-sm font-bold"
                style={{
                  backgroundColor: accentFor(p.slug) + '25',
                  color: accentFor(p.slug),
                }}
              >
                {p.title[0]}
              </span>
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
          ))}
        </div>

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
