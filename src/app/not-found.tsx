import { Suspense } from 'react'

import { RouteLoading } from '@/components/layout/route-loading'
import { LoadingState } from '@/components/loading-state'

const NotFound = () => {
  return (
    <Suspense fallback={<RouteLoading message="Loading not-found..." />}>
      <div className="container mx-auto">
        <LoadingState
          title="Page Not Found"
          message="We couldn't find the page you're looking for."
          additionalInfo="Please check the URL or return to the home page."
          buttonText="Back to Home"
          buttonHref="/"
        />
      </div>
    </Suspense>
  )
}

export default NotFound
