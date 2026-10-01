import { AUTHOR_FULL_NAME } from '@/lib/constants'
import {
  OG_COLORS,
  OG_CONTENT_TYPE,
  OG_SIZE,
  ogImageResponse,
  publicImageDataUri,
} from '@/lib/og/og-card'

/*
 * Generated Open Graph card. Replaces the old static PNG so the copy lives in
 * code next to the rest of the positioning and can't drift out of date as a
 * binary. The frame, colours and fonts are shared with the per-project cards
 * (see `@/lib/og/og-card`).
 */

export const alt = `${AUTHOR_FULL_NAME}, full-stack developer working in TypeScript and Rust`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// The 192px icon is the mascot already scaled down (`pnpm generate:icons`);
// plenty for a 72px avatar, and a fiftieth of the size of the original.
const mascot = await publicImageDataUri('icon-192.png')

export default function OpengraphImage() {
  return ogImageResponse(
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {mascot && (
          <img
            src={mascot}
            width={72}
            height={72}
            alt=""
            style={{
              borderRadius: 9999,
              border: `2px solid ${OG_COLORS.rule}`,
              background: `${OG_COLORS.accent}22`,
              objectFit: 'cover',
              objectPosition: 'top',
            }}
          />
        )}
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: 24,
            color: OG_COLORS.accentDeep,
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
            color: OG_COLORS.ink,
          }}
        >
          {AUTHOR_FULL_NAME}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 40,
            color: OG_COLORS.accent,
          }}
        >
          Full-stack developer · TypeScript + Rust
        </div>
        <div style={{ marginTop: 14, fontSize: 30, color: OG_COLORS.ink2 }}>
          Remote · CET · open to full-time and contracts
        </div>
      </div>
    </>
  )
}
