/**
 * readme.md window — welcome note for ShiroOS.
 * Ported from new-design/index.html `function ReadmeApp()`.
 */
export default function ReadmeApp() {
  return (
    <div className="font-mono text-[13px] text-ink-2 leading-relaxed max-w-[720px]">
      <div className="font-mono text-xs text-miku tracking-[0.14em] uppercase mb-3">
        # readme.md
      </div>

      <h2 className="font-display text-3xl text-ink font-semibold mb-4 tracking-tight">
        welcome to{' '}
        <em className="gradient-text-miku not-italic font-bold">ShiroOS</em> ♪
      </h2>

      <p>
        This is my portfolio, reimagined as a tiny desktop. Click taskbar icons
        to open apps, or hit{' '}
        <kbd className="font-mono font-bold px-1.5 py-0.5 text-xs bg-miku/15 border border-rule text-miku-2 rounded">
          ⌘K
        </kbd>{' '}
        to summon the command palette.
      </p>

      <h3 className="font-display text-lg text-ink mt-7 mb-2">
        ## what&apos;s inside
      </h3>
      <ul className="pl-5 list-disc">
        <li>
          <span className="text-miku">Projects</span> — 16 things I made,
          filterable
        </li>
        <li>
          <span className="text-pink">About</span> — who I am, what I care about
        </li>
        <li>
          <span className="text-lav">Monitor</span> — my skills as a system
          monitor
        </li>
        <li>
          <span className="text-peach">Contact</span> — send a signal
        </li>
      </ul>

      <h3 className="font-display text-lg text-ink mt-7 mb-2">## shortcuts</h3>
      <ul className="pl-5 list-disc">
        <li>
          <span className="text-miku">⌘K</span> — command palette
        </li>
        <li>
          <span className="text-miku">esc</span> — close focused window
        </li>
      </ul>

      <p className="font-mono text-xs text-ink-4 mt-8">
        // built with curiosity, caffeine, and too many electron shells
      </p>
    </div>
  )
}
