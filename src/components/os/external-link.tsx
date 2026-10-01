import type { ComponentProps } from 'react'

const NEW_TAB_SUFFIX = ' (opens in new tab)'

type ExternalLinkProps = Omit<ComponentProps<'a'>, 'target' | 'rel'>

/**
 * Link that leaves the site in a new tab. Owns `target` and `rel`, and tells
 * screen readers about the new tab: as hidden text after the children, or
 * appended to `aria-label` when the link is named that way.
 */
export function ExternalLink({
  children,
  'aria-label': ariaLabel,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      aria-label={ariaLabel ? `${ariaLabel}${NEW_TAB_SUFFIX}` : undefined}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {!ariaLabel && <span className="sr-only">{NEW_TAB_SUFFIX}</span>}
    </a>
  )
}
