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
import OsShell from '@/components/os/os-shell'
import { StaticLayer } from '@/components/os/static-layer'

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
 */
function StaticProject({ project }: { project: Project }) {
  return (
    <StaticLayer
      className="text-ink from-sky-0 via-sky-1 to-sky-2 fixed inset-0 overflow-y-auto bg-linear-to-br"
      data-ssr-project
    >
      <article className="border-rule-2 bg-surf-solid shadow-elev-3 mx-auto my-6 w-[min(100%-2rem,52rem)] rounded-3xl border p-5 md:my-14 md:p-8">
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
        <p className="text-ink-3 mt-8 font-mono text-xs">
          One of my projects.{' '}
          <Link href="/" prefetch={false} className="focus-ring text-miku-ink">
            More on the {AUTHOR_FULL_NAME} desktop
          </Link>
        </p>
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
