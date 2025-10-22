import { Metadata } from 'next'
import React from 'react'

import { sectionMetadata } from '@/lib/metadata-config'
import { generateMetadata } from '@/lib/metadata-config'

interface AboutLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = generateMetadata(sectionMetadata.about)

const AboutLayout = ({ children }: AboutLayoutProps) => {
  return <>{children}</>
}

export default AboutLayout
