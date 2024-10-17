import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

type ContactLayoutProps = {
  children: React.ReactNode
}

const ContactLayout = ({ children }: ContactLayoutProps) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed contact page" />
      {children}
    </>
  )
}

export default ContactLayout
