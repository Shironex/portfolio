import Image from 'next/image'

/**
 * readme.md window — short welcome note for ShiroOS.
 */
export default function ReadmeApp() {
  return (
    <div className="font-body text-ink-2 max-w-[720px] text-[14px] leading-relaxed">
      <div className="mb-4 flex items-center gap-4">
        <Image
          src="/mascot.png"
          alt=""
          width={80}
          height={80}
          className="border-rule-2 bg-miku/10 shadow-elev-1 size-16 shrink-0 rounded-full border object-cover object-top"
        />
        <div>
          <h2 className="font-display text-ink text-3xl font-semibold tracking-tight">
            Welcome to ShiroOS
          </h2>
          <p className="text-ink-4 mt-0.5 font-mono text-[11px]">
            シロOS · portfolio build
          </p>
        </div>
      </div>

      <p>
        This is my portfolio, reimagined as a small desktop. Click the icons on
        the side to open apps, or press{' '}
        <kbd className="bg-miku/15 border-rule text-miku-2 rounded border px-1.5 py-0.5 font-mono text-xs font-bold">
          ⌘K
        </kbd>{' '}
        for the command palette.
      </p>

      <h3 className="font-display text-ink mt-7 mb-2 text-lg font-semibold">
        What&apos;s inside
      </h3>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <span className="text-ink font-semibold">Projects</span> — 16 things I
          made, filterable by status.
        </li>
        <li>
          <span className="text-ink font-semibold">About</span> — bio, things I
          do outside the editor, a rough timeline.
        </li>
        <li>
          <span className="text-ink font-semibold">Monitor</span> — skills and
          tools I use daily.
        </li>
        <li>
          <span className="text-ink font-semibold">Contact</span> — form + my
          email and GitHub.
        </li>
      </ul>

      <h3 className="font-display text-ink mt-7 mb-2 text-lg font-semibold">
        Shortcuts
      </h3>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <kbd className="bg-surf-soft border-rule text-ink-2 rounded border px-1.5 py-0.5 font-mono text-xs font-bold">
            ⌘K
          </kbd>{' '}
          — command palette
        </li>
        <li>
          <kbd className="bg-surf-soft border-rule text-ink-2 rounded border px-1.5 py-0.5 font-mono text-xs font-bold">
            Esc
          </kbd>{' '}
          — close the focused window
        </li>
        <li>
          Arrow keys on a focused title bar — move the window;{' '}
          <kbd className="bg-surf-soft border-rule text-ink-2 rounded border px-1.5 py-0.5 font-mono text-xs font-bold">
            Shift
          </kbd>{' '}
          + arrows to resize.
        </li>
      </ul>

      <p className="text-ink-3 mt-8 text-sm">
        Built with Next.js 16 and Tailwind v4. Source is on{' '}
        <a
          href="https://github.com/shironex"
          className="focus-ring text-miku-2 rounded-sm underline underline-offset-2"
        >
          GitHub
        </a>
        .
      </p>
    </div>
  )
}
