import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type React from 'react'
import { Suspense } from 'react'

import { Toaster } from '@/components/ui/sonner'

import AnalyticsScript from '@/components/analytics-script'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { RouteLoading } from '@/components/layout/route-loading'
import { ScrollRestoration } from '@/components/scroll-restoration'

import { defaultMetadata, siteConfig } from '@/lib/metadata-config'

import Providers from '@/context/providers'
import '@/styles/globals.css'

/**
 * JetBrains Mono font configuration for the portfolio.
 *
 * This monospace font provides a professional, developer-focused aesthetic.
 * The font is self-hosted via Next.js font optimization (no runtime Google Fonts requests).
 *
 * @see https://www.jetbrains.com/lp/mono/
 *
 * Available weights:
 * - 100: Thin
 * - 200: Extra Light
 * - 300: Light
 * - 400: Regular (default body text)
 * - 500: Medium (subheadings)
 * - 600: Semi Bold
 * - 700: Bold (headings)
 * - 800: Extra Bold
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'] as const,
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  ...defaultMetadata,
  metadataBase: new URL(siteConfig.url),
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} font-mono`}
        suppressHydrationWarning
      >
        {/* Pass nonce to the document using a meta tag so client code can discover it if needed */}
        <meta
          name="csp-nonce"
          content={
            (await import('next/headers'))
              .headers()
              .then((h) => h.get('x-nonce') || '') as any
          }
        />
        <Suspense fallback={<RouteLoading message="Preparing app..." />}>
          <Providers>
            <Suspense fallback={<RouteLoading message="Restoring scroll..." />}>
              <ScrollRestoration />
            </Suspense>
            <div className="flex min-h-screen flex-col">
              <Suspense
                fallback={<RouteLoading message="Loading navigation..." />}
              >
                <Navbar />
              </Suspense>
              <main className="flex-1">
                {children}
                <AnalyticsScript />
              </main>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </Suspense>
      </body>
    </html>
  )
}
