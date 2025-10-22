'use client'

import NextTopLoader from 'nextjs-toploader'

import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <NextTopLoader color="#9B85F6" />
      {children}
    </ThemeProvider>
  )
}

export default Providers
