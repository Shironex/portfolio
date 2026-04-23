'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { AlertTriangle, ArrowLeft, Home } from 'lucide-react'

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
    <main className="from-sky-0 via-sky-1 to-sky-2 font-body relative min-h-screen overflow-hidden bg-gradient-to-br">
      <span aria-hidden className="grain-layer" />
      <span
        aria-hidden
        className="bg-miku/10 motion-safe:animate-floaty pointer-events-none absolute top-[18%] right-[12%] size-64 rounded-full blur-3xl"
      />
      <span
        aria-hidden
        className="bg-miku-2/10 motion-safe:animate-floaty pointer-events-none absolute bottom-[15%] left-[10%] size-72 rounded-full blur-3xl"
        style={{ animationDelay: '-3s' }}
      />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div
          role="dialog"
          aria-labelledby="not-found-title"
          aria-describedby="not-found-desc"
          className="border-rule-2 bg-surf-solid shadow-elev-3 motion-safe:animate-win-open w-full max-w-lg overflow-hidden rounded-2xl border"
        >
          <div className="border-rule bg-surf-soft flex items-center border-b">
            <div className="flex flex-1 items-center gap-2 px-3 py-2">
              <AlertTriangle
                aria-hidden
                className="text-peach size-3.5"
                strokeWidth={2}
              />
              <span className="text-ink font-mono text-xs font-bold">
                error.sys — 404
              </span>
            </div>
            <Link
              href="/"
              aria-label="Close and return to desktop"
              className="focus-ring text-ink-2 hover:bg-danger hover:text-cloud flex h-8 w-10 items-center justify-center text-xs transition-colors pointer-coarse:h-11 pointer-coarse:w-12"
            >
              <span aria-hidden>✕</span>
            </Link>
          </div>

          <div className="px-6 py-6">
            <h1
              id="not-found-title"
              className="font-display text-ink mb-1 text-5xl font-bold tracking-tight"
            >
              404
            </h1>
            <p id="not-found-desc" className="font-body text-ink-2 mb-6">
              No such path in this filesystem.
            </p>

            <div className="border-rule bg-surf-0 text-ink-2 mb-6 rounded-lg border px-3 py-3 font-mono text-xs">
              <div className="break-all">
                <span className="text-miku-2 font-bold">~/kacper</span>
                <span className="text-miku mx-1.5 font-bold">❯</span>
                <span className="text-ink">cd .{pathname || '/unknown'}</span>
              </div>
              <div className="text-peach mt-1">
                cd: no such file or directory: .{pathname || '/unknown'}
              </div>
              <div className="mt-2">
                <span className="text-miku-2 font-bold">~/kacper</span>
                <span className="text-miku mx-1.5 font-bold">❯</span>
                <span
                  aria-hidden
                  className="text-miku motion-safe:animate-blink ml-0.5"
                >
                  ▌
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/"
                className="focus-ring bg-miku text-cloud hover:bg-miku-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
              >
                <Home aria-hidden className="size-4" />
                Back to desktop
              </Link>
              <button
                type="button"
                onClick={() => router.back()}
                className="focus-ring border-rule-2 bg-surf-0 text-ink hover:bg-surf-1 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors"
              >
                <ArrowLeft aria-hidden className="size-4" />
                Go back
              </button>
              <span className="text-ink-4 ml-auto flex items-center gap-1.5 font-mono text-[11px]">
                <kbd className="border-rule bg-surf-solid/60 rounded border px-1.5 py-0.5 font-mono text-[11px]">
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
