'use client'

import { useMemo } from 'react'

import type { WindowId, WindowState } from '@/components/os/types'

export interface StackIds {
  /** Every open window, minimized or not, in stack order. */
  openIds: WindowId[]
  minimizedIds: WindowId[]
}

/**
 * Ids of the open and of the minimized windows, as lists that keep their
 * identity until a window opens, closes, minimizes or is restored. A move, a
 * resize or a restack hands in a new `windows` array with the same stack in
 * it; anything keyed on these lists (a memoized taskbar, the focus effect)
 * sits those out.
 */
export function useStackIds(windows: WindowState[]): StackIds {
  const key = windows.map((w) => `${w.minimized ? '-' : '+'}${w.id}`).join(' ')
  return useMemo(() => {
    const entries = key === '' ? [] : key.split(' ')
    const idOf = (entry: string) => entry.slice(1) as WindowId
    return {
      openIds: entries.map(idOf),
      minimizedIds: entries.filter((entry) => entry.startsWith('-')).map(idOf),
    }
  }, [key])
}
