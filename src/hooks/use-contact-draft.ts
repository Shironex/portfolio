'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { SESSION_WRITE_DEBOUNCE_MS } from '@/lib/os/session'
import { isRecord } from '@/lib/utils'

export const CONTACT_DRAFT_STORAGE_KEY = 'shiroos:contact-draft'

/** The typed fields of the contact form. The captcha token is never kept. */
export interface ContactDraft {
  name: string
  email: string
  message: string
}

export const EMPTY_DRAFT: ContactDraft = { name: '', email: '', message: '' }

/**
 * The draft for this document, `null` until first read. Once read it is the
 * source of truth and storage only trails it: the draft survives closing and
 * reopening the window even where sessionStorage is blocked, and a pending
 * write can never be read back over newer text.
 */
let memoryDraft: ContactDraft | null = null

function isBlank(draft: ContactDraft): boolean {
  return draft.name === '' && draft.email === '' && draft.message === ''
}

function pick(value: unknown): ContactDraft {
  const record = isRecord(value) ? value : {}
  const text = (key: keyof ContactDraft) => {
    const field = record[key]
    return typeof field === 'string' ? field : ''
  }
  return { name: text('name'), email: text('email'), message: text('message') }
}

/**
 * What an earlier load of this tab left behind. sessionStorage is untyped
 * input and can throw outright (blocked site data, sandboxed iframe), so
 * anything unreadable is an empty draft.
 */
function readStoredDraft(): ContactDraft {
  try {
    const raw = window.sessionStorage.getItem(CONTACT_DRAFT_STORAGE_KEY)
    return raw ? pick(JSON.parse(raw)) : EMPTY_DRAFT
  } catch {
    return EMPTY_DRAFT
  }
}

/** The draft as it stands. */
function readContactDraft(): ContactDraft {
  if (typeof window === 'undefined') return EMPTY_DRAFT
  memoryDraft ??= readStoredDraft()
  return memoryDraft
}

/** Put the draft into storage; a blank one removes the entry. */
function storeContactDraft(draft: ContactDraft): void {
  try {
    if (isBlank(draft)) {
      window.sessionStorage.removeItem(CONTACT_DRAFT_STORAGE_KEY)
    } else {
      window.sessionStorage.setItem(
        CONTACT_DRAFT_STORAGE_KEY,
        JSON.stringify(draft)
      )
    }
  } catch {
    /* Blocked storage or an exhausted quota. The in-memory copy still holds. */
  }
}

/**
 * Keeps what was typed into the contact form outside the window's lifecycle,
 * so closing `contact.app` (or "Close all windows") and opening it again
 * brings the text back. Lives for the tab session, like the window stack.
 *
 * - `initial`: the draft, read once on mount; use it as the form's default
 *   values.
 * - `save(values)`: keep the current field values; extra keys (the captcha
 *   token) are dropped. The in-memory copy is updated at once and the storage
 *   write is debounced, so typing costs one write when it settles. A pending
 *   write is flushed on unmount and on `pagehide`.
 * - `clear()`: forget the draft; call it after a successful send.
 */
export function useContactDraft() {
  const [initial] = useState(readContactDraft)
  const timer = useRef<number | null>(null)

  /** Drop the pending write, if any; says whether there was one. */
  const cancel = useCallback(() => {
    if (timer.current === null) return false
    window.clearTimeout(timer.current)
    timer.current = null
    return true
  }, [])

  const flush = useCallback(() => {
    if (cancel()) storeContactDraft(memoryDraft ?? EMPTY_DRAFT)
  }, [cancel])

  const save = useCallback(
    (values: Partial<ContactDraft>) => {
      memoryDraft = pick(values)
      cancel()
      timer.current = window.setTimeout(flush, SESSION_WRITE_DEBOUNCE_MS)
    },
    [cancel, flush]
  )

  const clear = useCallback(() => {
    cancel()
    memoryDraft = EMPTY_DRAFT
    storeContactDraft(EMPTY_DRAFT)
  }, [cancel])

  useEffect(() => {
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [flush])

  return { initial, save, clear }
}
