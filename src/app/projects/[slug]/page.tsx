import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import {
  GALLERY_CELL_CLASS,
  GalleryThumb,
  ProjectGallery,
  ProjectSections,
} from '@/components/os/apps/project-detail/project-sections'
import { INLINE_LINK_CLASS } from '@/components/os/constants'
import OsShell from '@/components/os/os-shell'
import { StaticLayer } from '@/components/os/static-layer'
import { WallpaperStatic } from '@/components/os/wallpaper/wallpaper-static'

import { AUTHOR_FULL_NAME } from '@/lib/constants'
import {
  projectJsonLd,
  projectMetadata,
  serializeJsonLd,
} from '@/lib/metadata-config'
import {
  type ProjectRouteProps,
  findProjectBySlug,
  projectStaticParams,
} from '@/lib/utils/projects'

import type { Project } from '@/types'

/**
 * This route blocks on `params` by design (see `ProjectPage`), so opt out of
 * the instant-navigation check that would flag it in development.
 */
export const instant = false

export const generateStaticParams = projectStaticParams

export async function generateMetadata({
  params,
}: ProjectRouteProps): Promise<Metadata> {
  const { slug } = await params
  const project = findProjectBySlug(slug)
  if (project) return projectMetadata(project)
  // An unknown slug renders the 404 screen; keep the root `index, follow`
  // from sitting next to the noindex tag that comes with it, and the home
  // canonical from claiming a URL that does not exist.
  return { robots: { index: false }, alternates: { canonical: null } }
}

/**
 * The project as plain server-rendered HTML: what crawlers, link previews and
 * no-JS visitors read. It reuses the sections of the project window, so the
 * two cannot drift apart. The shell is server-rendered too and sits on top of
 * this, opaque: without JavaScript a `<noscript>` rule hides it and this is
 * the page; with it, the shell opens the same project in a window and
 * `StaticLayer` takes this copy out of the accessibility tree.
 *
 * It wears the pixel look with no script at all: the wallpaper's static
 * frame behind (wide screens only, as on the desktop), and a window frame
 * whose title bar is only a picture: it has no controls to offer here.
 */
function StaticProject({ project }: { project: Project }) {
  return (
    <StaticLayer
      className="fixed inset-0 isolate overflow-y-auto bg-(--ground) text-(--ink)"
      data-ssr-project
    >
      <div aria-hidden className="fixed inset-0 -z-1 max-md:hidden">
        <WallpaperStatic />
      </div>
      <article className="px-window-focused mx-auto my-6 w-[min(100%-2rem,calc(420*var(--px)))] md:my-14">
        <div
          aria-hidden
          className="os-night px-titlebar-focused flex h-16 items-center gap-3 px-6"
        >
          <span className="text-title min-w-0 flex-1 truncate text-(--ink-hi)">
            {project.title}
          </span>
        </div>
        <div className="flex flex-col gap-8 p-6 md:p-8">
          <ProjectSections project={project}>
            {project.gallery.length > 0 && (
              <ProjectGallery>
                {project.gallery.map((item) => (
                  <figure key={item.src} className={GALLERY_CELL_CLASS}>
                    <GalleryThumb item={item} />
                  </figure>
                ))}
              </ProjectGallery>
            )}
          </ProjectSections>
          <div aria-hidden className="rule-dotted" />
          <p className="text-label -mt-4 text-(--meta)">
            One of my projects.{' '}
            <Link href="/" prefetch={false} className={INLINE_LINK_CLASS}>
              More on the {AUTHOR_FULL_NAME} desktop
            </Link>
          </p>
        </div>
      </article>
    </StaticLayer>
  )
}

/**
 * `params` is awaited at the top with no Suspense boundary (and no
 * `loading.tsx`) above it on purpose. A boundary there would move the whole
 * project into a hidden streamed chunk that only JavaScript reveals, and would
 * commit the response as 200 before `notFound()` can run.
 */
export default async function ProjectPage({ params }: ProjectRouteProps) {
  const { slug } = await params
  const project = findProjectBySlug(slug)
  if (!project) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(projectJsonLd(project)),
        }}
      />
      <StaticProject project={project} />
      <Suspense fallback={null}>
        <OsShell initialWindow={{ kind: 'project', slug: project.slug }} />
      </Suspense>
    </>
  )
}
