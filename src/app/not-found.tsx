import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground">
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        We couldn&apos;t find the page you&apos;re looking for. Please check the
        URL or return to the home page.
      </p>
      <Link
        href="/"
        className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        Back to Home
      </Link>
    </div>
  )
}

export default NotFound
