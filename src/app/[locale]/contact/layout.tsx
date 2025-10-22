import { Metadata } from 'next'
import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

import { generateMetadata } from '@/lib/metadata-config'
import { sectionMetadata } from '@/lib/metadata-config'

interface ContactLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = generateMetadata(sectionMetadata.contact)

const ContactLayout = ({ children }: ContactLayoutProps) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed contact page" />
      {children}
    </>
  )
}

export default ContactLayout
