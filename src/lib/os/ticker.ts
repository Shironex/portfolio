/**
 * One shared clock for the art that script animates (SPEC 4: the wallpaper
 * now, the pets in Phase 5), so the page runs one `requestAnimationFrame`
 * loop however many things move, and none at all when nothing does.
 *
 * A task says when it next needs a frame: `run(now)` returns the time (in
 * `performance.now()` ms) it wants to run again, or `null` to stop. Between
 * frames the ticker sleeps on a timer until the earliest task is due, then
 * waits for the next animation frame, so a 160 ms twinkle costs one timer and
 * one frame, not ten frames. While the tab is hidden it schedules nothing;
 * when the tab shows again every task that fell due runs once, on the next
 * frame, and then keeps its own pace.
 */

export interface TickerTask {
  /** Runs the task's frame; returns when it is next due, or null to stop. */
  run: (now: number) => number | null
}

export interface TickerHandle {
  /** Stops the task. Safe to call more than once. */
  cancel: () => void
  /** Brings the task's next run forward to `at` (default: the next frame). */
  wake: (at?: number) => void
}

interface Entry {
  task: TickerTask
  due: number
}

const entries = new Set<Entry>()
let frame: number | null = null
let timer: ReturnType<typeof setTimeout> | null = null
let listening = false

/** Under this, waiting for the next frame is closer than a timer would be. */
const FRAME_SLACK_MS = 12

function hidden() {
  return typeof document !== 'undefined' && document.hidden
}

function clear() {
  if (frame !== null) cancelAnimationFrame(frame)
  if (timer !== null) clearTimeout(timer)
  frame = null
  timer = null
}

function onFrame(now: number) {
  frame = null
  for (const entry of [...entries]) {
    if (!entries.has(entry) || entry.due > now) continue
    const next = entry.task.run(now)
    if (next === null) entries.delete(entry)
    else entry.due = Math.max(next, now + 1)
  }
  plan()
}

/** Sleep until the earliest task is due, or do nothing when none is. */
function plan() {
  clear()
  if (entries.size === 0 || hidden()) return
  let earliest = Number.POSITIVE_INFINITY
  for (const entry of entries) earliest = Math.min(earliest, entry.due)
  const wait = earliest - performance.now()
  if (wait <= FRAME_SLACK_MS) {
    frame = requestAnimationFrame(onFrame)
    return
  }
  timer = setTimeout(() => {
    timer = null
    frame = requestAnimationFrame(onFrame)
  }, wait - FRAME_SLACK_MS)
}

function listen() {
  if (listening || typeof document === 'undefined') return
  listening = true
  document.addEventListener('visibilitychange', plan)
}

/**
 * Adds a task, first due at `due` (default: the next frame). Returns the
 * handle that stops it or brings it forward.
 */
export function schedule(task: TickerTask, due?: number): TickerHandle {
  listen()
  const entry: Entry = { task, due: due ?? performance.now() }
  entries.add(entry)
  plan()
  return {
    cancel() {
      if (entries.delete(entry)) plan()
    },
    wake(at) {
      if (!entries.has(entry)) return
      entry.due = Math.min(entry.due, at ?? performance.now())
      plan()
    },
  }
}
