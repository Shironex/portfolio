'use client'

import { useEffect } from 'react'

/*
 * The night colours of the pixel chrome, written out: `global-error`
 * replaces the root layout, so no global stylesheet, token or font reaches
 * it (see Next's error.md). Square corners, solid borders and a hard
 * shadow keep the pixel look in plain CSS; the system monospace face
 * stands in for Departure Mono.
 */
const GROUND = '#0b1420'
const SURF = '#13253a'
const RAISED = '#173a45'
const FRAME = '#4fa3a0'
const FRAME_DIM = '#2e6e6e'
const INK = '#e8e4dc'
const INK_HI = '#d8fff2'
const LAMP = '#f0c070'
const FONT = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

/** The focus ring of the shell: lamp outside, navy inside. */
const FOCUS_CSS = `a:focus-visible,button:focus-visible{outline:2px solid ${LAMP};outline-offset:2px;box-shadow:0 0 0 2px ${GROUND}}`

const BUTTON = {
  font: `700 16px/1 ${FONT}`,
  padding: '10px 16px',
  border: `2px solid ${GROUND}`,
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
} as const

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: 16,
          boxSizing: 'border-box',
          background: GROUND,
          color: INK,
          fontFamily: FONT,
        }}
      >
        <title>Something went wrong | ShiroOS</title>
        <style>{FOCUS_CSS}</style>
        <main
          style={{
            width: 'min(100%, 480px)',
            background: SURF,
            border: `4px solid ${FRAME}`,
            boxShadow: `6px 6px 0 ${GROUND}, 6px 6px 0 2px ${FRAME_DIM}`,
          }}
        >
          <div
            style={{
              background: RAISED,
              borderBottom: `2px solid ${FRAME_DIM}`,
              padding: '8px 12px',
              color: INK_HI,
              fontWeight: 700,
            }}
          >
            error.sys
          </div>
          <div style={{ padding: 20 }}>
            <h1 style={{ margin: 0, fontSize: 28, color: LAMP }}>
              Something went wrong
            </h1>
            <p style={{ margin: '12px 0 20px', lineHeight: 1.5 }}>
              ShiroOS hit an error it could not recover from. Try again, or go
              back to the desktop.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button
                type="button"
                onClick={() => retry()}
                style={{ ...BUTTON, background: FRAME, color: GROUND }}
              >
                Try again
              </button>
              {/* A full load, not a client navigation: the app that failed
                  starts over. The rule is on under both of its names. */}
              {/* eslint-disable-next-line next/no-html-link-for-pages, @next/next/no-html-link-for-pages -- the router is what broke */}
              <a
                href="/"
                style={{
                  ...BUTTON,
                  background: RAISED,
                  color: INK,
                  borderColor: FRAME,
                }}
              >
                Back to desktop
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}
