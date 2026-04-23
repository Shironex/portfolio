'use client'

import { useEffect } from 'react'

type Handler = (event: KeyboardEvent) => void

export function useHotkeys(handlers: { 'mod+k'?: Handler; escape?: Handler }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === 'k' &&
        handlers['mod+k']
      ) {
        e.preventDefault()
        handlers['mod+k'](e)
        return
      }
      if (e.key === 'Escape' && handlers.escape) {
        handlers.escape(e)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlers])
}
