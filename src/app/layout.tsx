import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className} suppressHydrationWarning>
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
