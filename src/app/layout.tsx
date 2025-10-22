import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import { Suspense } from 'react'

import { Toaster } from '@/components/ui/sonner'

import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { RouteLoading } from '@/components/layout/route-loading'
import { ScrollRestoration } from '@/components/scroll-restoration'

import { defaultMetadata } from '@/lib/metadata-config'

import Providers from '@/context/providers'
import { env } from '@/env/server'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
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
                <script
                  defer
                  src={env.ANALYTIC_URL + '/script.js'}
                  data-website-id={env.ANALYTIC_ID}
                />
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
