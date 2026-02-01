'use client'

import NextTopLoader from 'nextjs-toploader'

interface ProvidersProps {
  children: React.ReactNode
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <>
      <NextTopLoader color="#9B85F6" />
      {children}
    </>
  )
}

export default Providers
