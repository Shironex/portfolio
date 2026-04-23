'use client'

import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        router.push('/')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-0 via-sky-1 to-sky-2 font-body">
      <span aria-hidden className="grain-layer" />
      <span
        aria-hidden
        className="pointer-events-none absolute top-[18%] right-[12%] size-64 rounded-full bg-miku/10 blur-3xl motion-safe:animate-floaty"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-[15%] left-[10%] size-72 rounded-full bg-miku-2/10 blur-3xl motion-safe:animate-floaty"
        style={{ animationDelay: '-3s' }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div
          role="dialog"
          aria-labelledby="not-found-title"
          aria-describedby="not-found-desc"
          className="w-full max-w-lg overflow-hidden rounded-2xl border border-rule-2 bg-surf-solid shadow-elev-3 motion-safe:animate-win-open"
        >
          <div className="flex items-center border-b border-rule bg-surf-soft">
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <AlertTriangle
                aria-hidden
                className="size-3.5 text-peach"
                strokeWidth={2}
              />
              <span className="font-mono text-xs font-bold text-ink">
                error.sys — 404
              </span>
            </div>
            <Link
              href="/"
              aria-label="Close and return to desktop"
              className="focus-ring flex h-8 w-10 items-center justify-center text-xs text-ink-2 transition-colors pointer-coarse:h-11 pointer-coarse:w-12 hover:bg-danger hover:text-cloud"
            >
              <span aria-hidden>✕</span>
            </Link>
          </div>

          <div className="px-6 py-6">
            <h1
              id="not-found-title"
              className="mb-1 font-display text-5xl font-bold tracking-tight text-ink"
            >
              404
            </h1>
            <p id="not-found-desc" className="mb-6 font-body text-ink-2">
              No such path in this filesystem.
            </p>

            <div className="mb-6 rounded-lg border border-rule bg-surf-0 px-3 py-3 font-mono text-xs text-ink-2">
              <div className="break-all">
                <span className="font-bold text-miku-2">~/kacper</span>
                <span className="mx-1.5 font-bold text-miku">❯</span>
                <span className="text-ink">
                  cd .{pathname || '/unknown'}
                </span>
              </div>
              <div className="mt-1 text-peach">
                cd: no such file or directory: .{pathname || '/unknown'}
              </div>
              <div className="mt-2">
                <span className="font-bold text-miku-2">~/kacper</span>
                <span className="mx-1.5 font-bold text-miku">❯</span>
                <span
                  aria-hidden
                  className="ml-0.5 text-miku motion-safe:animate-blink"
                >
                  ▌
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="focus-ring inline-flex items-center gap-2 rounded-lg bg-miku px-4 py-2 text-sm font-semibold text-cloud transition-colors hover:bg-miku-2"
              >
                <Home aria-hidden className="size-4" />
                Back to desktop
              </Link>
              <button
                type="button"
                onClick={() => router.back()}
                className="focus-ring inline-flex items-center gap-2 rounded-lg border border-rule-2 bg-surf-0 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surf-1"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Go back
              </button>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-ink-4">
                <kbd className="rounded border border-rule bg-surf-solid/60 px-1.5 py-0.5 text-[11px] font-mono">
                  Esc
                </kbd>
                <span>to return home</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
