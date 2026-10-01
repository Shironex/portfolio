import {
  AUTHOR_FULL_NAME,
  AUTHOR_NAME,
  EMAIL_CONTACT,
  GITHUB_URL,
} from '@/lib/constants'

/**
 * Plain HTML fallback rendered inside `<noscript>` for clients without JS.
 * ShiroOS is a heavily stateful SPA. Without React the desktop can't boot,
 * so this surfaces the essentials (name, contact, GitHub) in a tiny card.
 */
export function NoscriptFallback() {
  return (
    <noscript>
      <div
        className="z-noscript"
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-sky-1)',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", Geist, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            padding: '2rem',
            borderRadius: 16,
            background: 'var(--color-surf-solid)',
            border: '1px solid var(--color-rule-2)',
            boxShadow: 'var(--shiro-elev-3)',
          }}
        >
          {/* Not an `h1`: with no JavaScript the static hero under this card
              is still in the document, and it has the page's one. */}
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              color: 'var(--color-ink)',
              fontWeight: 700,
            }}
          >
            ShiroOS needs JavaScript
          </h2>
          <p
            style={{
              marginTop: 12,
              color: 'var(--color-ink-2)',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            This portfolio is a tiny desktop: boot splash, draggable windows,
            command palette. Enable JS to explore. In the meantime:
          </p>
          <ul
            style={{
              marginTop: 16,
              paddingLeft: 20,
              color: 'var(--color-ink-2)',
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong>{AUTHOR_FULL_NAME}</strong> ({AUTHOR_NAME}), full-stack
              developer, TypeScript + Rust
            </li>
            <li>
              Remote from Poland (CET), open to full-time roles and contracts
            </li>
            <li>
              Email:{' '}
              <a
                href={`mailto:${EMAIL_CONTACT}`}
                style={{ color: 'var(--color-miku-ink)' }}
              >
                {EMAIL_CONTACT}
              </a>
            </li>
            <li>
              GitHub:{' '}
              <a href={GITHUB_URL} style={{ color: 'var(--color-miku-ink)' }}>
                {GITHUB_URL}
              </a>
            </li>
          </ul>
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
