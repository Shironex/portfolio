import { AUTHOR_FULL_NAME } from '@/lib/constants'
import { OG_CONTENT_TYPE, OG_SIZE, homeCard } from '@/lib/og/og-card'

/*
 * The site's Open Graph card (OG.md, home): the ShiroOS scene with
 * `~/kacper ❯ whoami` in a window, the README logo tile, my name, role and
 * where I work. The copy lives here, next to the rest of the positioning;
 * the scene, fonts and slots in `@/lib/og/og-card`.
 */

export const alt = `${AUTHOR_FULL_NAME}, full-stack developer working in TypeScript and Rust`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function OpengraphImage() {
  return homeCard({
    name: AUTHOR_FULL_NAME,
    role: 'Full-stack developer · TypeScript + Rust',
    meta: 'Remote · CET · open to full-time and contracts',
  })
}
