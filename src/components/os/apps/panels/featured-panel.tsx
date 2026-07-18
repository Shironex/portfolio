'use client'

import { accentFor } from '@/components/os/accent-map'
import { ProjectAvatar } from '@/components/os/project-avatar'

import { getPinnedProjects } from '@/lib/utils/projects'

import { projectsData } from '@/data/projects-data'
import type { Project } from '@/types'

/**
 * FeaturedPanel — pinned-work tile list that sits on the desktop canvas.
 * Ported from new-design/index.html `function FeaturedPanel()`.
 *
 * Pins the top featured projects first, then fills remaining slots with
 * in-progress work (so active efforts like ShiroAni and Shiranami surface
 * alongside shipped favorites). Clicking a tile delegates to
 * `onOpenProject`.
 */
const MAX_PINNED = 4

interface FeaturedPanelProps {
  onOpenProject: (project: Project) => void
}

export function FeaturedPanel({ onOpenProject }: FeaturedPanelProps) {
  const pinned = getPinnedProjects(projectsData, {
    cap: MAX_PINNED,
    order: 'featured-first',
    dedupeBy: 'slug',
  })

  return (
    <div className="border-rule-2 bg-surf-solid overflow-hidden rounded-2xl border">
      <div className="border-rule bg-surf-soft flex items-center gap-3 border-b px-3 py-2">
        <span className="font-display text-ink flex-1 text-sm font-bold">
          Featured work
        </span>
        <span className="text-ink-4 font-mono text-[10px]">
          {pinned.length} pinned
        </span>
      </div>

      <div className="flex flex-col">
        {pinned.map((p) => {
          const accent = accentFor(p.slug)
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => onOpenProject(p)}
              aria-label={`Open ${p.title}`}
              className="focus-ring group border-rule hover:bg-surf-0 relative flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0"
            >
              <ProjectAvatar accent={accent} className="shrink-0">
                {p.title[0]}
              </ProjectAvatar>
              <div className="min-w-0 flex-1">
                <div className="font-display text-ink flex items-center gap-1.5 text-sm">
                  {p.title}
                  <span className="bg-surf-0 text-ink-3 rounded px-1.5 py-0.5 font-mono text-[10px]">
                    {(p.projectType ?? 'project').toUpperCase()}
                  </span>
                </div>
                <div className="font-body text-ink-3 mt-0.5 line-clamp-2 text-xs">
                  {p.summary}
                </div>
              </div>
              <span className="text-ink-4 group-hover:text-miku transition-all group-hover:translate-x-0.5">
                →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
