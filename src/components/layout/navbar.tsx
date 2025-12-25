'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Github, Mail } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { SentryLink } from '@/components/sentry-link'
import { ThemeToggle } from '@/components/theme-toggle'

import { GITHUB_URL, NAV_ITEMS } from '@/lib/constants'
import { throttle } from '@/lib/utils'
import { navbarItem, navbarSlideIn } from '@/lib/utils/animations'

import MobileNavBar from './mobile-navbar'
import MobileNavbarToggle from './mobile-navbar-toggle'

/**
 * Renders the top navigation bar with responsive desktop and mobile layouts, logo, navigation items, GitHub link, and theme toggle.
 *
 * The component manages internal state for the mobile menu (open/closed) and tracks page scroll position to adjust header styling.
 *
 * @returns The Navbar React element.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrolled(window.scrollY > 10)
    }, 100)

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarSlideIn}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 shadow-xs backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <motion.div variants={navbarItem}>
          <SentryLink
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
            onClick={closeMenu}
            eventName="Navigate to Home (Logo)"
          >
            <motion.span
              className="from-primary bg-linear-to-r to-purple-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              Shirone
            </motion.span>
          </SentryLink>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <ul className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <motion.li key={item.name} variants={navbarItem}>
                <SentryLink
                  href={item.path}
                  className={`hover:text-primary relative px-1 py-2 text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  data-umami-event={`Click Button Navigate to ${item.name}`}
                  eventName={`Navigate to ${item.name}`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="bg-primary absolute -bottom-1 left-0 h-0.5 w-full"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </SentryLink>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <motion.div variants={navbarItem}>
              <Link
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="Click Button View GitHub Profile"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="GitHub"
                    className="hover:text-primary"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            <motion.div
              variants={navbarItem}
              data-umami-event="Click Button Toggle Theme"
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <MobileNavbarToggle
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          itemVariants={navbarItem}
        />
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavBar
        isOpen={isOpen}
        pathname={pathname}
        itemVariants={navbarItem}
        closeMenu={closeMenu}
        navItems={NAV_ITEMS}
      />
    </motion.header>
  )
}
