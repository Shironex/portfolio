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
import { accentFor, accentInk, accentTint } from '@/components/os/accent-map'
import { EYEBROW_CLASS } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'
import { StatusChip } from '@/components/os/status-chip'
import type { HeadingLevel } from '@/components/os/types'

import { cn } from '@/lib/utils'
import { parseMonthYear } from '@/lib/utils/format-date'
import { hasUsableDemo, projectStack } from '@/lib/utils/project-meta'

import type { GalleryItem, Project, ProjectLinkKind } from '@/types'

const HEADING_TAG = { 1: 'h1', 2: 'h2', 3: 'h3' } as const

interface ProjectProps {
  project: Project
  /**
   * Level of the project title: the page `h1` on the static route and in a
   * mobile sheet, `h2` inside a desktop window, where the hero headline of
   * the shell is the `h1`. Section headings sit one level below it.
   */
  titleLevel?: HeadingLevel
}

interface ProjectSectionProps {
  title: string
  titleLevel?: HeadingLevel
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
  'focus-ring bg-surf-0 border-rule-2 text-ink hover:bg-surf-soft inline-flex items-center gap-4 rounded-lg border px-8 py-4 text-sm font-semibold transition'

const LINK_ICON: Record<ProjectLinkKind, LucideIcon> = {
  blog: Newspaper,
  docs: BookOpen,
  npm: Package,
  release: Tag,
  other: LinkIcon,
}

export function ProjectSection({
  title,
  titleLevel = 1,
  children,
}: ProjectSectionProps) {
  const Heading = HEADING_TAG[titleLevel === 1 ? 2 : 3]
  return (
    <section>
      <Heading
        className={cn(EYEBROW_CLASS, 'text-miku-ink mt-16 mb-6 font-bold')}
      >
        {title}
      </Heading>
      {children}
    </section>
  )
}

export function ProjectHero({ project, titleLevel = 1 }: ProjectProps) {
  const Title = HEADING_TAG[titleLevel]
  const accent = accentFor(project.slug)
  // Free text ("Ongoing") is shown as written.
  const completed =
    parseMonthYear(project.completedDate)?.label ?? project.completedDate

  return (
    <section className="border-rule-2 bg-surf-soft relative mb-16 overflow-hidden rounded-2xl border p-12 md:p-16">
      <div className="relative">
        <div className="mb-6 flex items-center gap-4">
          {project.projectType && (
            <StatusChip tone="neutral" size="md" accent={accent}>
              {project.projectType}
            </StatusChip>
          )}
          {project.featured && <StatusChip tone="featured" size="md" />}
        </div>

        <Title className="font-display text-ink text-4xl font-bold">
          {project.title}
        </Title>
        <p className="font-body text-ink-2 mt-6 max-w-2xl text-lg">
          {project.summary}
        </p>

        <div className="text-ink-3 mt-8 flex flex-wrap gap-8 font-mono text-xs">
          <span className="inline-flex items-center gap-3">
            <Clock aria-hidden className="size-7" strokeWidth={1.75} />
            {project.duration}
          </span>
          {completed && (
            <span className="inline-flex items-center gap-3">
              <Calendar aria-hidden className="size-7" strokeWidth={1.75} />
              {completed}
            </span>
          )}
          {project.status !== 'shipped' && (
            <StatusChip tone={project.status} size="md" />
          )}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          {hasUsableDemo(project.demoUrl) && (
            <ExternalLink
              href={project.demoUrl}
              className="focus-ring bg-miku text-cloud hover:bg-miku-2 inline-flex items-center gap-4 rounded-lg px-8 py-4 text-sm font-semibold transition-colors"
            >
              <ExternalLinkIcon aria-hidden className="size-8" />
              demo
            </ExternalLink>
          )}
          {project.githubUrl && (
            <ExternalLink
              href={project.githubUrl}
              className={SECONDARY_LINK_CLASS}
            >
              <GithubIcon className="size-8" />
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
                <Icon aria-hidden className="size-8" />
                {link.label}
              </ExternalLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProjectOverview({ project, titleLevel }: ProjectProps) {
  if (project.description.length === 0) return null
  return (
    <ProjectSection title="overview" titleLevel={titleLevel}>
      {project.description.map((paragraph, i) => (
        <p
          key={i}
          className="font-body text-ink-2 mb-6 max-w-2xl leading-relaxed"
        >
          {paragraph}
        </p>
      ))}
    </ProjectSection>
  )
}

export function ProjectFeatures({ project, titleLevel }: ProjectProps) {
  if (project.features.length === 0) return null
  return (
    <ProjectSection title="features" titleLevel={titleLevel}>
      <ul className="flex flex-col gap-4">
        {project.features.map((feature) => (
          <li
            key={feature}
            className="font-body text-ink-2 flex items-start gap-4"
          >
            <span aria-hidden className="text-miku-ink mt-1">
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </ProjectSection>
  )
}

export function ProjectTechStack({ project, titleLevel }: ProjectProps) {
  const accent = accentFor(project.slug)
  const stack = projectStack(project)
  if (stack.length === 0) return null
  return (
    <ProjectSection title="tech stack" titleLevel={titleLevel}>
      <div className="flex flex-wrap gap-3">
        {stack.map((tech) => (
          <span
            key={tech}
            className="rounded-full border px-5 py-2 font-mono text-xs"
            style={{
              borderColor: accentTint(accent, 25),
              color: accentInk(accent),
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
export function ProjectGallery({
  titleLevel,
  children,
}: {
  titleLevel?: HeadingLevel
  children: ReactNode
}) {
  return (
    <ProjectSection title="gallery" titleLevel={titleLevel}>
      <div className="mt-6 grid grid-cols-2 gap-4">{children}</div>
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
        className="object-cover transition-transform duration-200 ease-out group-hover:scale-105"
      />
      {/* Fixed dark scrim, theme-independent, so the caption stays
          readable over any screenshot in light and dark mode alike. The
          caption is held to one line, which sits in the lower half of the
          scrim: under it the scrim never drops below 60% black, 5.7:1 on a
          white shot. The whole caption is in the tooltip and the lightbox. */}
      {item.caption && (
        <span
          title={item.caption}
          className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/80 via-black/60 to-transparent px-5 pt-12 pb-4 text-left text-[11px] font-medium text-white"
        >
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
export function ProjectSections({
  project,
  titleLevel,
  children,
}: ProjectSectionsProps) {
  return (
    <div className="font-body max-w-3xl">
      <ProjectHero project={project} titleLevel={titleLevel} />
      <ProjectOverview project={project} titleLevel={titleLevel} />
      <ProjectFeatures project={project} titleLevel={titleLevel} />
      <ProjectTechStack project={project} titleLevel={titleLevel} />
      {children}
    </div>
  )
}
