'use client'

import { useRef, useState } from 'react'

import * as Sentry from '@sentry/nextjs'
import { Check, Copy } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

interface CodeBlockWithCopyProps {
  language: string
  code: string
  className?: string
  showLineNumbers?: boolean
}

export function CodeBlockWithCopy({
  language,
  code,
  className,
  showLineNumbers = false,
}: CodeBlockWithCopyProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)

  const copyToClipboard = async () => {
    Sentry.startSpan(
      {
        op: 'ui.click',
        name: 'Copy Code Button',
      },
      async (span) => {
        span.setAttributes({
          'code.language': language,
          'code.length': code.length,
          'clipboard.api': !!navigator.clipboard,
        })

        if (!navigator.clipboard) {
          // Fallback for older browsers
          const textArea = document.createElement('textarea')
          textArea.value = code
          textArea.style.position = 'fixed'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()

          try {
            document.execCommand('copy')
            setCopied(true)
            span.setAttribute('copy.success', true)
            span.setAttribute('copy.method', 'legacy')
          } catch (err) {
            console.error('Failed to copy code:', err)
            span.setAttribute('copy.success', false)
            span.setAttribute(
              'copy.error',
              err instanceof Error ? err.message : 'Unknown error'
            )
          }

          document.body.removeChild(textArea)
        } else {
          // Modern browsers
          try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            span.setAttribute('copy.success', true)
            span.setAttribute('copy.method', 'modern')
          } catch (err) {
            console.error('Failed to copy code:', err)
            span.setAttribute('copy.success', false)
            span.setAttribute(
              'copy.error',
              err instanceof Error ? err.message : 'Unknown error'
            )
          }
        }

        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000)
      }
    )
  }

  return (
    <div className="group relative my-6">
      <motion.div
        className="absolute top-3 right-3 z-20 opacity-0 transition-opacity group-hover:opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={copyToClipboard}
          className="bg-primary/20 text-primary hover:bg-primary/30 flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          aria-label="Copy code"
          title="Copy code to clipboard"
        >
          {copied ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </motion.div>

      <div className="bg-primary text-primary-foreground absolute top-0 right-0 z-10 rounded-tr rounded-bl px-3 py-1.5 text-xs font-semibold">
        {language.toUpperCase()}
      </div>

      <pre
        ref={codeRef}
        className={cn(
          'border-border overflow-x-auto rounded-lg border bg-[#1e1e2f] p-4 pt-8',
          'shadow-lg transition-shadow duration-300 hover:shadow-xl',
          'border-primary/20 hover:border-primary/40 transition-colors',
          showLineNumbers && 'line-numbers',
          className
        )}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>

      {copied && (
        <motion.div
          className="bg-primary text-primary-foreground absolute right-3 bottom-3 rounded-md px-3 py-1 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          Copied!
        </motion.div>
      )}
    </div>
  )
}
