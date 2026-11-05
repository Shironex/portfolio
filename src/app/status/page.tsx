import type { Metadata } from 'next'

import { StatusScreen } from '@/components/status/status-screen'

import { defaultMetadata } from '@/lib/metadata-config'
import { getStatusReport } from '@/lib/status/fetch-status'

const TITLE = 'Status'
const DESCRIPTION =
  'Live uptime of my sites, APIs and servers, checked every minute.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/status' },
  openGraph: {
    ...defaultMetadata.openGraph,
    url: '/status',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    ...defaultMetadata.twitter,
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default async function StatusPage() {
  const report = await getStatusReport()
  return <StatusScreen report={report} />
}
