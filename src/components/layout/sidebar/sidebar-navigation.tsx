'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import Heading from '@/components/heading'

import { navlinks, socials } from '@/lib/constants'
import { Navlink } from '@/lib/type'
import { cn } from '@/lib/utils'

import { useMediaQuery } from '@/hooks/use-media-query'

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SidebarNavigation = ({ setOpen }: Props) => {
  const isMobile = useMediaQuery('(max-width: 1024px)')
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <div className="relative z-[100] my-10 flex flex-col space-y-1">
      {navlinks.map((link: Navlink) => (
        <Link
          key={link.href}
          href={{
            pathname: link.href,
          }}
          aria-label={link.ariaLabel}
          onClick={() => isMobile && setOpen(false)}
          className={cn(
            'flex items-center space-x-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition duration-200 hover:text-primary',
            isActive(link.href) && 'bg-white text-primary shadow-lg'
          )}
        >
          <link.icon
            className={cn(
              'h-4 w-4 flex-shrink-0',
              isActive(link.href) && 'text-sky-500'
            )}
          />
          <span>{link.label}</span>
        </Link>
      ))}

      <Heading as="p" className="px-2 pt-10 text-sm md:text-sm lg:text-sm">
        Socials
      </Heading>
      {socials.map((link: Navlink) => (
        <Link
          key={link.href}
          href={{
            pathname: link.href,
          }}
          target="_blank"
          aria-label={link.ariaLabel}
          className={cn(
            'flex items-center space-x-2 rounded-md px-2 py-2 text-sm text-muted-foreground transition duration-200 hover:text-primary'
          )}
        >
          <link.icon
            className={cn(
              'h-4 w-4 flex-shrink-0',
              isActive(link.href) && 'text-sky-500'
            )}
          />
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  )
}

export default SidebarNavigation
