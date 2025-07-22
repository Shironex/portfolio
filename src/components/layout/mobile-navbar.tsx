import Link from 'next/link'
import React from 'react'

import { Github } from 'lucide-react'
import { type Variants, motion } from 'motion/react'
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
  const mobileMenuVariants: Variants = {
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
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileNavBar
