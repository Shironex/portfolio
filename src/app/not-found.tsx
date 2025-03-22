import { LoadingState } from '@/components/loading-state'

const NotFound = () => {
  return (
    <div className="container mx-auto">
      <LoadingState
        title="Page Not Found"
        message="We couldn't find the page you're looking for."
        additionalInfo="Please check the URL or return to the home page."
        buttonText="Back to Home"
        buttonHref="/"
      />
    </div>
  )
}

export default NotFound
