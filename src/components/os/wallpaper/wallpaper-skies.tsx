'use client'

import type { StaticImageData } from 'next/image'

import { artLength as art } from '@/lib/os/pixel'

import dawnLamps from '@/assets/pixel/scene/lamps-dawn.png'
import dayLamps from '@/assets/pixel/scene/lamps-day.png'
import duskLamps from '@/assets/pixel/scene/lamps-dusk.png'
import nightLamps from '@/assets/pixel/scene/lamps-night.png'
import dawnSkyline from '@/assets/pixel/scene/skyline-dawn.png'
import daySkyline from '@/assets/pixel/scene/skyline-day.png'
import duskSkyline from '@/assets/pixel/scene/skyline-dusk.png'
import nightSkyline from '@/assets/pixel/scene/skyline-night.png'

import type { SkyName } from './scene'
import {
  BAND_DITHER,
  LAYOUT,
  SKIES,
  STATIC_TILES,
} from './scene-data.generated'
import { staticSkyRows } from './sky'

const TILES: Record<SkyName, readonly [StaticImageData, StaticImageData]> = {
  night: [nightSkyline, nightLamps],
  dusk: [duskSkyline, duskLamps],
  dawn: [dawnSkyline, dawnLamps],
  day: [daySkyline, dayLamps],
}

/** One background layer: image, position, size and repeat. */
function layer(image: string, position: string, size: string, repeat: string) {
  return `${image} ${position} / ${size} ${repeat}`
}

/**
 * The whole static background of one sky, front to back: its lamps, its
 * skyline, a 2 px pattern for each dithered or mixed sky row, and the plain
 * bands (`--sky-bands` from tokens.css) on the ground colour.
 */
function skyBackground(sky: SkyName): string {
  const [skyline, lamps] = TILES[sky]
  const { lamps: l, skyline: s } = STATIC_TILES
  const rows = staticSkyRows(SKIES[sky].bands, LAYOUT.road.height, BAND_DITHER)
  return [
    layer(
      `url(${lamps.src})`,
      `${art(l.x)} calc(100% - ${art(l.bottom)})`,
      `${art(l.w)} ${art(l.h)}`,
      'repeat-x'
    ),
    layer(
      `url(${skyline.src})`,
      '0 100%',
      `${art(s.w)} ${art(s.h)}`,
      'repeat-x'
    ),
    ...rows.map((row) =>
      layer(
        `linear-gradient(90deg, ${row.even} 50%, ${row.odd} 50%)`,
        `0 calc(100% - ${art(row.above)})`,
        `${art(2)} ${art(1)}`,
        'repeat-x'
      )
    ),
    `${layer('var(--sky-bands)', '0 0', '100% 100%', 'no-repeat')} var(--ground)`,
  ].join(', ')
}

/** Each sky's background as a variable; `wallpaper.css` picks one from `data-sky`. */
const SKIES_CSS = `.wallpaper-static{${(Object.keys(TILES) as SkyName[])
  .map((sky) => `--wp-background-${sky}:${skyBackground(sky)}`)
  .join(';')}}`

/**
 * The four skies' backgrounds (about 8 KB) as one hoisted stylesheet. React
 * writes it into the head once however many static frames the page has (the
 * static layer, the live wallpaper's first frame, the phone's footer strip),
 * and, as a client component, it stays out of the page data.
 */
export function WallpaperSkies() {
  return (
    <style href="wallpaper-skies" precedence="default">
      {SKIES_CSS}
    </style>
  )
}
