import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * The field well (SPEC 2.4, Inputs): the `px-well` 9-slice, ground navy at
 * night and cream on paper, its rim in `--error` while `aria-invalid`.
 * Pixeloid at body size, meta placeholder, a caret in the heading colour
 * (the lamp at night).
 */
export const FIELD_CLASS =
  'focus-ring px-well text-body w-full min-w-0 px-3 text-(--ink) caret-(--heading) placeholder:text-(--meta) disabled:cursor-not-allowed disabled:text-(--meta)'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          FIELD_CLASS,
          'h-18 pointer-coarse:h-(--target)',
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
