import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { connection } from 'next/server'
import type React from 'react'

import { Toaster } from '@/components/ui/sonner'

import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'
import { ScrollRestoration } from '@/components/scroll-restoration'

import { defaultMetadata } from '@/lib/metadata-config'

import Providers from '@/context/providers'
import '@/styles/globals.css'
import { env } from '@/env/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  await connection()

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ScrollRestoration />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}
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
      </body>
    </html>
  )
}
