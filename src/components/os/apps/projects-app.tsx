/**
 * projects.app window: filterable, searchable grid of every project.
 * Each card opens the project in its own ShiroOS window via `onOpenProject`,
 * which the app registry wires up on the parent side.
 */

'use client'

import { Fragment, useMemo, useState } from 'react'

import { ProjectAvatar } from '@/components/os/project-avatar'
import { StatusChip } from '@/components/os/status-chip'

import { cn } from '@/lib/utils'
import { pluralWord } from '@/lib/utils/plural'
import { countProjects } from '@/lib/utils/projects'

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

/**
 * Featured is a flag that overlaps the lifecycle buckets, so a featured
 * project also counts towards its status (in-progress, shipped, archived).
 */
function matchesFilter(p: Project, filter: Filter): boolean {
  if (filter === 'all') return true
  if (filter === 'featured') return p.featured
  return p.status === filter
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

  const counts = useMemo<Record<Filter, number>>(() => {
    const { total, ...rest } = countProjects(projectsData)
    return { all: total, ...rest }
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
      <div className="mb-12">
        <h2 className="font-display text-ink mb-2 text-3xl font-bold tabular-nums">
          {projectsData.length} projects
        </h2>
        <p className="text-ink-3 text-sm">
          Pick one and it opens in its own window.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={isActive}
              className={cn(
                'focus-ring rounded-full px-6 py-2 font-mono text-xs',
                isActive
                  ? 'bg-miku text-cloud'
                  : 'bg-surf-0 text-ink-2 hover:bg-surf-1'
              )}
            >
              {f.label}{' '}
              <span
                aria-hidden
                className={cn('tabular-nums', !isActive && 'text-ink-3')}
              >
                {counts[f.id]}
              </span>
            </button>
          )
        })}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search projects…"
          className="focus-ring border-rule-2 bg-surf-0 placeholder:text-ink-4 focus:border-miku ml-auto min-w-100 rounded-lg border px-6 py-3 text-sm"
          aria-label="Search projects"
        />
      </div>

      {/* Filtering and searching change the grid without moving focus. */}
      <p role="status" className="sr-only">
        {shown.length} of {projectsData.length}{' '}
        {pluralWord(projectsData.length, 'project', 'projects')} shown
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {shown.length === 0 ? (
          <div className="text-ink-3 col-span-full flex flex-col items-center gap-6 py-24 text-center font-mono text-sm">
            <p>
              {q && filter !== 'all'
                ? `No ${filter} projects match “${q}”.`
                : q
                  ? `No projects match “${q}”.`
                  : `No ${filter} projects yet.`}
            </p>
            <div className="flex gap-4">
              {q && (
                <button
                  type="button"
                  onClick={() => setQ('')}
                  className="focus-ring bg-surf-0 text-ink-2 hover:bg-surf-1 rounded-full px-6 py-2 text-xs"
                >
                  clear search
                </button>
              )}
              {filter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="focus-ring bg-surf-0 text-ink-2 hover:bg-surf-1 rounded-full px-6 py-2 text-xs"
                >
                  show all projects
                </button>
              )}
            </div>
          </div>
        ) : (
          shown.map((p) => {
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpenProject(p)}
                aria-label={`Open ${p.title}`}
                className="focus-ring group border-rule-2 bg-surf-solid hover:border-miku/40 hover:shadow-elev-2 relative rounded-xl border p-8 text-left transition-[translate,border-color,box-shadow] duration-150 hover:-translate-y-1"
              >
                <div className="flex items-start gap-6">
                  <ProjectAvatar slug={p.slug} title={p.title} />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-ink flex items-center gap-3 text-sm">
                      <span className="truncate">{p.title}</span>
                      {p.featured && <StatusChip tone="featured" />}
                      {p.status !== 'shipped' && <StatusChip tone={p.status} />}
                    </div>
                    <div className="font-body text-ink-3 mt-1 line-clamp-2 text-xs">
                      {p.summary}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {p.technologies.slice(0, 4).map((tech, i) => (
                        <Fragment key={tech}>
                          {i > 0 && <span className="text-ink-4">·</span>}
                          <span className="text-ink-4 font-mono text-[11px]">
                            {tech}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <span className="text-ink-4 group-hover:text-miku-ink transition-[translate,color] duration-150 group-hover:translate-x-1">
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
