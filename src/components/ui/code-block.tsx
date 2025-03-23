'use client'

import { useEffect, useRef } from 'react'

interface CodeBlockProps {
  language: string
  code: string
  className?: string
}

export function CodeBlock({ language, code, className }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    // Function to apply syntax highlighting
    const highlight = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Import CSS
          // await import('highlight.js/styles/atom-one-dark.css')

          // Import highlight.js
          const hljs = (await import('highlight.js')).default

          if (codeRef.current) {
            const codeElement = codeRef.current.querySelector('code')
            if (codeElement) {
              hljs.highlightElement(codeElement)
            }
          }
        } catch (error) {
          console.error('Error highlighting code:', error)
        }
      }
    }

    highlight()
  }, [code, language])

  return (
    <div className="relative">
      <div className="absolute right-0 top-0 z-10 rounded-bl rounded-tr bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
        {language}
      </div>
      <pre
        ref={codeRef}
        className={`overflow-x-auto rounded-lg border border-border p-4 ${className || ''}`}
      >
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}
