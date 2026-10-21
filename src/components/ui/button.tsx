import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * The pixel buttons (SPEC 2.4): the chrome's button 9-slices, night in both
 * Lamp modes (`os-night`), so their text keeps the night pairs it was
 * checked with. Pressing moves the content down 1 art px (the pressed
 * slice's border widths); disabled is the flat slice with meta text
 * (4.78:1). On a paper body they gain a 1 art px navy outline
 * (`px-button-*` in globals.css). Glyphs inside are 8x8 `PixelIcon`s.
 */
const buttonVariants = cva(
  'focus-ring inline-flex items-center justify-center gap-3 whitespace-nowrap select-none disabled:cursor-not-allowed disabled:text-(--meta) aria-disabled:cursor-not-allowed aria-disabled:text-(--meta) [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'os-night px-button-primary text-(--fill-primary-ink)',
        secondary: 'os-night px-button-secondary text-(--ink)',
        warm: 'os-night px-button-warm text-(--fill-warm-ink)',
        // Text only: a row action that sits inside its own panel.
        ghost: 'text-(--ink) hover:bg-(--select)',
        link: 'text-(--link) underline decoration-(length:--px) underline-offset-[calc(2*var(--px))] hover:text-(--heading)',
      },
      size: {
        default: 'text-title h-18 px-5 pointer-coarse:h-(--target)',
        sm: 'text-label h-14 px-3 pointer-coarse:h-(--target)',
        icon: 'size-14 pointer-coarse:size-(--target)',
        inline: 'text-body',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
