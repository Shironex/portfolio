'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import Turnstile, { type BoundTurnstileObject } from 'react-turnstile'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { PixelIcon } from '@/components/pixel/pixel-icon.generated'
import { PixelSpinner } from '@/components/pixel/pixel-spinner'

import { env } from '@/env/client'
import { EMPTY_DRAFT, useContactDraft } from '@/hooks/use-contact-draft'

import { sendEmailAction } from './action'
import {
  ContactFormSchema,
  type ContactForm as ContactFormValues,
} from './validation'

const capturePosthogEvent = async (
  event: string,
  props?: Record<string, unknown>
) => {
  try {
    const { default: posthog } = await import('posthog-js')
    posthog.capture(event, props)
  } catch {
    // posthog capture is best-effort; never break the form flow
  }
}

const CAPTCHA_MISSING = 'Please complete the captcha above before sending.'
const SEND_FAILED = 'Something went wrong. Please try again.'

export interface ContactFormProps {
  /** The Turnstile widget's theme: `dark` at night, `light` on paper. */
  theme?: 'light' | 'dark'
  /** Called once the message has gone out (the app's mini-me waves). */
  onSent?: () => void
}

export function ContactForm({
  theme = 'light',
  onSent,
}: ContactFormProps = {}) {
  const draft = useContactDraft()
  const { save: saveDraft, clear: clearDraft } = draft
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: draft.initial,
  })
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const turnstile = useRef<BoundTurnstileObject | null>(null)
  const sentPanel = useRef<HTMLDivElement>(null)

  // Closing the window unmounts the form, so the draft is kept outside it.
  useEffect(() => {
    const subscription = form.watch((values) => saveDraft(values))
    return () => subscription.unsubscribe()
  }, [form, saveDraft])

  // The form is replaced by the confirmation, so focus has to follow it.
  useEffect(() => {
    if (sent) sentPanel.current?.focus()
  }, [sent])

  const { executeAsync, isPending } = useAction(sendEmailAction, {
    onSuccess: () => {
      clearDraft()
      form.reset(EMPTY_DRAFT)
      setSent(true)
      onSent?.()
      void capturePosthogEvent('contact_form_submitted')
    },
    onError: ({ error }) => {
      setServerError(error.serverError ?? SEND_FAILED)
      // A token is single-use, so a retry needs a fresh one.
      form.setValue('turnstileToken', '')
      turnstile.current?.reset()
      void capturePosthogEvent('contact_form_error', {
        error_message: error.serverError,
      })
    },
  })

  const handleSubmit = form.handleSubmit(
    async (data: ContactFormValues) => {
      setServerError(null)
      await executeAsync(data)
    },
    () => setServerError(null)
  )

  // Outcomes are reported inline only (this alert, the confirmation panel):
  // a toast on top would announce each of them a second time.
  const alert =
    serverError ??
    (form.formState.errors.turnstileToken ? CAPTCHA_MISSING : null)

  if (sent) {
    return (
      <div
        ref={sentPanel}
        role="status"
        tabIndex={-1}
        className="flex flex-col items-start gap-4 outline-none"
      >
        <p className="text-heading lamp-heading">Message sent</p>
        <p className="text-prose max-w-[66ch] text-(--ink)">
          Thanks for reaching out. I will reply within 24 hours.
        </p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSent(false)}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      {/* noValidate: the fields are marked required, and the inline messages
          below report it instead of the browser's own bubbles. */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email address"
                  autoComplete="email"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your message"
                  rows={6}
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* The widget sits in a bezel, a well one art px wider than it, that
            keeps its 300x65 place while the script loads. */}
        <div className="px-well w-fit p-1 [&>div]:min-h-[65px] [&>div]:min-w-[300px]">
          <Turnstile
            aria-label="Captcha"
            theme={theme}
            sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            onVerify={(token, bound) => {
              turnstile.current = bound
              form.setValue('turnstileToken', token)
              form.clearErrors('turnstileToken')
            }}
            onExpire={() => form.setValue('turnstileToken', '')}
          />
        </div>

        <input type="hidden" name="verify" />

        {alert && (
          <p
            role="alert"
            className="text-body flex items-start gap-2 text-(--error)"
          >
            <PixelIcon name="alert" className="mt-3" />
            <span>{alert}</span>
          </p>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Sending…' : 'Send message'}
          {isPending ? <PixelSpinner /> : <PixelIcon name="send" />}
        </Button>
      </form>
    </Form>
  )
}

export default ContactForm
