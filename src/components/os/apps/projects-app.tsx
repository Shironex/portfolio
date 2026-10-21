/**
 * projects.app window: filterable, searchable grid of every project.
 * Each card opens the project in its own ShiroOS window via `onOpenProject`,
 * which the app registry wires up on the parent side.
 *
 * In pixels (SPEC 1.5): the filters are pixel toggles whose pressed state
 * is the inset bevel plus a lamp pip, the search is a field well, and each
 * project is a card 9-slice with its 32x32 icon (or letter tile), its name
 * and description beside it, and its stack in Departure Mono.
 */

'use client'

import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { ProjectAvatar } from '@/components/os/project-avatar'
import { StatusChip } from '@/components/os/status-chip'
import { PetOnLedge } from '@/components/pixel/pet-stills'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

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

/** How many technologies a card names. */
const CARD_TECH = 4

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
    <div className="@container flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-display lamp-heading tabular-nums">
          {projectsData.length} projects
        </h2>
        <p className="text-prose text-(--ink)">
          Pick one and it opens in its own window.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={isActive}
                className="os-night focus-ring px-button-secondary text-label flex h-14 items-center gap-2 px-3 text-(--ink) pointer-coarse:h-(--target)"
              >
                {/* The lamp pip tells a pressed toggle from a well. */}
                <span
                  aria-hidden
                  className={cn(
                    'block size-2 flex-none',
                    isActive ? 'bg-(--lamp)' : 'bg-(--frame-dim)'
                  )}
                />
                {f.label}
                <span
                  aria-hidden
                  className={cn(
                    'tabular-nums',
                    isActive ? 'text-(--lamp)' : 'text-(--meta)'
                  )}
                >
                  {counts[f.id]}
                </span>
              </button>
            )
          })}
        </div>
        <label className="relative ml-auto block w-full @min-[40rem]:w-120">
          <PixelIcon
            name="search"
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--meta)"
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="search projects…"
            aria-label="Search projects"
            className="pl-14"
          />
        </label>
      </div>

      {/* Filtering and searching change the grid without moving focus. */}
      <p role="status" className="sr-only">
        {shown.length} of {projectsData.length}{' '}
        {pluralWord(projectsData.length, 'project', 'projects')} shown
      </p>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <PetOnLedge />
          <p className="text-prose text-(--ink)">
            {q && filter !== 'all'
              ? `No ${filter} projects match “${q}”.`
              : q
                ? `No projects match “${q}”.`
                : `No ${filter} projects yet.`}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {q && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setQ('')}
              >
                clear search
              </Button>
            )}
            {filter !== 'all' && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setFilter('all')}
              >
                show all projects
              </Button>
            )}
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 @min-[40rem]:grid-cols-2">
          {shown.map((p) => (
            <li key={p.id} className="flex">
              <button
                type="button"
                onClick={() => onOpenProject(p)}
                aria-label={`Open ${p.title}`}
                className="focus-ring group px-card flex w-full min-w-0 items-start gap-4 p-3 text-left"
              >
                <ProjectAvatar slug={p.slug} title={p.title} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-title truncate text-(--ink) group-hover:text-(--heading)">
                      {p.title}
                    </span>
                    {p.featured && <StatusChip tone="featured" />}
                    {p.status !== 'shipped' && <StatusChip tone={p.status} />}
                  </span>
                  <span className="text-prose line-clamp-2 text-(--meta)">
                    {p.summary}
                  </span>
                  <span className="text-label truncate text-(--meta)">
                    {p.technologies.slice(0, CARD_TECH).join(' · ')}
                  </span>
                </span>
                <PixelIcon
                  name="arrow-right"
                  className="mt-1 text-(--meta) group-hover:text-(--heading) group-focus-visible:text-(--heading)"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
