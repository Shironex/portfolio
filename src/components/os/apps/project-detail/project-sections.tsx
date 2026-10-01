/**
 * Presentational pieces of the project detail view. No state and no browser
 * APIs, so the project window (client) and the `/projects/<slug>` page
 * (server) render the same markup from the same data.
 */
import Image from 'next/image'
import type { ReactNode } from 'react'

import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink as ExternalLinkIcon,
  Link as LinkIcon,
  type LucideIcon,
  Newspaper,
  Package,
  Tag,
} from 'lucide-react'

import { GithubIcon } from '@/components/icons/github-icon'
import { accentColor, accentFor, accentTint } from '@/components/os/accent-map'
import { ExternalLink } from '@/components/os/external-link'

import { parseMonthYear } from '@/lib/utils/format-date'
import {
  STATUS_LABEL,
  hasUsableDemo,
  projectStack,
} from '@/lib/utils/project-meta'

import type { GalleryItem, Project, ProjectLinkKind } from '@/types'

interface ProjectProps {
  project: Project
}

interface ProjectSectionProps {
  title: string
  children: ReactNode
}

interface ProjectSectionsProps extends ProjectProps {
  /** The gallery, which differs between the window and the static page. */
  children?: ReactNode
}

interface GalleryThumbProps {
  item: GalleryItem
}

/** Secondary hero link: the source button and every related link. */
const SECONDARY_LINK_CLASS =
  'focus-ring bg-surf-0 border-rule-2 text-ink hover:bg-surf-soft inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition'

const LINK_ICON: Record<ProjectLinkKind, LucideIcon> = {
  blog: Newspaper,
  docs: BookOpen,
  npm: Package,
  release: Tag,
  other: LinkIcon,
}

export function ProjectSection({ title, children }: ProjectSectionProps) {
  return (
    <section>
      <h2 className="text-miku mt-8 mb-3 font-mono text-[11px] font-bold tracking-[0.22em] uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ProjectHero({ project }: ProjectProps) {
  const accent = accentFor(project.slug)
  // Free text ("Ongoing") is shown as written.
  const completed =
    parseMonthYear(project.completedDate)?.label ?? project.completedDate

  return (
    <section className="border-rule-2 bg-surf-soft relative mb-8 overflow-hidden rounded-2xl border p-6 md:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-60 blur-3xl"
        style={{ backgroundColor: accentColor(accent) }}
      />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          {project.projectType && (
            <span
              className="rounded-full px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase"
              style={{
                backgroundColor: accentTint(accent, 13),
                color: accentColor(accent),
              }}
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
          {project.status === 'in-progress' && (
            <span className="bg-peach/20 text-peach rounded px-2 py-0.5 tracking-widest uppercase">
              {STATUS_LABEL[project.status]}
            </span>
          )}
          {project.status === 'archived' && (
            <span className="bg-surf-0 text-ink-3 rounded px-2 py-0.5 tracking-widest uppercase">
              {STATUS_LABEL[project.status]}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {hasUsableDemo(project.demoUrl) && (
            <ExternalLink
              href={project.demoUrl}
              className="focus-ring bg-miku text-cloud inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition hover:brightness-110"
            >
              <ExternalLinkIcon aria-hidden className="h-4 w-4" />
              demo
            </ExternalLink>
          )}
          {project.githubUrl && (
            <ExternalLink
              href={project.githubUrl}
              className={SECONDARY_LINK_CLASS}
            >
              <GithubIcon className="h-4 w-4" />
              source
            </ExternalLink>
          )}
          {project.links?.map((link) => {
            const Icon = LINK_ICON[link.kind]
            return (
              <ExternalLink
                key={link.url}
                href={link.url}
                className={SECONDARY_LINK_CLASS}
              >
                <Icon aria-hidden className="h-4 w-4" />
                {link.label}
              </ExternalLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProjectOverview({ project }: ProjectProps) {
  if (project.description.length === 0) return null
  return (
    <ProjectSection title="overview">
      {project.description.map((paragraph, i) => (
        <p
          key={i}
          className="font-body text-ink-2 mb-3 max-w-2xl leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
    </ProjectSection>
  )
}

export function ProjectFeatures({ project }: ProjectProps) {
  if (project.features.length === 0) return null
  return (
    <ProjectSection title="features">
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
    </ProjectSection>
  )
}

export function ProjectTechStack({ project }: ProjectProps) {
  const accent = accentFor(project.slug)
  const stack = projectStack(project)
  if (stack.length === 0) return null
  return (
    <ProjectSection title="tech stack">
      <div className="flex flex-wrap gap-1.5">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border px-2.5 py-1 font-mono text-xs"
            style={{
              borderColor: accentTint(accent, 25),
              color: accentColor(accent),
              backgroundColor: accentTint(accent, 6),
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </ProjectSection>
  )
}

/** Gallery heading and grid; the caller supplies one cell per screenshot. */
export function ProjectGallery({ children }: { children: ReactNode }) {
  return (
    <ProjectSection title="gallery">
      <div className="mt-3 grid grid-cols-2 gap-2">{children}</div>
    </ProjectSection>
  )
}

/**
 * Screenshot and caption filling a `relative aspect-video` gallery cell. The
 * cell needs the `group` class for the hover zoom.
 */
export function GalleryThumb({ item }: GalleryThumbProps) {
  return (
    <>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 384px, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Fixed dark scrim, theme-independent, so the caption stays
          readable over any screenshot in light and dark mode alike. */}
      {item.caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-2.5 pt-6 pb-2 text-left text-[11px] font-medium text-white">
          {item.caption}
        </span>
      )}
    </>
  )
}

/** Shared class of a gallery cell, whichever element it is. */
export const GALLERY_CELL_CLASS =
  'group border-rule relative aspect-video overflow-hidden rounded-lg border'

/**
 * Everything in the detail view except the gallery, which is passed as
 * `children` because the window makes it interactive and the page does not.
 */
export function ProjectSections({ project, children }: ProjectSectionsProps) {
  return (
    <div className="font-body max-w-3xl">
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectFeatures project={project} />
      <ProjectTechStack project={project} />
      {children}
    </div>
  )
}
