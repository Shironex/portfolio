import type { Metadata, Viewport } from 'next'
import { Fraunces, Geist, JetBrains_Mono } from 'next/font/google'
import type React from 'react'

import { Toaster } from '@/components/ui/sonner'

import {
  defaultMetadata,
  personJsonLd,
  serializeJsonLd,
  siteConfig,
} from '@/lib/metadata-config'
import { APPEARANCE_BOOT_SCRIPT, DEFAULT_SKY } from '@/lib/os/appearance'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'

/*
 * Typography:
 *   - Display: Fraunces, a variable serif with optical sizing. Used for
 *     headlines and the brand mark. Carries more character than the
 *     previous rounded-friendly pairing.
 *   - Body: Geist, a distinctive neutral sans from Vercel. Replaces the
 *     generic Nunito for copy.
 *   - Mono: JetBrains Mono, unchanged, used in terminal and kbd.
 * Weights trimmed to what's actually rendered.
 */

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fraunces',
  display: 'swap',
})

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(siteConfig.url),
}

export const viewport: Viewport = {
  // The mobile shell pads with env(safe-area-inset-*), which needs `cover`.
  viewportFit: 'cover',
  // The ground navy, which stays night whether the Lamp is on or off, so
  // the tag never changes after the server sends it.
  themeColor: siteConfig.ground,
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-sky={DEFAULT_SKY}
      // The font variables sit on <html>, not <body>: the `--font-*` theme
      // tokens in globals.css are declared on `:root` and reference them with
      // `var()`, so they resolve there or not at all.
      // `dark` is night window bodies, the default and the page without
      // JavaScript; the boot script removes it when the Lamp is on.
      className={cn(
        'dark',
        fraunces.variable,
        geist.variable,
        jetbrainsMono.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          // Sets the art pixel and applies the stored Lamp, sky, text and
          // motion choices before first paint. Inline and blocking on
          // purpose; a deferred script paints the default first.
          dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(personJsonLd) }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
