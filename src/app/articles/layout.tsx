import { Metadata } from 'next'
import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

import { generateMetadata } from '@/lib/metadata-config'
import { sectionMetadata } from '@/lib/metadata-config'

interface ArticlesLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = generateMetadata(sectionMetadata.articles)

const ArticlesLayout = ({ children }: ArticlesLayoutProps) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed articles page" />
      {children}
    </>
  )
}

export default ArticlesLayout
