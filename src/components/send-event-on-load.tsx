'use client'

import { useEffect, useRef } from 'react'

import trackEvent from '@/lib/events'

type Props = {
  eventKey: string
  afterEventSent?: () => void
}

const SendEventOnLoad = ({ eventKey, afterEventSent }: Props) => {
  const isSent = useRef(false)

  useEffect(() => {
    if (isSent.current) return
    isSent.current = true
    trackEvent(eventKey)
      .then(() => {
        afterEventSent?.()
      })
      .catch((err) => {
        console.error('Error sending event:', err)
      })
  }, [eventKey, afterEventSent])

  return null
}

export default SendEventOnLoad
