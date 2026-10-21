'use client'

import { memo, useId } from 'react'

import { ProjectAvatar } from '@/components/os/project-avatar'
import { StatusChip } from '@/components/os/status-chip'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { PET_PERCH as PERCH } from '@/lib/os/pets'
import { getPinnedProjects } from '@/lib/utils/projects'

import banners from '@/assets/pixel/banners/readme-headers.png'
import { projectsData } from '@/data/projects-data'
import '@/styles/sprites/readme-headers.css'
import type { Project } from '@/types'

/**
 * FeaturedPanel: the pinned work on the desktop (SPEC 1.4), under the README
 * `featured` banner. The banner is the heading's picture: the heading itself
 * is there for assistive tech, visually hidden.
 *
 * Pins the top featured projects first, then fills remaining slots with
 * in-progress work (so active efforts like ShiroAni and Shiranami surface
 * alongside shipped favorites). Each row shows the project's 32x32 icon
 * (its tag plays once on hover and focus) or its letter tile, and opens the
 * project through `onOpenProject`.
 */
const MAX_PINNED = 4

interface FeaturedPanelProps {
  onOpenProject: (project: Project) => void
}

function FeaturedPanelImpl({ onOpenProject }: FeaturedPanelProps) {
  const headingId = useId()
  const pinned = getPinnedProjects(projectsData, {
    cap: MAX_PINNED,
    order: 'featured-first',
    dedupeBy: 'slug',
  })

  return (
    <section
      {...PERCH}
      aria-labelledby={headingId}
      className="px-panel flex flex-col gap-2 p-2"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          aria-hidden
          className="os-night px-readme-headers px-readme-headers-featured ambient-loop block flex-none animate-(--px-loop)"
          style={{ backgroundImage: `url(${banners.src})` }}
        />
        <h2 id={headingId} className="sr-only">
          Featured work
        </h2>
        <span className="text-label pr-2 text-(--meta) tabular-nums">
          {pinned.length} pinned
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {pinned.map((p) => (
          <li key={p.slug}>
            <button
              type="button"
              onClick={() => onOpenProject(p)}
              aria-label={`Open ${p.title}`}
              className="focus-ring group flex w-full items-center gap-3 p-1 text-left hover:bg-(--select)"
            >
              <ProjectAvatar slug={p.slug} title={p.title} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-title truncate text-(--ink)">
                    {p.title}
                  </span>
                  <StatusChip tone="neutral">
                    {p.projectType ?? 'project'}
                  </StatusChip>
                </span>
                <span className="text-body block truncate text-(--meta)">
                  {p.summary}
                </span>
              </span>
              <PixelIcon
                name="arrow-right"
                className="text-(--meta) group-hover:text-(--accent-warm-icon) group-focus-visible:text-(--accent-warm-icon)"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export const FeaturedPanel = memo(FeaturedPanelImpl)
