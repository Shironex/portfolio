'use client'

import { useEffect, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
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
  theme?: 'light' | 'dark'
  surface?: 'card' | 'plain'
}

export function ContactForm({
  theme = 'light',
  surface = 'plain',
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

  const formInner = sent ? (
    <div
      ref={sentPanel}
      role="status"
      tabIndex={-1}
      className="flex flex-col items-start gap-3 outline-none"
    >
      <CheckCircle2 aria-hidden className="text-miku-icon size-8" />
      <p className="font-display text-ink text-lg font-bold">Message sent</p>
      <p className="text-ink-2 text-sm">
        Thanks for reaching out. I will reply within 24 hours.
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={() => setSent(false)}
        className="border-rule-2 bg-surf-0 text-ink hover:bg-surf-1 hover:text-ink"
      >
        Send another message
      </Button>
    </div>
  ) : (
    <Form {...form}>
      {/* noValidate: the fields are marked required, and the inline messages
          below report it instead of the browser's own bubbles. */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your Name"
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
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Your email address"
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
                  placeholder="Your Message"
                  rows={6}
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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

        <input type="hidden" name="verify" />

        {alert && (
          <p role="alert" className="text-danger-ink text-sm font-medium">
            {alert}
          </p>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-miku text-cloud hover:bg-miku-2 w-full gap-2 font-semibold disabled:opacity-70"
        >
          {isPending ? 'Sending…' : 'Send message'}
          {isPending ? (
            <Loader2 aria-hidden className="size-4 motion-safe:animate-spin" />
          ) : (
            <Send aria-hidden className="size-4" />
          )}
        </Button>
      </form>
    </Form>
  )

  if (surface === 'card') {
    return (
      <div className="border-rule-2 bg-surf-2 rounded-2xl border p-6 backdrop-blur-xl md:p-8">
        {formInner}
      </div>
    )
  }

  return formInner
}

export default ContactForm
