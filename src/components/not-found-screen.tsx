'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { buttonVariants } from '@/components/ui/button'

import { Kbd } from '@/components/os/kbd'
import { WallpaperStatic } from '@/components/os/wallpaper/wallpaper-static'
import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import neon from '@/assets/pixel/neon/os-neon-404.png'
import { useHotkeys } from '@/hooks/use-hotkeys'
import '@/styles/sprites/os-neon-404.css'

/**
 * The 404 window (SPEC 1.5), over the wallpaper's static frame: a pixel
 * window whose heading is the neon "404" sign at 3x. The sign flickers on
 * its drawn timing (3200, 90 and 150 ms) and holds its first frame under
 * reduced motion and the Pause setting (`px-rest-paused`). Client-side: it
 * reads the path and binds Escape.
 */
export function NotFoundScreen() {
  const router = useRouter()
  const pathname = usePathname()
  const path = `.${pathname || '/unknown'}`

  useHotkeys(useMemo(() => ({ escape: () => router.push('/') }), [router]))

  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-(--ground)">
      <div aria-hidden className="absolute inset-0 -z-1 max-md:hidden">
        <WallpaperStatic />
      </div>
      <div className="flex min-h-dvh items-center justify-center px-4 py-12">
        <div
          role="dialog"
          aria-labelledby="not-found-title"
          aria-describedby="not-found-desc"
          className="px-window-focused motion-safe:animate-win-open flex w-full max-w-[calc(280*var(--px))] flex-col"
        >
          <div className="os-night px-titlebar-focused flex h-16 items-center gap-3 pl-6 pointer-coarse:h-22">
            <PixelIcon name="alert" className="text-(--lamp)" />
            <span className="text-title flex-1 truncate text-(--ink-hi)">
              error.sys · 404
            </span>
            <Link
              href="/"
              aria-label="Close and return to desktop"
              className="focus-ring flex h-12 w-14 items-center justify-center text-(--ink) hover:bg-(--danger) pointer-coarse:size-(--target)"
            >
              <PixelIcon name="close" />
            </Link>
          </div>

          <div className="flex flex-col gap-6 p-8">
            <h1 id="not-found-title" className="flex">
              <span className="sr-only">404</span>
              <span aria-hidden className="px-scale-3 block">
                <span
                  className="os-night px-os-neon-404 px-os-neon-404-flicker ambient-loop px-rest-paused block animate-(--px-loop)"
                  style={{ backgroundImage: `url(${neon.src})` }}
                />
              </span>
            </h1>
            <p id="not-found-desc" className="text-body text-(--ink)">
              No such path in this filesystem.
            </p>

            <div className="os-night px-well text-label flex flex-col gap-1 px-4 pt-3 pb-4 text-(--ink)">
              <div className="break-all">
                <span className="text-(--link)">~/kacper</span>
                <span aria-hidden className="mx-2 text-(--lamp)">
                  ❯
                </span>
                <span>cd {path}</span>
              </div>
              <div className="break-all text-(--error)">
                cd: no such file or directory: {path}
              </div>
              <div>
                <span className="text-(--link)">~/kacper</span>
                <span aria-hidden className="mx-2 text-(--lamp)">
                  ❯
                </span>
                <span
                  aria-hidden
                  className="ambient-loop motion-safe:animate-blink text-(--lamp)"
                >
                  ▌
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className={buttonVariants({ variant: 'primary' })}>
                <PixelIcon name="home" />
                Back to desktop
              </Link>
              <button
                type="button"
                onClick={() => router.back()}
                className={buttonVariants({ variant: 'secondary' })}
              >
                <PixelIcon name="arrow-left" />
                Go back
              </button>
              <span className="text-label ml-auto flex items-center gap-2 text-(--meta) pointer-coarse:hidden">
                <Kbd>Esc</Kbd>
                <span>to return home</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
