'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'

const AnnounceContext = createContext<(message: string) => void>(() => {})

/**
 * The shell's one polite live region. Anything under it can say a short
 * message to assistive tech through {@link useAnnounce}; changes with no
 * visible text of their own (a keyboard snap, for one) go through here.
 */
export function Announcer({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  return (
    <AnnounceContext value={setMessage}>
      {children}
      <div role="status" aria-live="polite" className="sr-only">
        {message}
      </div>
    </AnnounceContext>
  )
}

export function useAnnounce() {
  return useContext(AnnounceContext)
}
