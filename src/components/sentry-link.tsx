'use client'

import Link from 'next/link'
import { ComponentProps, forwardRef } from 'react'

import * as Sentry from '@sentry/nextjs'

interface SentryLinkProps extends ComponentProps<typeof Link> {
  eventName?: string
}

export const SentryLink = forwardRef<HTMLAnchorElement, SentryLinkProps>(
  ({ onClick, eventName, children, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      Sentry.startSpan(
        {
          op: 'navigation',
          name: eventName || `Navigate to ${props.href}`,
        },
        (span) => {
          span.setAttributes({
            'navigation.from': window.location.pathname,
            'navigation.to': props.href.toString(),
            'navigation.type': 'link_click',
          })
        }
      )

      if (onClick) {
        onClick(e)
      }
    }

    return (
      <Link ref={ref} onClick={handleClick} {...props}>
        {children}
      </Link>
    )
  }
)

SentryLink.displayName = 'SentryLink'
