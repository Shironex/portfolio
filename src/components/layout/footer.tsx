import Link from 'next/link'

import { Github } from 'lucide-react'

import { GITHUB_URL } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="text-xl font-bold">
              <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Shirone
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Full-stack developer building impactful web applications
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row">
            <nav className="flex flex-wrap gap-6 sm:flex-nowrap">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Projects
              </Link>
              <Link
                href="/articles"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Articles
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Shirone. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
