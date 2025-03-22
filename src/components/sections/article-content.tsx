'use client'

import { useEffect, useRef } from 'react'

interface ArticleContentProps {
  htmlContent: string
}

export function ArticleContent({ htmlContent }: ArticleContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && contentRef.current) {
      const applyHighlighting = async () => {
        try {
          const hljs = (await import('highlight.js')).default

          const codeBlocks = contentRef.current?.querySelectorAll('pre code')

          if (codeBlocks) {
            codeBlocks.forEach((block) => {
              hljs.highlightElement(block as HTMLElement)

              const languageClass = Array.from(block.classList).find((cls) =>
                cls.startsWith('language-')
              )

              if (languageClass) {
                const language = languageClass.replace('language-', '')
                const pre = block.parentElement

                if (pre && language !== 'plaintext') {
                  pre.setAttribute('data-language', language)
                  pre.classList.add('code-block')

                  // Add copy button
                  const copyButton = document.createElement('button')
                  copyButton.className = 'copy-button'
                  copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
                  copyButton.title = 'Copy code to clipboard'

                  copyButton.addEventListener('click', async () => {
                    try {
                      await navigator.clipboard.writeText(
                        block.textContent || ''
                      )
                      copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
                      setTimeout(() => {
                        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`
                      }, 2000)
                    } catch (err) {
                      console.error('Failed to copy code:', err)
                    }
                  })

                  pre.appendChild(copyButton)
                }
              }
            })
          }
        } catch (error) {
          console.error('Failed to apply syntax highlighting:', error)

          // Fallback: Just add the language label without highlighting
          const codeBlocks = contentRef.current?.querySelectorAll('pre code')
          if (codeBlocks) {
            codeBlocks.forEach((block) => {
              const languageClass = Array.from(block.classList).find((cls) =>
                cls.startsWith('language-')
              )

              if (languageClass) {
                const language = languageClass.replace('language-', '')
                const pre = block.parentElement
                if (pre && language !== 'plaintext') {
                  pre.setAttribute('data-language', language)
                  pre.classList.add('code-block')
                }
              }
            })
          }
        }
      }

      applyHighlighting()
    }
  }, [htmlContent])

  return (
    <div
      ref={contentRef}
      className="mdx-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
