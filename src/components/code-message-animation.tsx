'use client'

import { useEffect, useState } from 'react'

import { AnimatePresence, motion } from 'motion/react'

interface CodeMessageAnimationProps {
  className?: string
}

export function CodeMessageAnimation({
  className = '',
}: CodeMessageAnimationProps) {
  const [currentMessage, setCurrentMessage] = useState<number>(0)

  // Array of programming humor messages with their types
  const codeMessages = [
    { text: '404: Social life not found', type: 'error' },
    { text: 'It works on my machine ¯\\_(ツ)_/¯', type: 'info' },
    { text: "!false // it's funny because it's true", type: 'comment' },
    { text: 'while(coding) { coffee++ }', type: 'code' },
    { text: "git commit -m 'Fix bugs'", type: 'command' },
    { text: 'Uncaught TypeError: undefined is not a function', type: 'error' },
    { text: '0 errors, 147 warnings', type: 'warning' },
    { text: '// TODO: Write better comments', type: 'comment' },
    { text: 'sudo make me a sandwich', type: 'command' },
    { text: '{ } // This is fine', type: 'code' },
  ]

  // Cycle through messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % codeMessages.length)
    }, 5000) // Change message every 5 seconds

    return () => clearInterval(interval)
  }, [codeMessages.length])

  // Get type-specific styling
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-500'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-500'
      case 'comment':
        return 'bg-green-500/10 border-green-500/30 text-green-500'
      case 'command':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-500'
      case 'code':
      default:
        return 'bg-primary/10 border-primary/30 text-primary'
    }
  }

  return (
    <div className={`relative h-10 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMessage}
          className={`absolute inset-0 flex items-center rounded-md border px-3 py-1.5 font-mono text-xs shadow-xs backdrop-blur-xs ${getTypeStyles(codeMessages[currentMessage].type)}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {codeMessages[currentMessage].text}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
