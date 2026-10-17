import type { ComponentProps } from 'react'

import { PixelIcon } from '@/components/pixel/pixel-icon.generated'

import { cn } from '@/lib/utils'

import { INLINE_LINK_CLASS } from './constants'

const NEW_TAB_SUFFIX = ' (opens in new tab)'

type ExternalLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'> & {
  /**
   * A link inside running copy: the inline link style (1 art px underline)
   * and the 8x8 `external` arrow after the text. Off for links that are a
   * button, a card or an icon.
   */
  inline?: boolean
}

/**
 * Link that leaves the site in a new tab. Owns `target` and `rel`, and tells
 * screen readers about the new tab: as hidden text after the children, or
 * appended to `aria-label` when the link is named that way.
 */
export function ExternalLink({
  children,
  inline,
  className,
  'aria-label': ariaLabel,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      className={cn(inline && INLINE_LINK_CLASS, className)}
      aria-label={ariaLabel ? `${ariaLabel}${NEW_TAB_SUFFIX}` : undefined}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {inline && (
        <PixelIcon
          name="external"
          className="ml-1 inline-block align-[-0.1em]"
        />
      )}
      {!ariaLabel && <span className="sr-only">{NEW_TAB_SUFFIX}</span>}
    </a>
  )
}
