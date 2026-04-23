/**
 * PanelControls — decorative Win-11-style window control glyphs for the
 * non-interactive panels on the desktop canvas (TerminalPanel, FeaturedPanel,
 * NowPlaying). These panels aren't real OS windows, so the glyphs don't hook
 * into any action — they just visually match the chrome on real draggable
 * windows and always sit on the right of the panel header.
 */
export function PanelControls() {
  return (
    <div
      aria-hidden
      className="flex items-center gap-1 font-mono text-[10px] text-ink-4 select-none"
    >
      <span className="flex size-5 items-center justify-center">⎯</span>
      <span className="flex size-5 items-center justify-center">▢</span>
      <span className="flex size-5 items-center justify-center">✕</span>
    </div>
  )
}
