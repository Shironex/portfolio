/**
 * Coalesce calls to `fn` to one per animation frame, with the latest
 * arguments. `schedule` queues a call, `flush` runs a queued call now (a
 * release must not wait for the next frame), `cancel` drops it.
 */
export function rafThrottle<Args extends unknown[]>(
  fn: (...args: Args) => void
) {
  let frame = 0
  let pending: Args | null = null

  const run = () => {
    frame = 0
    if (!pending) return
    const args = pending
    pending = null
    fn(...args)
  }
  const drop = () => {
    window.cancelAnimationFrame(frame)
    frame = 0
  }

  return {
    schedule(...args: Args) {
      pending = args
      if (frame === 0) frame = window.requestAnimationFrame(run)
    },
    flush() {
      drop()
      run()
    },
    cancel() {
      drop()
      pending = null
    },
  }
}
