import Link from 'next/link'

import { Github } from 'lucide-react'

import { GITHUB_URL, NAV_ITEMS } from '@/lib/constants'

async function getCurrentYear() {
  'use cache'
  return new Date().getFullYear()
}

export async function Footer() {
  return (
    <footer className="border-border bg-card border-t">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="text-xl font-bold">
              <span className="text-primary">Shirone</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Full-stack developer building impactful web applications
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            <nav className="flex flex-wrap gap-6 sm:flex-nowrap">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-muted-foreground hover:text-foreground text-sm"
                  data-umami-event={`Click Button Navigate to ${item.name}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="text-muted-foreground hover:text-foreground h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="text-muted-foreground mt-8 text-center text-xs">
          © {await getCurrentYear()} Shirone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
