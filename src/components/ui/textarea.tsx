import * as React from 'react'

import { cn } from '@/lib/utils'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[60px] w-full rounded-md border border-rule-2 bg-surf-0 px-3 py-2 text-base text-ink shadow-xs transition-colors placeholder:text-ink-4 focus-visible:border-miku focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-miku/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
