import { ImageResponse } from 'next/og'

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import { siteConfig } from '@/lib/metadata-config'

/*
 * Generated Open Graph card. Replaces the old static PNG so the copy lives in
 * code next to the rest of the positioning and can't drift out of date as a
 * binary. Colours mirror the default ShiroOS palette (see palettes.css).
 * Fonts are static TTFs committed under `_fonts` because the renderer can't
 * read woff2 and fetching them at build time would make builds need network.
 */

export const alt =
  'Kacper Lachowicz, full-stack developer working in TypeScript and Rust'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const fontDir = join(process.cwd(), 'src/app/_fonts')
const [fraunces, geist, mono, mascot] = await Promise.all([
  readFile(join(fontDir, 'fraunces-bold.ttf')),
  readFile(join(fontDir, 'geist-medium.ttf')),
  readFile(join(fontDir, 'jetbrains-mono-regular.ttf')),
  readFile(join(process.cwd(), 'public/mascot.png'), 'base64'),
])

const COLORS = {
  bg: '#f5efe0',
  surface: '#fdfaf0',
  ink: '#1a1714',
  ink2: '#3a3530',
  accent: '#0f7c74',
  accentDeep: '#0a5954',
  accentLight: '#1ca59b',
  rule: 'rgba(26, 23, 20, 0.14)',
}

const siteHost = siteConfig.url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: COLORS.bg,
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
          background: COLORS.surface,
          border: `2px solid ${COLORS.rule}`,
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
            background: `radial-gradient(circle, ${COLORS.accentLight}55, transparent 70%)`,
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* eslint-disable-next-line next/no-img-element, @next/next/no-img-element -- satori renders a plain img */}
          <img
            src={`data:image/png;base64,${mascot}`}
            width={72}
            height={72}
            alt=""
            style={{
              borderRadius: 9999,
              border: `2px solid ${COLORS.rule}`,
              background: `${COLORS.accent}22`,
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: 24,
              color: COLORS.accentDeep,
            }}
          >
            ~/kacper ❯ whoami
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: 'Fraunces',
              fontSize: 88,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              color: COLORS.ink,
            }}
          >
            Kacper Lachowicz
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 40,
              color: COLORS.accent,
            }}
          >
            Full-stack developer · TypeScript + Rust
          </div>
          <div style={{ marginTop: 14, fontSize: 30, color: COLORS.ink2 }}>
            Remote · CET · open to full-time and contracts
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `2px solid ${COLORS.rule}`,
            paddingTop: 24,
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            color: COLORS.ink2,
          }}
        >
          <span>{siteHost}</span>
          <span style={{ color: COLORS.accentDeep }}>ShiroOS</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: fraunces, weight: 700, style: 'normal' },
        { name: 'Geist', data: geist, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: mono, weight: 400, style: 'normal' },
      ],
    }
  )
}
