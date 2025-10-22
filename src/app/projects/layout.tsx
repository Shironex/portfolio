import { Metadata } from 'next'
import React from 'react'

import { generateMetadata } from '@/lib/metadata-config'
import { sectionMetadata } from '@/lib/metadata-config'

export const metadata: Metadata = generateMetadata(sectionMetadata.projects)

type Props = {
  children: React.ReactNode
}

const ProjectsLayout = ({ children }: Props) => {
  return <>{children}</>
}

export default ProjectsLayout
