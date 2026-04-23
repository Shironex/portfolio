'use client'

import { accentFor } from '@/components/os/accent-map'
import { PanelControls } from '@/components/os/apps/panels/panel-controls'
import { projectsData } from '@/data/projects-data'
import {
  getFeaturedProjects,
  getInProgressProjects,
} from '@/lib/utils/projects'
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
  const featured = getFeaturedProjects(projectsData)
  const inProgress = getInProgressProjects(projectsData)
  const seen = new Set<string>()
  const pinned: Project[] = []
  for (const p of [...featured, ...inProgress]) {
    if (seen.has(p.slug)) continue
    seen.add(p.slug)
    pinned.push(p)
    if (pinned.length >= MAX_PINNED) break
  }

  return (
    <div className="rounded-2xl border border-rule-2 bg-surf-2 backdrop-blur-xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2 border-b border-rule bg-surf-1">
        <span className="flex-1 font-mono text-xs font-bold text-ink">
          featured.work
        </span>
        <span className="font-mono text-[10px] text-ink-4">
          {pinned.length} pinned
        </span>
        <PanelControls />
      </div>

      <div className="flex flex-col">
        {pinned.map((p) => {
          const accent = accentFor(p.slug)
          return (
            <button
              key={p.slug}
              type="button"
              onClick={() => onOpenProject(p)}
              className="group relative flex items-start gap-3 w-full text-left px-4 py-3 border-b border-rule last:border-b-0 transition-colors hover:bg-surf-0"
            >
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
                  {p.title}
                  <span className="px-1.5 py-0.5 rounded bg-surf-0 text-[10px] font-mono text-ink-3">
                    {(p.projectType ?? 'project').toUpperCase()}
                  </span>
                </div>
                <div className="font-body text-xs text-ink-3 mt-0.5 line-clamp-2">
                  {p.summary}
                </div>
              </div>
              <span className="text-ink-4 group-hover:text-miku transition-colors">
                →
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
