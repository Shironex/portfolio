import { env } from '@/env/server'

export default async function AnalyticsScript() {
  return (
    <script
      defer
      src={env.ANALYTIC_URL + '/script.js'}
      data-website-id={env.ANALYTIC_ID}
    />
  )
}