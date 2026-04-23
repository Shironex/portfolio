/**
 * project.detail window — rich detail view for a single project.
 * Sections: hero + overview + features + tech stack + gallery.
 */

'use client'

import Image from 'next/image'

import { ExternalLink, Github } from 'lucide-react'

import { accentFor } from '@/components/os/accent-map'

import type { Project } from '@/types'

interface ProjectDetailAppProps {
  project: Project
}

function formatDate(raw: string | undefined): string | null {
  if (!raw) return null
  // Try parsing ISO-like strings; fall back to the raw value (e.g. "Ongoing").
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return raw
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function hasUsableDemo(demoUrl: string): boolean {
  return (
    demoUrl.length > 0 &&
    demoUrl !== '#desktop-app' &&
    demoUrl !== '#in-development'
  )
}

export default function ProjectDetailApp({ project }: ProjectDetailAppProps) {
  const accent = accentFor(project.slug)
  const completed = formatDate(project.completedDate)
  const stack = Array.from(
    new Set([...project.technologies, ...project.techDetails.stack])
  )

  const showDemo = hasUsableDemo(project.demoUrl)

  return (
    <div className="font-body max-w-3xl">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-rule-2 bg-surf-soft p-6 md:p-8 mb-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-3xl opacity-60"
          style={{ backgroundColor: accent }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            {project.projectType && (
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                {project.projectType}
              </span>
            )}
            {project.featured && (
              <span className="px-2 py-0.5 rounded-full bg-miku/15 text-miku text-[10px] font-mono uppercase tracking-widest">
                FEATURED
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl text-ink font-bold">
            {project.title}
          </h1>
          <p className="font-body text-lg text-ink-2 max-w-2xl mt-3">
            {project.summary}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 font-mono text-xs text-ink-3">
            <span>⏱ {project.duration}</span>
            {completed && <span>📅 {completed}</span>}
            {project.inProgress && (
              <span className="px-2 py-0.5 rounded bg-peach/20 text-peach uppercase tracking-widest">
                in progress
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            {showDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 bg-miku text-cloud rounded-lg px-4 py-2 text-sm font-semibold hover:brightness-110 transition"
              >
                <ExternalLink className="h-4 w-4" />
                demo ↗
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex items-center gap-2 bg-surf-0 border border-rule-2 text-ink rounded-lg px-4 py-2 text-sm font-semibold hover:bg-surf-soft transition"
              >
                <Github className="h-4 w-4" />
                source ↗
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      {project.description.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-ink mt-8 mb-3">overview</h2>
          {project.description.map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-ink-2 leading-relaxed mb-3 max-w-2xl"
            >
              {paragraph}
            </p>
          ))}
        </section>
      )}

      {/* Features */}
      {project.features.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-ink mt-8 mb-3">features</h2>
          <ul className="flex flex-col gap-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 font-body text-ink-2"
              >
                <span className="text-miku mt-0.5">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tech stack */}
      {stack.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-ink mt-8 mb-3">
            tech stack
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full px-2.5 py-1 text-xs font-mono border"
                style={{
                  borderColor: `${accent}40`,
                  color: accent,
                  backgroundColor: `${accent}10`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-ink mt-8 mb-3">gallery</h2>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {project.gallery.map((item) => (
              <div
                key={item.src}
                className="relative aspect-video rounded-lg overflow-hidden border border-rule"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
                {item.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-ink/70 text-cloud text-xs px-2 py-1">
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
