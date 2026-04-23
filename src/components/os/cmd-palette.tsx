'use client'

import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { projectsData } from '@/data/projects-data'
import type { Project } from '@/types'

import { APPS } from './constants'
import type { AppId } from './types'

interface CmdPaletteProps {
  onClose: () => void
  onLaunch: (appId: AppId) => void
  onOpenProject: (project: Project) => void
}

interface PaletteItem {
  ic: string
  color: string
  label: string
  hint: string
  onClick: () => void
  search: string
}

/**
 * ⌘K command palette overlay. Merges APPS + projects into a filterable list.
 * Ported from new-design/index.html `function CmdPalette()`.
 */
export function CmdPalette({
  onClose,
  onLaunch,
  onOpenProject,
}: CmdPaletteProps) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const items = useMemo<PaletteItem[]>(() => {
    const appItems: PaletteItem[] = APPS.map((app) => ({
      ic: app.icon,
      color: app.color,
      label: `Open ${app.name}`,
      hint: 'app',
      onClick: () => {
        onLaunch(app.id)
        onClose()
      },
      search: `${app.name} app`.toLowerCase(),
    }))

    const projectItems: PaletteItem[] = projectsData.map((project) => ({
      ic: '◆',
      color: '#39c5bb',
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

    const all = [...appItems, ...projectItems]
    if (!q) return all
    const needle = q.toLowerCase()
    return all.filter((item) => item.search.includes(needle))
  }, [q, onLaunch, onOpenProject, onClose])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setSel(0)
  }, [q])

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
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-[500] flex items-start justify-center pt-[12vh] bg-ink/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-[min(620px,92vw)] rounded-2xl border border-rule-2 bg-surf-solid shadow-[0_40px_80px_-20px_rgba(13,27,42,0.3)] overflow-hidden font-body animate-cp-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-rule">
          <Search className="size-4 text-ink-3" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleKey}
            placeholder="type a command or project name…"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-4 text-sm outline-none"
          />
          <kbd className="px-1.5 py-0.5 rounded border border-rule bg-surf-soft text-[10px] font-mono text-ink-3">
            esc
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-auto py-2">
          <div className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-4">
            {q ? 'results' : 'quick actions'}
          </div>
          {items.map((item, i) => (
            <button
              key={`${item.label}-${i}`}
              type="button"
              onClick={item.onClick}
              onMouseEnter={() => setSel(i)}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm ${
                i === sel ? 'bg-miku/10' : 'hover:bg-surf-soft'
              }`}
            >
              <span
                className="size-6 flex items-center justify-center rounded"
                style={{
                  backgroundColor: `${item.color}20`,
                  color: item.color,
                }}
              >
                {item.ic}
              </span>
              <span className="flex-1 text-ink">{item.label}</span>
              <span className="font-mono text-[10px] text-ink-4">
                {item.hint}
              </span>
            </button>
          ))}
          {items.length === 0 && (
            <div className="px-6 py-8 text-center font-mono text-xs text-ink-4">
              no matches. try &quot;about&quot; or &quot;automaker&quot;.
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-rule bg-surf-soft px-4 py-2 font-mono text-[10px] text-ink-4">
          <span>
            <kbd className="rounded border border-rule px-1 bg-surf-solid/80">
              ↑↓
            </kbd>{' '}
            navigate
          </span>
          <span>
            <kbd className="rounded border border-rule px-1 bg-surf-solid/80">
              ⏎
            </kbd>{' '}
            select
          </span>
          <span>
            <kbd className="rounded border border-rule px-1 bg-surf-solid/80">
              esc
            </kbd>{' '}
            close
          </span>
        </div>
      </div>
    </div>
  )
}
