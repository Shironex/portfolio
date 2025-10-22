import { Metadata } from 'next'
import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

import { sectionMetadata } from '@/lib/metadata-config'
import { generateMetadata } from '@/lib/metadata-config'

interface AboutLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = generateMetadata(sectionMetadata.about)

const AboutLayout = ({ children }: AboutLayoutProps) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed about page" />
      {children}
    </>
  )
}

export default AboutLayout
