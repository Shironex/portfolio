import { Metadata } from 'next'

import { generateMetadata } from '@/lib/metadata-config'
import { sectionMetadata } from '@/lib/metadata-config'

import HomeClientPage from './client-page'

export const metadata: Metadata = generateMetadata(sectionMetadata.home)

const HomePage = () => {
  return <HomeClientPage />
}

export default HomePage
