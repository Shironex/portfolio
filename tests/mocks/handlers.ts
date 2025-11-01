import { HttpResponse, http } from 'msw'

/**
 * MSW handlers for mocking external API calls
 * These handlers intercept HTTP requests and return mock responses
 */
export const handlers = [
  // Cloudflare Turnstile verification
  http.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', () => {
    return HttpResponse.json({
      success: true,
      challenge_ts: new Date().toISOString(),
      hostname: 'localhost',
    })
  }),

  // Discord Webhook (example - can be customized per test)
  http.post('https://discord.com/api/webhooks/*', () => {
    return new HttpResponse(null, { status: 204 })
  }),

  // Resend API (example - can be customized per test)
  http.post('https://api.resend.com/emails', () => {
    return HttpResponse.json({
      id: 'test-email-id',
    })
  }),
]

/**
 * Error handlers for testing error scenarios
 */
export const errorHandlers = [
  http.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', () => {
    return HttpResponse.json(
      {
        success: false,
        'error-codes': ['invalid-input-response'],
      },
      { status: 400 }
    )
  }),

  http.post('https://discord.com/api/webhooks/*', () => {
    return HttpResponse.json(
      {
        message: 'Webhook error',
      },
      { status: 500 }
    )
  }),

  http.post('https://api.resend.com/emails', () => {
    return HttpResponse.json(
      {
        message: 'Failed to send email',
      },
      { status: 500 }
    )
  }),
]
