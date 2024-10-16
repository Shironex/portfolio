import React from 'react'

type Props = {
  children: React.ReactNode
}

const Container = ({ children }: Props) => {
  return (
    <main className={'mx-auto w-full max-w-4xl px-4 py-20 md:px-10'}>
      {children}
    </main>
  )
}

export default Container
