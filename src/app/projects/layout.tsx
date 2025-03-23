import { Metadata } from 'next'
import React from 'react'

import SendEventOnLoad from '@/components/send-event-on-load'

import { generateMetadata } from '@/lib/metadata-config'
import { sectionMetadata } from '@/lib/metadata-config'

export const metadata: Metadata = generateMetadata(sectionMetadata.projects)

type Props = {
  children: React.ReactNode
}

const ProjectsLayout = ({ children }: Props) => {
  return (
    <>
      <SendEventOnLoad eventKey="user viewed projects" />
      {children}
    </>
  )
}

export default ProjectsLayout
