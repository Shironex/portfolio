import { SHELL_ROOT_ATTRIBUTE } from '@/components/os/noscript-fallback'

import { SETTING_FLAGS } from '@/lib/os/appearance'
import { AMBIENT_ATTRIBUTE, AMBIENT_PAUSED } from '@/lib/os/dom'

/** What a phone cameo (SPEC 3.8) needs to know before it moves. */
export interface CameoState {
  /** Enough of it is on screen (the observer's threshold). */
  inView: boolean
  /** Pause animations is on (`data-motion`). */
  paused: boolean
  /** The visitor asks for reduced motion. */
  reduced: boolean
  /** Pets is off (`data-pets`). */
  hidden: boolean
  /** A sheet, the launcher or the palette covers the feed (`data-ambient`). */
  covered: boolean
}

/**
 * Watches everything that holds or hides a phone cameo: its place on screen
 * (an IntersectionObserver at `threshold`), the Pause and Pets flags on
 * <html>, the shell's ambient pause and the reduced motion query. Calls
 * `onChange` with the whole state at once and on every change. Returns the
 * function that stops watching.
 */
export function watchCameo(
  el: Element,
  threshold: number,
  onChange: (state: CameoState) => void
): () => void {
  const html = document.documentElement
  const shell = el.closest(`[${SHELL_ROOT_ATTRIBUTE}]`)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let inView = false

  const report = () =>
    onChange({
      inView,
      paused: html.dataset.motion === SETTING_FLAGS.motion.value,
      reduced: reduced.matches,
      hidden: html.dataset.pets === SETTING_FLAGS.pets.value,
      covered: shell?.getAttribute(AMBIENT_ATTRIBUTE) === AMBIENT_PAUSED,
    })

  const view = new IntersectionObserver(
    ([entry]) => {
      // A ratio a hair under the threshold still counts: the observer fires
      // at the crossing, where rounding can land either side.
      inView =
        entry.isIntersecting && entry.intersectionRatio >= threshold - 0.01
      report()
    },
    { threshold }
  )
  view.observe(el)

  const flags = new MutationObserver(report)
  flags.observe(html, {
    attributes: true,
    attributeFilter: ['data-motion', 'data-pets'],
  })
  if (shell) {
    flags.observe(shell, {
      attributes: true,
      attributeFilter: [AMBIENT_ATTRIBUTE],
    })
  }
  reduced.addEventListener('change', report)
  report()

  return () => {
    view.disconnect()
    flags.disconnect()
    reduced.removeEventListener('change', report)
  }
}
