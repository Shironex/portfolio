import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type ArticlesLayoutProps = {
  children: React.ReactNode
}

const ArticlesLayout = ({ children }: ArticlesLayoutProps) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed articles page" />
      {children}
    </>
  )
}

export default ArticlesLayout
