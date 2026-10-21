'use client'

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

type Show = (message: string) => void

interface AnnounceApi {
  say: Show
  /**
   * Route what is said to a region inside a modal layer while it is open;
   * returns the release. The last claim wins, so stacked layers each get
   * what is said while they are on top.
   */
  claim: (show: Show) => () => void
}

const AnnounceContext = createContext<AnnounceApi>({
  say: () => {},
  claim: () => () => {},
})

/** A polite live region, visually hidden. */
function LiveRegion({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  )
}

/**
 * The shell's polite live region. Anything under it can say a short message
 * to assistive tech through {@link useAnnounce}; changes with no visible text
 * of their own (a keyboard snap, a launcher switch) go through here.
 *
 * While a modal layer that holds a {@link ModalLiveRegion} is open (a phone
 * sheet, the launcher), the message goes into that layer instead: a screen
 * reader confined to an `aria-modal` dialog may not read a region outside
 * it.
 */
export function Announcer({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const layers = useRef<Show[]>([])
  const api = useMemo<AnnounceApi>(
    () => ({
      say: (text) => (layers.current.at(-1) ?? setMessage)(text),
      claim: (show) => {
        layers.current = [...layers.current, show]
        return () => {
          layers.current = layers.current.filter((s) => s !== show)
        }
      },
    }),
    []
  )
  return (
    <AnnounceContext value={api}>
      {children}
      <LiveRegion message={message} />
    </AnnounceContext>
  )
}

/** Say a short message through the topmost live region. */
export function useAnnounce() {
  return useContext(AnnounceContext).say
}

/**
 * The live region of a modal layer: put it inside the dialog, and what is
 * said while the layer is open is read from there.
 */
export function ModalLiveRegion() {
  const { claim } = useContext(AnnounceContext)
  const [message, setMessage] = useState('')
  useEffect(() => claim(setMessage), [claim])
  return <LiveRegion message={message} />
}
