import { headers } from 'next/headers'

import NextTopLoader from 'nextjs-toploader'

import { ThemeProvider } from './theme-provider'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = async ({ children }: ProvidersProps) => {
  const nonce = (await headers()).get('x-custom-nonce') || ''

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
      nonce={nonce}
    >
      <NextTopLoader color="#9B85F6" />
      {children}
    </ThemeProvider>
  )
}

export default Providers
