import Link from 'next/link'

import { MoveLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 animate-bounce text-6xl font-bold text-sky-500">
        404
      </h1>
      <h2 className="mb-4 text-2xl font-semibold">Oops! Page Not Found</h2>
      <p className="mb-8 text-center text-xl">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="flex items-center space-x-2 rounded-md bg-sky-500 px-4 py-2 text-white transition duration-300 hover:bg-sky-600"
      >
        <MoveLeft size={20} />
        <span>Return to Home</span>
      </Link>
    </div>
  )
}

export default NotFound
