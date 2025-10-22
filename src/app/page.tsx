'use cache'

import { Metadata } from 'next'
import { cacheLife } from 'next/cache'

import { generateMetadata } from '@/lib/metadata-config'
import { sectionMetadata } from '@/lib/metadata-config'

import HomeClientPage from './client-page'

export const metadata: Metadata = generateMetadata(sectionMetadata.home)

const HomePage = async () => {
  cacheLife('days')
  return <HomeClientPage />
}

export default HomePage
