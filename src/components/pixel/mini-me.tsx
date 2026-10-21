import { cn } from '@/lib/utils'

import sheet from '@/assets/pixel/pets/minime.png'
import '@/styles/sprites/minime.css'

/** The two README mini-me tags (`readme/minime.aseprite`). */
export type MiniMeTag = 'wave' | 'type'

interface MiniMeProps {
  tag: MiniMeTag
  /**
   * `once` plays the tag one time when it mounts and rests on its first
   * frame (the wave hello); `loop` repeats it as an ambient loop, which the
   * automatic pauses hold (the typing of a loading state).
   */
  play: 'once' | 'loop'
  className?: string
}

/**
 * The 32x32 mini-me of the README (SPEC 1.5, Contact and Writing), with the
 * frame timings as drawn. Never plays under reduced motion or the Pause
 * setting: the once play rests on its first frame (`px-rest-paused`), the
 * loop holds still (`ambient-loop`). Decorative.
 */
export function MiniMe({ tag, play, className }: MiniMeProps) {
  return (
    <span
      aria-hidden
      data-minime={tag}
      className={cn(
        'px-minime block flex-none animate-(--px-loop)',
        `px-minime-${tag}`,
        play === 'once'
          ? 'px-rest-paused [animation-iteration-count:1]'
          : 'ambient-loop',
        className
      )}
      style={{ backgroundImage: `url(${sheet.src})` }}
    />
  )
}
