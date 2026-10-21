'use client'

import { memo } from 'react'

import { GithubActivityStrip } from './github-activity-strip'
import {
  HERO_STRIP_CLASS,
  HeroPlateFrame,
  type HeroPlateFrameProps,
} from './hero-plate-frame'

type HeroPlateProps = Omit<HeroPlateFrameProps, 'animated' | 'children'>

/**
 * HeroPlate: the hero panel on the desktop (and first in the phone feed),
 * with the GitHub activity strip under the author row.
 */
function HeroPlateImpl(props: HeroPlateProps) {
  return (
    <HeroPlateFrame {...props}>
      <div className={HERO_STRIP_CLASS}>
        <GithubActivityStrip />
      </div>
    </HeroPlateFrame>
  )
}

export const HeroPlate = memo(HeroPlateImpl)
