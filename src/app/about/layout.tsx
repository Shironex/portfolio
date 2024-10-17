import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type Props = {
  children: React.ReactNode
}

const AboutLayout = ({ children }: Props) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed about page" />
      {children}
    </>
  )
}

export default AboutLayout
