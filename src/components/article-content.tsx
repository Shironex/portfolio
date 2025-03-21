'use client'

import { useEffect, useRef, useState } from 'react'

interface ArticleContentProps {
  htmlContent: string
}

export function ArticleContent({ htmlContent }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)

  // This ensures we only run this code on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // This effect will only run after the component has mounted on the client
  useEffect(() => {
    if (!isClient || !contentRef.current) return

    // Function to apply syntax highlighting
    const applyHighlighting = async () => {
      try {
        // Dynamically import CSS for the theme
        // await import('highlight.js/styles/atom-one-dark.css')

        // Dynamically import highlight.js
        const hljs = (await import('highlight.js')).default

        // Find all code blocks and apply highlighting
        const codeBlocks = contentRef.current?.querySelectorAll('pre code')
        if (codeBlocks) {
          codeBlocks.forEach((block) => {
            hljs.highlightElement(block as HTMLElement)

            // Add language label if available
            const language = Array.from(block.classList)
              .find((className) => className.startsWith('language-'))
              ?.replace('language-', '')

            if (language && language !== 'plaintext') {
              const pre = block.parentElement
              if (pre) {
                pre.setAttribute('data-language', language)
              }
            }
          })
        }
      } catch (error) {
        console.error('Error applying syntax highlighting:', error)
      }
    }

    applyHighlighting()
  }, [isClient, htmlContent])

  return (
    <div
      ref={contentRef}
      className="mdx-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
