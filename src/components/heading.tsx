import localFont from 'next/font/local'
import React from 'react'

import { cn } from '@/lib/utils'

// Font files can be colocated inside of `app`
const CalSans = localFont({
  src: [{ path: '../../public/fonts/CalSans-SemiBold.woff2' }],
  display: 'swap',
})

type HeadingProps = {
  className?: string
  children: React.ReactNode
  as?: keyof JSX.IntrinsicElements
}

const Heading = ({ className, children, as: Tag = 'h1' }: HeadingProps) => {
  return (
    <Tag
      className={cn(
        CalSans.className,
        'bg-gradient-to-r from-primary to-secondary bg-clip-text text-base font-semibold text-transparent md:text-xl lg:text-4xl',
        className
      )}
    >
      {children}
    </Tag>
  )
}

export default Heading
