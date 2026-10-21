/**
 * Presentational pieces of the project detail view. No state and no browser
 * APIs, so the project window (client) and the `/projects/<slug>` page
 * (server) render the same markup from the same data.
 *
 * In pixels (SPEC 1.5): a card 9-slice hero with the project's icon drawn
 * at 2x, pixel buttons for its links (each with its 8x8 glyph beside the
 * label), Departure Mono section headings in the heading colour, chips for
 * the stack and bezelled screenshots.
 */
import Image from 'next/image'
import type { ReactNode } from 'react'

import { buttonVariants } from '@/components/ui/button'

import { accentFor } from '@/components/os/accent-map'
import { PROSE_CLASS } from '@/components/os/constants'
import { ExternalLink } from '@/components/os/external-link'
import { ProjectAvatar } from '@/components/os/project-avatar'
import { StatusChip } from '@/components/os/status-chip'
import type { HeadingLevel } from '@/components/os/types'
import {
  PixelIcon,
  type PixelIconName,
} from '@/components/pixel/pixel-icon.generated'

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

/** The glyph beside each related link's label. */
const LINK_ICON: Record<ProjectLinkKind, PixelIconName> = {
  blog: 'newspaper',
  docs: 'book',
  npm: 'package',
  release: 'tag',
  other: 'link',
}

export function ProjectSection({
  title,
  titleLevel = 1,
  children,
}: ProjectSectionProps) {
  const Heading = HEADING_TAG[titleLevel === 1 ? 2 : 3]
  return (
    <section className="flex flex-col gap-3">
      <Heading className="text-heading lamp-heading">{title}</Heading>
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
    <section className="px-card @container flex flex-col gap-5 p-6">
      <div className="flex flex-col items-start gap-5 @min-[30rem]:flex-row">
        <ProjectAvatar slug={project.slug} title={project.title} scale={2} />
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {project.projectType && (
              <StatusChip tone="neutral" size="md" accent={accent}>
                {project.projectType}
              </StatusChip>
            )}
            {project.featured && <StatusChip tone="featured" size="md" />}
            {project.status !== 'shipped' && (
              <StatusChip tone={project.status} size="md" />
            )}
          </div>
          <Title className="text-display lamp-heading break-words">
            {project.title}
          </Title>
          <p className={PROSE_CLASS}>{project.summary}</p>
        </div>
      </div>

      <div className="text-label flex flex-wrap gap-6 text-(--meta)">
        <span className="inline-flex items-center gap-2">
          <PixelIcon name="clock" />
          {project.duration}
        </span>
        {completed && (
          <span className="inline-flex items-center gap-2">
            <PixelIcon name="calendar" />
            {completed}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {hasUsableDemo(project.demoUrl) && (
          <ExternalLink
            href={project.demoUrl}
            className={buttonVariants({ variant: 'primary' })}
          >
            <PixelIcon name="external" />
            demo
          </ExternalLink>
        )}
        {project.githubUrl && (
          <ExternalLink
            href={project.githubUrl}
            className={buttonVariants({ variant: 'secondary' })}
          >
            <PixelIcon name="github" />
            source
          </ExternalLink>
        )}
        {project.links?.map((link) => (
          <ExternalLink
            key={link.url}
            href={link.url}
            className={buttonVariants({ variant: 'secondary' })}
          >
            <PixelIcon name={LINK_ICON[link.kind]} />
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </section>
  )
}

export function ProjectOverview({ project, titleLevel }: ProjectProps) {
  if (project.description.length === 0) return null
  return (
    <ProjectSection title="overview" titleLevel={titleLevel}>
      {project.description.map((paragraph, i) => (
        <p key={i} className={PROSE_CLASS}>
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
      <ul className="flex max-w-[66ch] flex-col gap-2">
        {project.features.map((feature) => (
          <li
            key={feature}
            className="text-prose flex items-start gap-3 text-(--ink)"
          >
            <PixelIcon
              name="chevron-right"
              className="mt-3 text-(--accent-primary-icon)"
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </ProjectSection>
  )
}

export function ProjectTechStack({ project, titleLevel }: ProjectProps) {
  const stack = projectStack(project)
  if (stack.length === 0) return null
  return (
    <ProjectSection title="tech stack" titleLevel={titleLevel}>
      <ul className="flex flex-wrap gap-2">
        {stack.map((tech) => (
          <li
            key={tech}
            className="os-night px-chip text-label px-2 text-(--ink)"
          >
            {tech}
          </li>
        ))}
      </ul>
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
      <div className="grid grid-cols-2 gap-3">{children}</div>
    </ProjectSection>
  )
}

/**
 * Screenshot and caption filling a gallery cell (`GALLERY_CELL_CLASS`). The
 * caption sits on a solid ground plate, one line, so it reads over any
 * screenshot in both Lamp modes; the whole caption is in the tooltip and
 * the lightbox.
 */
export function GalleryThumb({ item }: GalleryThumbProps) {
  return (
    <>
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(min-width: 768px) 384px, 50vw"
        className="object-cover"
      />
      {item.caption && (
        <span
          title={item.caption}
          className="text-label pointer-events-none absolute inset-x-0 bottom-0 truncate bg-(--ground) px-2 py-1 text-left text-(--ink)"
        >
          {item.caption}
        </span>
      )}
    </>
  )
}

/**
 * Shared class of a gallery cell, whichever element it is: a night well
 * as the screenshot's bezel, with the picture inside its rim.
 */
export const GALLERY_CELL_CLASS =
  'group os-night px-well relative block aspect-video overflow-hidden'

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
    <div className="flex flex-col gap-8">
      <ProjectHero project={project} titleLevel={titleLevel} />
      <ProjectOverview project={project} titleLevel={titleLevel} />
      <ProjectFeatures project={project} titleLevel={titleLevel} />
      <ProjectTechStack project={project} titleLevel={titleLevel} />
      {children}
    </div>
  )
}
