import * as React from 'react'

import { cn } from '@/lib/utils'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-rule-2 bg-surf-0 px-3 py-1 text-base text-ink shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-ink-4 focus-visible:border-miku focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-miku/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
