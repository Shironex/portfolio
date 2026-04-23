/**
 * projects.app window — filterable + searchable grid of all 16 projects.
 * Each card opens the project in its own ShiroOS window via `onOpenProject`,
 * which the app registry wires up on the parent side.
 */

'use client'

import { Fragment, useMemo, useState } from 'react'

import { accentFor } from '@/components/os/accent-map'

import { projectsData } from '@/data/projects-data'

import type { Project } from '@/types'

type Filter = 'all' | 'featured' | 'in-progress' | 'shipped' | 'archived'

interface FilterDef {
  id: Filter
  label: string
}

const FILTERS: FilterDef[] = [
  { id: 'all', label: 'all' },
  { id: 'featured', label: 'featured' },
  { id: 'in-progress', label: 'in-progress' },
  { id: 'shipped', label: 'shipped' },
  { id: 'archived', label: 'archived' },
]

function bucketOf(p: Project): Filter {
  if (p.inProgress) return 'in-progress'
  if (p.featured) return 'featured'
  if (p.completedDate) return 'shipped'
  return 'archived'
}

function matchesFilter(p: Project, filter: Filter): boolean {
  if (filter === 'all') return true
  return bucketOf(p) === filter
}

function matchesQuery(p: Project, q: string): boolean {
  if (!q) return true
  const haystack =
    `${p.title} ${p.summary} ${p.technologies.join(' ')}`.toLowerCase()
  return haystack.includes(q.toLowerCase())
}

interface ProjectsAppProps {
  onOpenProject: (p: Project) => void
}

export default function ProjectsApp({ onOpenProject }: ProjectsAppProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [q, setQ] = useState('')

  const counts = useMemo(() => {
    const acc: Record<Filter, number> = {
      all: projectsData.length,
      featured: 0,
      'in-progress': 0,
      shipped: 0,
      archived: 0,
    }
    for (const p of projectsData) {
      acc[bucketOf(p)]++
    }
    return acc
  }, [])

  const shown = useMemo(
    () =>
      projectsData.filter((p) => matchesFilter(p, filter) && matchesQuery(p, q)),
    [filter, q]
  )

  return (
    <div className="font-body">
      <div className="mb-6">
        <div className="font-mono text-xs text-miku tracking-widest uppercase mb-2">
          # projects.app
        </div>
        <h2 className="font-display text-3xl text-ink font-bold mb-1">
          16{' '}
          <em className="gradient-text-miku not-italic font-bold">projects</em>
        </h2>
        <p className="text-sm text-ink-3">
          pick one — each opens in its own window
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={
                isActive
                  ? 'bg-miku text-cloud rounded-full px-3 py-1 text-xs font-mono'
                  : 'bg-surf-0 text-ink-2 rounded-full px-3 py-1 text-xs font-mono hover:bg-surf-1'
              }
            >
              {f.label}{' '}
              <span className="opacity-60">{counts[f.id]}</span>
            </button>
          )
        })}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search projects…"
          className="ml-auto px-3 py-1.5 rounded-lg border border-rule-2 bg-surf-0 text-sm min-w-[200px] outline-none focus:border-miku"
          aria-label="Search projects"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {shown.length === 0 ? (
          <div className="col-span-full text-center py-12 text-ink-4 font-mono text-sm">
            no matches — try &quot;web&quot; or &quot;cli&quot;
          </div>
        ) : (
          shown.map((p) => {
            const accent = accentFor(p.slug)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProject(p)}
                className="group relative text-left rounded-xl border border-rule-2 bg-surf-1 backdrop-blur-xl p-4 transition-all hover:-translate-y-0.5 hover:border-miku/40 hover:shadow-lg"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex size-10 items-center justify-center rounded-lg font-display text-lg font-bold shrink-0"
                    style={{
                      backgroundColor: `${accent}25`,
                      color: accent,
                    }}
                  >
                    {p.title[0]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 font-display text-sm text-ink">
                      <span className="truncate">{p.title}</span>
                      {p.featured && (
                        <span className="px-1.5 py-0.5 rounded bg-miku/15 text-miku text-[10px] font-mono shrink-0">
                          FEATURED
                        </span>
                      )}
                      {p.inProgress && (
                        <span className="px-1.5 py-0.5 rounded bg-peach/20 text-peach text-[10px] font-mono shrink-0">
                          WIP
                        </span>
                      )}
                    </div>
                    <div className="font-body text-xs text-ink-3 mt-0.5 line-clamp-2">
                      {p.summary}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {p.technologies.slice(0, 4).map((tech, i) => (
                        <Fragment key={tech}>
                          {i > 0 && (
                            <span className="text-ink-4">·</span>
                          )}
                          <span className="text-[10px] font-mono text-ink-4">
                            {tech}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <span className="text-ink-4 group-hover:text-miku transition-colors">
                    →
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
