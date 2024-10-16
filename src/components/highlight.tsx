import React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  className?: string
  children: React.ReactNode
}

const Highlight = ({ className, children }: Props) => {
  return (
    <span className={cn('mx-1 bg-secondary px-1 py-0.5', className)}>
      {children}
    </span>
  )
}

export default Highlight
