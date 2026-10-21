import * as React from 'react'

import { cn } from '@/lib/utils'

import { FIELD_CLASS } from './input'

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<'textarea'>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(FIELD_CLASS, 'block min-h-60 resize-y py-2', className)}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = 'Textarea'

export { Textarea }
