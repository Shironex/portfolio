import { AUTHOR_FULL_NAME } from '@/lib/constants'
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  cachedPublicImageDataUri,
  ogImageResponse,
} from '@/lib/og/og-card'
import { STATUS_LABEL, summaryLead } from '@/lib/utils/project-meta'
import {
  type ProjectRouteProps,
  findProjectBySlug,
  projectStaticParams,
} from '@/lib/utils/projects'

/*
 * Per-project Open Graph card: type and status, title, the first sentence of
 * the summary, and the project thumbnail. The thumbnail is a small JPEG copy
 * under `public/projects/og/`, written by `pnpm generate:og`: the renderer
 * cannot decode webp, and a full-size screenshot is wasted on this slot.
 * Projects without an image get the text-only layout.
 */

export const alt = `Project card from the portfolio of ${AUTHOR_FULL_NAME}`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

const THUMB = { width: 400, height: 225 }

export const generateStaticParams = projectStaticParams

export default async function ProjectOpengraphImage({
  params,
}: ProjectRouteProps) {
  const { slug } = await params
  const project = findProjectBySlug(slug)
  if (!project) return new Response('Not found', { status: 404 })

  const thumbnail = project.image
    ? await cachedPublicImageDataUri(`projects/og/${project.slug}.jpg`)
    : null
  const tags = [project.projectType, STATUS_LABEL[project.status]].filter(
    Boolean
  )

  return ogImageResponse(
    <>
      <div
        style={{
          display: 'flex',
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          color: OG_COLORS.accentDeep,
        }}
      >
        ~/projects ❯ {tags.join(' · ')}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 48,
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize: thumbnail ? 68 : 84,
              lineHeight: 1.04,
              letterSpacing: '-0.02em',
              color: OG_COLORS.ink,
            }}
          >
            {project.title}
          </div>
          <div
            style={{
              display: 'block',
              marginTop: 20,
              fontSize: thumbnail ? 28 : 32,
              lineHeight: 1.3,
              color: OG_COLORS.ink2,
              lineClamp: 3,
            }}
          >
            {summaryLead(project)}
          </div>
        </div>
        {thumbnail && (
          <img
            src={thumbnail}
            {...THUMB}
            alt=""
            style={{
              borderRadius: 20,
              border: `2px solid ${OG_COLORS.rule}`,
              objectFit: 'cover',
              objectPosition: 'left top',
            }}
          />
        )}
      </div>
    </>
  )
}
