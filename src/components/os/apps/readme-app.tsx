/**
 * readme.md window — short welcome note for ShiroOS.
 */
export default function ReadmeApp() {
  return (
    <div className="font-body text-[14px] text-ink-2 leading-relaxed max-w-[720px]">
      <h2 className="font-display text-3xl text-ink font-semibold mb-4 tracking-tight">
        Welcome to ShiroOS
      </h2>

      <p>
        This is my portfolio, reimagined as a small desktop. Click the icons on
        the side to open apps, or press{' '}
        <kbd className="font-mono font-bold px-1.5 py-0.5 text-xs bg-miku/15 border border-rule text-miku-2 rounded">
          ⌘K
        </kbd>{' '}
        for the command palette.
      </p>

      <h3 className="font-display text-lg text-ink font-semibold mt-7 mb-2">
        What&apos;s inside
      </h3>
      <ul className="pl-5 list-disc space-y-1">
        <li>
          <span className="font-semibold text-ink">Projects</span> — 16 things I
          made, filterable by status.
        </li>
        <li>
          <span className="font-semibold text-ink">About</span> — bio, things I
          do outside the editor, a rough timeline.
        </li>
        <li>
          <span className="font-semibold text-ink">Monitor</span> — skills and
          tools I use daily.
        </li>
        <li>
          <span className="font-semibold text-ink">Contact</span> — form + my
          email and GitHub.
        </li>
      </ul>

      <h3 className="font-display text-lg text-ink font-semibold mt-7 mb-2">
        Shortcuts
      </h3>
      <ul className="pl-5 list-disc space-y-1">
        <li>
          <kbd className="font-mono font-bold px-1.5 py-0.5 text-xs bg-surf-soft border border-rule text-ink-2 rounded">
            ⌘K
          </kbd>{' '}
          — command palette
        </li>
        <li>
          <kbd className="font-mono font-bold px-1.5 py-0.5 text-xs bg-surf-soft border border-rule text-ink-2 rounded">
            Esc
          </kbd>{' '}
          — close the focused window
        </li>
        <li>
          Arrow keys on a focused title bar — move the window;{' '}
          <kbd className="font-mono font-bold px-1.5 py-0.5 text-xs bg-surf-soft border border-rule text-ink-2 rounded">
            Shift
          </kbd>{' '}
          + arrows to resize.
        </li>
      </ul>

      <p className="mt-8 text-ink-3 text-sm">
        Built with Next.js 16 and Tailwind v4. Source is on{' '}
        <a
          href="https://github.com/shironex"
          className="focus-ring text-miku-2 underline underline-offset-2 rounded-sm"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  )
}
