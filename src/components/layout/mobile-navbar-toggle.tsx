'use client'

import React from 'react'

import { MenuIcon, XIcon } from 'lucide-react'
import { AnimatePresence, Variants, motion } from 'motion/react'

import { Button } from '../ui/button'

interface MobileNavbarToggleProps {
  isOpen: boolean
  toggleMenu: () => void
  itemVariants: Variants
}

const MobileNavbarToggle = ({
  isOpen,
  toggleMenu,
  itemVariants,
}: MobileNavbarToggleProps) => {
  return (
    <div className="flex items-center gap-4 md:hidden">
      <motion.div variants={itemVariants} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          data-umami-event="Click Mobile Button Toggle Menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ opacity: 0, rotate: isOpen ? -90 : 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: isOpen ? 90 : -90 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  )
}

export default MobileNavbarToggle
