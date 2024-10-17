import { env } from '@/env/client'

const trackEvent = async (key: string) => {
  if (env.NEXT_PUBLIC_SKIP_EVENTS) {
    return
  }
  await fetch('https://writewiz.shirone.xyz/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      projectId: env.NEXT_PUBLIC_WRITEWIZ_PROJECT_ID,
    }),
  })
}

export default trackEvent
