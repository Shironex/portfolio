import Link from 'next/link'
import React from 'react'

import { Github } from 'lucide-react'
import { Variants, motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'

import { GITHUB_URL } from '@/lib/constants'

import { NavItem } from '@/types'

import { Button } from '../ui/button'

interface MobileNavBarProps {
  isOpen: boolean
  pathname: string
  itemVariants: Variants
  closeMenu: () => void
  navItems: NavItem[]
}

const MobileNavBar = ({
  isOpen,
  pathname,
  itemVariants,
  closeMenu,
  navItems,
}: MobileNavBarProps) => {
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        when: 'beforeChildren',
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={mobileMenuVariants}
          className="absolute left-0 top-16 z-50 w-full overflow-hidden bg-background/95 backdrop-blur-md md:hidden"
        >
          <nav className="container mx-auto px-4 py-6">
            <ul className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.name}
                  variants={itemVariants}
                  custom={index}
                >
                  <Link
                    href={item.path}
                    className={`block py-2 text-lg font-medium transition-colors hover:text-primary ${
                      pathname === item.path
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-4">
              <motion.div variants={itemVariants} className="w-full">
                <Link
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants} className="w-full">
                <Link
                  href="https://discord.com/users/shirone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <circle cx="9" cy="12" r="1" />
                        <circle cx="15" cy="12" r="1" />
                        <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                        <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                        <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
                        <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.48-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
                      </svg>
                      Discord
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileNavBar
