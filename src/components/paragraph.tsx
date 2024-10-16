import React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children: React.ReactNode
}

export const Paragraph = ({ className, children }: Props) => {
  return (
    <p
      className={cn(
        'text-sm font-normal text-muted-foreground lg:text-base',
        className
      )}
    >
      {children}
    </p>
  )
}
