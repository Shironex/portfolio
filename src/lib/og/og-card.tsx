import { cacheLife } from 'next/cache'
import { ImageResponse } from 'next/og'
import type { ReactElement, ReactNode } from 'react'

import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

import { siteConfig } from '@/lib/metadata-config'

/*
 * Shared frame for the generated Open Graph cards. Colours mirror the default
 * ShiroOS palette (see palettes.css). Fonts are static TTFs committed under
 * `src/app/_fonts` because the renderer can't read woff2 and fetching them at
 * build time would make builds need network.
 */

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export const OG_COLORS = {
  bg: '#f5efe0',
  surface: '#fdfaf0',
  ink: '#1a1714',
  ink2: '#3a3530',
  accent: '#0f7c74',
  accentDeep: '#0a5954',
  accentLight: '#1ca59b',
  rule: 'rgba(26, 23, 20, 0.14)',
}

const fontDir = join(process.cwd(), 'src/app/_fonts')
const [fraunces, geist, mono] = await Promise.all([
  readFile(join(fontDir, 'fraunces-bold.ttf')),
  readFile(join(fontDir, 'geist-medium.ttf')),
  readFile(join(fontDir, 'jetbrains-mono-regular.ttf')),
])

const siteHost = siteConfig.url.replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * Image formats the card renderer can decode, by file extension. webp is left
 * out on purpose: the renderer throws on it.
 */
const EMBEDDABLE: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

/**
 * A file under `public/` as a data URI for an `<img>` in a card, or `null`
 * when the renderer cannot decode that format (webp among them) or the file is
 * missing. Callers lay the card out without the image in that case.
 */
export async function publicImageDataUri(
  publicPath: string
): Promise<string | null> {
  const mime = EMBEDDABLE[extname(publicPath).toLowerCase()]
  if (!mime) return null
  try {
    const data = await readFile(
      join(process.cwd(), 'public', publicPath),
      'base64'
    )
    return `data:${mime};base64,${data}`
  } catch {
    return null
  }
}

/**
 * {@link publicImageDataUri} for use while rendering a route. Disk reads count
 * as dynamic work under Cache Components, so an uncached read there would stop
 * the image from being prerendered; module-level callers do not need this.
 */
export async function cachedPublicImageDataUri(
  publicPath: string
): Promise<string | null> {
  'use cache'
  cacheLife('max')
  return publicImageDataUri(publicPath)
}

/** Bottom rule of a card: the site host on the left, the brand on the right. */
function OgFooter() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `2px solid ${OG_COLORS.rule}`,
        paddingTop: 24,
        fontFamily: 'JetBrains Mono',
        fontSize: 24,
        color: OG_COLORS.ink2,
      }}
    >
      <span>{siteHost}</span>
      <span style={{ color: OG_COLORS.accentDeep }}>ShiroOS</span>
    </div>
  )
}

/** The cream ground, the rounded surface with its glow, and the footer. */
function OgCard({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: OG_COLORS.bg,
        padding: 48,
        fontFamily: 'Geist',
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: OG_COLORS.surface,
          border: `2px solid ${OG_COLORS.rule}`,
          borderRadius: 36,
          padding: '56px 64px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -140,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${OG_COLORS.accentLight}55, transparent 70%)`,
          }}
        />
        {children}
        <OgFooter />
      </div>
    </div>
  )
}

/**
 * Render a card. `children` are the rows above the footer; the surface spaces
 * them out vertically.
 */
export function ogImageResponse(children: ReactElement): ImageResponse {
  return new ImageResponse(<OgCard>{children}</OgCard>, {
    ...OG_SIZE,
    fonts: [
      { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
      { name: 'Geist', data: geist, weight: 500, style: 'normal' },
      { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
    ],
  })
}
