'use client'

import { useState } from 'react'

import { IconLayoutSidebarRightCollapse } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'

import Badge from '@/components/badge'

import { useMediaQuery } from '@/hooks/use-media-query'

import SidebarHeader from './sidebar-header'
import SidebarNavigation from './sidebar-navigation'

const Sidebar = () => {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const [open, setOpen] = useState(isMobile ? false : true)

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            exit={{ x: -200 }}
            className="fixed left-0 z-[100] flex h-screen max-w-[14rem] flex-col justify-between bg-neutral-100 px-6 py-10 lg:relative lg:w-fit"
          >
            <div className="flex-1 overflow-auto">
              <SidebarHeader />
              <SidebarNavigation setOpen={setOpen} />
            </div>
            <div onClick={() => isMobile && setOpen(false)}>
              <Badge href="/resume" text="Read Resume" />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <button
        className="fixed bottom-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 backdrop-blur-sm lg:hidden"
        onClick={() => setOpen(!open)}
      >
        <IconLayoutSidebarRightCollapse className="h-4 w-4 text-secondary" />
      </button>
    </>
  )
}

export default Sidebar
