import { INLINE_LINK_CLASS } from '@/components/os/constants'

import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  EMAIL_CONTACT,
  GITHUB_URL,
} from '@/lib/constants'

/**
 * Plain HTML fallback rendered inside `<noscript>` for clients without JS.
 * ShiroOS is a heavily stateful SPA. Without React the desktop can't boot,
 * so this surfaces the essentials (name, contact, GitHub) in one pixel
 * window over a dither scrim: CSS only, the chrome needs no script.
 */
export function NoscriptFallback() {
  return (
    <noscript>
      <div className="z-noscript px-tile-shadow fixed inset-0 flex items-center justify-center overflow-y-auto p-4">
        <div className="px-window-focused flex w-full max-w-[calc(260*var(--px))] flex-col">
          <div
            aria-hidden
            className="os-night px-titlebar-focused flex h-16 items-center px-6"
          >
            <span className="text-title truncate text-(--ink-hi)">
              noscript.txt
            </span>
          </div>
          {/* A labelled region, so the card's text sits in a landmark. */}
          <section
            aria-labelledby="noscript-title"
            className="flex flex-col gap-4 p-8"
          >
            {/* Not an `h1`: with no JavaScript the static hero under this
                card is still in the document, and it has the page's one. */}
            <h2 id="noscript-title" className="text-heading lamp-heading">
              ShiroOS needs JavaScript
            </h2>
            <p className="text-body text-(--ink)">
              This portfolio is a tiny desktop: boot splash, draggable windows,
              command palette. Enable JS to explore. In the meantime:
            </p>
            <ul className="text-body flex flex-col gap-2 text-(--ink)">
              <li>
                <strong className="text-(--ink-hi)">{AUTHOR_FULL_NAME}</strong>{' '}
                ({AUTHOR_NAME}), full-stack developer, TypeScript + Rust
              </li>
              <li>
                Remote from Poland (CET), open to full-time roles and contracts
              </li>
              <li>
                Email:{' '}
                <a
                  href={`mailto:${EMAIL_CONTACT}`}
                  className={INLINE_LINK_CLASS}
                >
                  {EMAIL_CONTACT}
                </a>
              </li>
              <li className="break-all">
                GitHub:{' '}
                <a href={GITHUB_URL} className={INLINE_LINK_CLASS}>
                  {GITHUB_URL}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </noscript>
  )
}

/** Marks the shell root, so {@link NoscriptStaticPage} can hide it. */
export const SHELL_ROOT_ATTRIBUTE = 'data-os-shell'

/** Set on the shell root once it has hydrated and its handlers are live. */
export const SHELL_READY_ATTRIBUTE = 'data-shell-ready'

/**
 * For a route that server-renders its own content under the shell. Without JS
 * the shell cannot boot and would only cover that content, so it is hidden and
 * the static content is the page.
 */
export function NoscriptStaticPage() {
  return (
    <noscript>
      <style>{`[${SHELL_ROOT_ATTRIBUTE}]{display:none}`}</style>
    </noscript>
  )
}
