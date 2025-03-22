'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Github, Mail } from 'lucide-react'
import { Variants, motion } from 'motion/react'

import { Button } from '@/components/ui/button'

import { ThemeToggle } from '@/components/theme-toggle'

import { GITHUB_URL } from '@/lib/constants'

import { NavItem } from '@/types'

import MobileNavBar from './mobile-navbar'
import MobileNavbarToggle from './mobile-navbar-toggle'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const navItems: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Articles', path: '/articles' },
    { name: 'Contact', path: '/contact' },
  ]

  // Animation variants
  const navbarVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
      },
    },
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
            onClick={closeMenu}
          >
            <motion.span
              className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              Shirone
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-6">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <motion.li key={item.name} variants={itemVariants}>
                <Link
                  href={item.path}
                  className={`relative px-1 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.path
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                  {pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <motion.div variants={itemVariants}>
              <Link href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
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
            <motion.div variants={itemVariants}>
              <Link href="/contact">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Contact"
                    className="hover:text-primary"
                  >
                    <Mail className="h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <ThemeToggle />
            </motion.div>
          </div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <MobileNavbarToggle
          isOpen={isOpen}
          toggleMenu={toggleMenu}
          itemVariants={itemVariants}
        />
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavBar
        isOpen={isOpen}
        pathname={pathname}
        itemVariants={itemVariants}
        closeMenu={closeMenu}
        navItems={navItems}
      />
    </motion.header>
  )
}
