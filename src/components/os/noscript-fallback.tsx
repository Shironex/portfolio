import { AUTHOR_NAME, EMAIL_CONTACT, GITHUB_URL } from '@/lib/constants'

/**
 * Plain HTML fallback rendered inside `<noscript>` for clients without JS.
 * ShiroOS is a heavily stateful SPA — without React the desktop can't boot,
 * so we surface the essentials (name, contact, GitHub) in a tiny card.
 */
export function NoscriptFallback() {
  return (
    <noscript>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#c6ecff',
          padding: '2rem',
          zIndex: 10_000,
          fontFamily:
            'system-ui, -apple-system, "Segoe UI", Nunito, sans-serif',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            padding: '2rem',
            borderRadius: 16,
            background: '#ffffff',
            border: '1px solid rgba(13, 27, 42, 0.14)',
            boxShadow: '0 10px 40px -5px rgba(13, 27, 42, 0.2)',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 24,
              color: '#0d1b2a',
              fontWeight: 700,
            }}
          >
            ShiroOS needs JavaScript
          </h1>
          <p
            style={{
              marginTop: 12,
              color: '#2b3b51',
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            This portfolio is a tiny desktop — boot splash, draggable windows,
            command palette. Enable JS to explore. In the meantime:
          </p>
          <ul
            style={{
              marginTop: 16,
              paddingLeft: 20,
              color: '#2b3b51',
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            <li>
              <strong>{AUTHOR_NAME}</strong> — full-stack developer, Gdańsk, PL
            </li>
            <li>
              Email:{' '}
              <a
                href={`mailto:${EMAIL_CONTACT}`}
                style={{ color: '#00b8d4' }}
              >
                {EMAIL_CONTACT}
              </a>
            </li>
            <li>
              GitHub:{' '}
              <a href={GITHUB_URL} style={{ color: '#00b8d4' }}>
                {GITHUB_URL}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </noscript>
  )
}
