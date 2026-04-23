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
      projectsData.filter(
        (p) => matchesFilter(p, filter) && matchesQuery(p, q)
      ),
    [filter, q]
  )

  return (
    <div className="font-body">
      <div className="mb-6">
        <h2 className="font-display text-ink mb-1 text-3xl font-bold">
          {projectsData.length} projects
        </h2>
        <p className="text-ink-3 text-sm">
          Pick one — each opens in its own window.
        </p>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={isActive}
              className={`focus-ring rounded-full px-3 py-1 font-mono text-xs ${
                isActive
                  ? 'bg-miku text-cloud'
                  : 'bg-surf-0 text-ink-2 hover:bg-surf-1'
              }`}
            >
              {f.label}{' '}
              <span aria-hidden className="opacity-60">
                {counts[f.id]}
              </span>
            </button>
          )
        })}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search projects…"
          className="focus-ring border-rule-2 bg-surf-0 focus:border-miku ml-auto min-w-[200px] rounded-lg border px-3 py-1.5 text-sm outline-none"
          aria-label="Search projects"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {shown.length === 0 ? (
          <div className="text-ink-3 col-span-full flex flex-col items-center gap-3 py-12 text-center font-mono text-sm">
            <p>
              {q && filter !== 'all'
                ? `No ${filter} projects match “${q}”.`
                : q
                  ? `No projects match “${q}”.`
                  : `No ${filter} projects yet.`}
            </p>
            <div className="flex gap-2">
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="focus-ring bg-surf-0 text-ink-2 hover:bg-surf-1 rounded-full px-3 py-1 text-xs"
                >
                  clear search
                </button>
              )}
              {filter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="focus-ring bg-surf-0 text-ink-2 hover:bg-surf-1 rounded-full px-3 py-1 text-xs"
                >
                  show all projects
                </button>
              )}
            </div>
          </div>
        ) : (
          shown.map((p) => {
            const accent = accentFor(p.slug)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProject(p)}
                aria-label={`Open ${p.title}`}
                className="focus-ring group border-rule-2 bg-surf-solid hover:border-miku/40 hover:shadow-elev-2 relative rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="font-display flex size-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold"
                    style={{
                      backgroundColor: `${accent}25`,
                      color: accent,
                    }}
                  >
                    {p.title[0]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-ink flex items-center gap-1.5 text-sm">
                      <span className="truncate">{p.title}</span>
                      {p.featured && (
                        <span className="bg-miku/15 text-miku shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]">
                          FEATURED
                        </span>
                      )}
                      {p.inProgress && (
                        <span className="bg-peach/20 text-peach shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px]">
                          WIP
                        </span>
                      )}
                    </div>
                    <div className="font-body text-ink-3 mt-0.5 line-clamp-2 text-xs">
                      {p.summary}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {p.technologies.slice(0, 4).map((tech, i) => (
                        <Fragment key={tech}>
                          {i > 0 && <span className="text-ink-4">·</span>}
                          <span className="text-ink-4 font-mono text-[10px]">
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
