'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'

interface CodeExampleProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
  className?: string
}

export function CodeExample({
  code,
  language,
  title,
  showLineNumbers = false,
  className,
}: CodeExampleProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  return (
    <div className={cn('group relative my-6', className)}>
      {title && (
        <div className="absolute left-0 top-0 z-10 rounded-bl rounded-tr bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
          {title}
        </div>
      )}

      <div className="absolute right-0 top-0 z-10 rounded-bl rounded-tr bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
        {language.toUpperCase()}
      </div>

      <motion.button
        onClick={copyToClipboard}
        className="absolute right-3 top-10 z-20 flex h-8 w-8 items-center justify-center rounded-md bg-primary/20 text-primary opacity-0 transition-opacity hover:bg-primary/30 group-hover:opacity-100"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Copy code"
        title="Copy code to clipboard"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <Copy className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <pre
        className={cn(
          'overflow-x-auto rounded-lg border border-primary/20 bg-[#1e1e2f] p-4 pt-10',
          'shadow-lg transition-shadow duration-300 hover:shadow-xl',
          'transition-colors hover:border-primary/40',
          showLineNumbers && 'line-numbers'
        )}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>

      <AnimatePresence>
        {copied && (
          <motion.div
            className="absolute bottom-3 right-3 rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
