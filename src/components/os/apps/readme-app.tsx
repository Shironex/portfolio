import type { ReactNode } from 'react'

import { INLINE_LINK_CLASS, PROSE_CLASS } from '@/components/os/constants'
import { Kbd } from '@/components/os/kbd'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { GITHUB_URL } from '@/lib/constants'
import { countProjects } from '@/lib/utils/projects'

import banners from '@/assets/pixel/banners/readme-headers.png'
import bootSheet from '@/assets/pixel/boot/os-boot.png'
import { projectsData } from '@/data/projects-data'
import '@/styles/sprites/os-boot.css'
import '@/styles/sprites/readme-headers.css'

const projectCount = countProjects(projectsData).total

/** A list of the Readme: pixel chevrons for bullets, at the measure. */
function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex max-w-[66ch] flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="text-prose flex items-start gap-3 text-(--ink)">
          <PixelIcon
            name="chevron-right"
            className="mt-3 text-(--accent-primary-icon)"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function Name({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-(--ink-hi)">{children}</strong>
}

/**
 * The same window shows on the desktop and as a phone sheet (under the `md`
 * breakpoint, where the phone shell takes over), so the copy that names a
 * way to get around comes in both wordings (decision 5 of SPEC 11): clicks,
 * ⌘K and arrow keys on the desktop, the dock, the launcher and taps on a
 * phone. The other one is `display: none`, out of the accessibility tree.
 */
const DESKTOP_ONLY = 'max-md:hidden'
const PHONE_ONLY = 'md:hidden'

/**
 * readme.md window: short welcome note for ShiroOS. In pixels (SPEC 1.5):
 * the README `hi` banner over the welcome heading, the boot screen's kana
 * on a night plate, keycaps for every shortcut. On a phone the ways to get
 * around are the phone's (see `PHONE_ONLY`).
 */
export default function ReadmeApp() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col items-start gap-3">
        <span
          aria-hidden
          className="os-night px-readme-headers px-readme-headers-hi ambient-loop block max-w-full flex-none animate-(--px-loop)"
          style={{ backgroundImage: `url(${banners.src})` }}
        />
        <h2 className="text-display lamp-heading">Welcome to ShiroOS</h2>
        <p className="flex items-center gap-3">
          <span
            role="img"
            aria-label="シロOS"
            className="os-night px-label-plate block flex-none p-1"
          >
            <span
              className="px-os-boot px-os-boot-kana block"
              style={{ backgroundImage: `url(${bootSheet.src})` }}
            />
          </span>
          <span className="text-label text-(--meta)">portfolio build</span>
        </p>
      </header>

      <p className={`${PROSE_CLASS} ${DESKTOP_ONLY}`}>
        This is my portfolio, reimagined as a small desktop. Click the icons on
        the side to open apps, or press <Kbd>⌘K</Kbd> for the command palette.
      </p>
      <p className={`${PROSE_CLASS} ${PHONE_ONLY}`}>
        This is my portfolio, reimagined as a small desktop. On a phone it folds
        into one feed, with a dock at the bottom: tap an app there and it opens
        as a sheet like this one.
      </p>

      <section className="flex flex-col gap-3">
        <h3 className="text-heading lamp-heading">What&apos;s inside</h3>
        <p className={`text-prose text-(--meta) ${PHONE_ONLY}`}>
          The dock holds them in this order, from the left:
        </p>
        <List
          items={[
            <>
              <Name>Projects</Name>: {projectCount} things I made, filterable by
              status.
            </>,
            <>
              <Name>About</Name>: who I am, what I work on, and what I do
              outside the editor.
            </>,
            <>
              <Name>Monitor</Name>: skills and tools I use daily.
            </>,
            <>
              <Name>Contact</Name>: a form, plus my email and GitHub.
            </>,
            <>
              <Name>Writing</Name>: the latest posts from my blog, where I write
              up what I build and what broke.
            </>,
          ]}
        />
      </section>

      <section className={`flex flex-col gap-3 ${DESKTOP_ONLY}`}>
        <h3 className="text-heading lamp-heading">Shortcuts</h3>
        <List
          items={[
            <>
              <Kbd>⌘K</Kbd>: command palette
            </>,
            <>
              <Kbd>Esc</Kbd>: close the focused window
            </>,
            <>
              Arrow keys on a focused title bar: move the window.{' '}
              <Kbd>Shift</Kbd> + arrows to resize.
            </>,
            <>
              <Kbd>Ctrl</Kbd> + <Kbd>Alt</Kbd> + arrows on a focused title bar:
              left or right snaps the window to that half, up maximizes, down
              restores. Dragging a window to a screen edge does the same.
            </>,
            <>Double-click a title bar: maximize or restore the window.</>,
          ]}
        />
      </section>

      <section className={`flex flex-col gap-3 ${PHONE_ONLY}`}>
        <h3 className="text-heading lamp-heading">Shortcuts</h3>
        <List
          items={[
            <>
              <Name>Dock</Name>: tap an app to open it. A small gold mark under
              its icon means it is open.
            </>,
            <>
              <Name>Search</Name>: the first button in the dock finds any app or
              project by name.
            </>,
            <>
              <Name>Launcher</Name>: the menu button at the top right. Every
              app, plus my settings: the Lamp, the pets, pausing animations,
              readable text and the sky.
            </>,
            <>
              <Name>Lamp</Name>: the bulb at the top switches the pages between
              night and paper.
            </>,
            <>
              <Name>Sheets</Name>: the close button at the top right of a sheet
              takes you back to the feed. The link button beside it copies a
              link straight to that app.
            </>,
          ]}
        />
      </section>

      <p className="text-prose max-w-[66ch] text-(--meta)">
        Built with Next.js 16 and Tailwind v4. Source is on{' '}
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className={INLINE_LINK_CLASS}
        >
          GitHub
        </a>
        .
      </p>
    </div>
  )
}
