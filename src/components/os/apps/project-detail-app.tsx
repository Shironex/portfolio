/**
 * project.detail window — rich detail view for a single project.
 * Sections: hero + overview + features + tech stack + gallery.
 */

'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Calendar, Clock, ExternalLink, Maximize2, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { GithubIcon } from '@/components/icons/github-icon'
import { accentFor } from '@/components/os/accent-map'

import { onBackdropDismiss } from '@/lib/utils'
import { formatDate } from '@/lib/utils/format-date'

import { useFocusTrap } from '@/hooks/use-focus-trap'
import { useScrollLock } from '@/hooks/use-scroll-lock'
import type { GalleryItem, Project } from '@/types'

interface ProjectDetailAppProps {
  project: Project
}

interface GalleryLightboxProps {
  item: GalleryItem
  onClose: () => void
}

/**
 * Full-screen viewer for a gallery screenshot. Portals to <body> so it
 * escapes the window's stacking context and covers the whole desktop.
 * Escape is intercepted in the capture phase — otherwise the shell's global
 * Escape handler would close the project window underneath at the same time.
 */
function GalleryLightbox({ item, onClose }: GalleryLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useScrollLock(true)
  useFocusTrap(panelRef, true)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopImmediatePropagation()
      onClose()
    }
    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true })
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm md:p-10"
      onMouseDown={onBackdropDismiss(onClose)}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        className="animate-cp-in relative flex max-h-full max-w-5xl flex-col items-center motion-reduce:animate-none"
      >
        <Image
          src={item.src}
          alt={item.alt}
          width={1920}
          height={1080}
          sizes="90vw"
          className="shadow-elev-4 max-h-[80vh] w-auto rounded-xl object-contain"
        />
        {item.caption && (
          <p className="font-body text-cloud mt-3 max-w-2xl text-center text-sm">
            {item.caption}
          </p>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close image view"
          className="focus-ring bg-surf-solid text-ink hover:bg-surf-soft shadow-elev-2 absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full transition-colors"
        >
          <X aria-hidden size={16} />
        </button>
      </div>
    </div>,
    document.body
  )
}

function hasUsableDemo(demoUrl: string): boolean {
  return (
    demoUrl.length > 0 &&
    demoUrl !== '#desktop-app' &&
    demoUrl !== '#in-development'
  )
}

export default function ProjectDetailApp({ project }: ProjectDetailAppProps) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)
  const accent = accentFor(project.slug)
  const completed = formatDate(project.completedDate, {
    locale: 'en-US',
    format: { month: 'short', year: 'numeric' },
    fallbackToRaw: true,
  })
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
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden className="size-3.5" strokeWidth={1.75} />
              {project.duration}
            </span>
            {completed && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar aria-hidden className="size-3.5" strokeWidth={1.75} />
                {completed}
              </span>
            )}
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
                demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring bg-surf-0 border-rule-2 text-ink hover:bg-surf-soft inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition"
              >
                <GithubIcon className="h-4 w-4" />
                source
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Overview */}
      {project.description.length > 0 && (
        <section>
          <h2 className="text-miku mt-8 mb-3 font-mono text-[11px] font-bold tracking-[0.22em] uppercase">
            overview
          </h2>
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
          <h2 className="text-miku mt-8 mb-3 font-mono text-[11px] font-bold tracking-[0.22em] uppercase">
            features
          </h2>
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
          <h2 className="text-miku mt-8 mb-3 font-mono text-[11px] font-bold tracking-[0.22em] uppercase">
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
          <h2 className="text-miku mt-8 mb-3 font-mono text-[11px] font-bold tracking-[0.22em] uppercase">
            gallery
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {project.gallery.map((item) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setLightbox(item)}
                aria-label={`View full size: ${item.alt}`}
                className="focus-ring group border-rule relative aspect-video cursor-zoom-in overflow-hidden rounded-lg border"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-md bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Maximize2 size={14} />
                </span>
                {/* Fixed dark scrim — theme-independent, so the caption stays
                    readable over any screenshot in light and dark mode alike. */}
                {item.caption && (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2.5 pt-6 pb-2 text-left text-[11px] font-medium text-white">
                    {item.caption}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {lightbox && (
        <GalleryLightbox item={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  )
}
