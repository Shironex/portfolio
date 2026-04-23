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
      <section className="border-rule-2 bg-surf-soft relative mb-8 overflow-hidden rounded-2xl border p-6 md:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-60 blur-3xl"
          style={{ backgroundColor: accent }}
        />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2">
            {project.projectType && (
              <span
                className="rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                {project.projectType}
              </span>
            )}
            {project.featured && (
              <span className="bg-miku/15 text-miku rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase">
                FEATURED
              </span>
            )}
          </div>

          <h1 className="font-display text-ink text-4xl font-bold">
            {project.title}
          </h1>
          <p className="font-body text-ink-2 mt-3 max-w-2xl text-lg">
            {project.summary}
          </p>

          <div className="text-ink-3 mt-4 flex flex-wrap gap-4 font-mono text-xs">
            <span>⏱ {project.duration}</span>
            {completed && <span>📅 {completed}</span>}
            {project.inProgress && (
              <span className="bg-peach/20 text-peach rounded px-2 py-0.5 tracking-widest uppercase">
                in progress
              </span>
            )}
          </div>

          <div className="mt-6 flex gap-2">
            {showDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring bg-miku text-cloud inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition hover:brightness-110"
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
                className="focus-ring bg-surf-0 border-rule-2 text-ink hover:bg-surf-soft inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition"
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
          <h2 className="font-display text-ink mt-8 mb-3 text-lg">overview</h2>
          {project.description.map((paragraph, i) => (
            <p
              key={i}
              className="font-body text-ink-2 mb-3 max-w-2xl leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </section>
      )}

      {/* Features */}
      {project.features.length > 0 && (
        <section>
          <h2 className="font-display text-ink mt-8 mb-3 text-lg">features</h2>
          <ul className="flex flex-col gap-2">
            {project.features.map((feature) => (
              <li
                key={feature}
                className="font-body text-ink-2 flex items-start gap-2"
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
          <h2 className="font-display text-ink mt-8 mb-3 text-lg">
            tech stack
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border px-2.5 py-1 font-mono text-xs"
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
          <h2 className="font-display text-ink mt-8 mb-3 text-lg">gallery</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {project.gallery.map((item) => (
              <div
                key={item.src}
                className="border-rule relative aspect-video overflow-hidden rounded-lg border"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                />
                {item.caption && (
                  <div className="bg-ink/70 text-cloud absolute inset-x-0 bottom-0 px-2 py-1 text-xs">
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
