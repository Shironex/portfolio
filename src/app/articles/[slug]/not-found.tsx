import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { APP_ROUTES } from '@/lib/constants'

export default function ArticleNotFound() {
  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center md:px-6">
      <h1 className="mb-4 text-4xl font-bold">Article Not Found</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        The article you're looking for doesn't exist or has been moved.
      </p>
      <Link href={APP_ROUTES.toArticles}>
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Button>
      </Link>
    </div>
  )
}
