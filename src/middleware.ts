import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Generate a nonce (16 bytes → base64 string)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

  // Construct CSP with dynamic nonce
  const csp = [
    `base-uri 'none'`,
    `child-src 'none'`,
    `connect-src 'self'`,
    `default-src 'self'`,
    `font-src 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `frame-src https://challenges.cloudflare.com`,
    `img-src 'self' blob: data:`,
    `manifest-src 'self'`,
    `media-src 'self'`,
    `object-src 'none'`,
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://logging.shirone.xyz https://challenges.cloudflare.com`,
    `style-src 'self' 'unsafe-inline'`,
    `worker-src 'self'`,
  ].join('; ')

  // Inject security headers
  res.headers.set('Content-Security-Policy', csp)
  res.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  res.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')
  res.headers.set('Origin-Agent-Cluster', '?1')
  res.headers.set('Referrer-Policy', 'no-referrer')
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-DNS-Prefetch-Control', 'off')
  res.headers.set('X-Download-Options', 'noopen')
  res.headers.set('X-Frame-Options', 'SAMEORIGIN')
  res.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  res.headers.set('X-XSS-Protection', '0')
  res.headers.set('Cache-Control', 'no-store, must-revalidate')

  // Optional: expose your nonce to Server Components
  res.headers.set('x-custom-nonce', nonce)

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
