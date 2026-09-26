// README images of this site, captured from a local production build that runs
// on mock environment values (the same ones CI builds with), so no real
// secrets are needed. Works the same on macOS and Windows.
//
//   pnpm showcase:portfolio    build, start on port 3210, capture every shot,
//                              frame them into assets/showcase/ and render
//                              assets/showcase/hero.webp
//   pnpm exec showcase readme -c showcase/portfolio.config.mjs --cols 2 --base .
//                              print the README table
//
// The run rebuilds .next, so stop `pnpm dev` first. If something already
// answers on port 3210 the kit reuses it instead of building.
//
// What would move between runs is pinned: the clock is fixed, the GitHub
// heatmap is served from showcase/fixtures/github-activity.json (refresh it
// with `curl -o showcase/fixtures/github-activity.json
// https://shirone.dev/api/github-activity`), PostHog is blocked, and the kit
// asks for reduced motion, which also skips the boot splash. The site keeps
// its theme in localStorage, not prefers-color-scheme, so setup seeds it:
// dark mode with the default teal palette.
import { defineConfig } from '@noctcore/showcase-kit'
import { readFile } from 'node:fs/promises'

const ORIGIN = 'http://localhost:3210'
// Local wall time, no zone: the menubar reads the same on any machine.
const NOW = new Date('2026-09-26T10:30:00')
const MODE = 'dark'
const PALETTE = 'teal'
const READY = '[aria-label="Taskbar"]'

const githubActivity = await readFile(
  new URL('./fixtures/github-activity.json', import.meta.url),
  'utf8'
)

/** Wait until the terminal panel has typed its last line (it uses timers). */
async function settleDesktop(page) {
  await page.locator(READY).waitFor({ state: 'attached' })
  await page.getByText('▌').waitFor()
  await page.evaluate(() =>
    Promise.all([...document.fonts].map((face) => face.load().catch(() => {})))
  )
}

/**
 * Start each shot from a fresh desktop, run its steps, then park the pointer
 * where it hovers nothing. The reload keeps shots independent of each other.
 */
function view(then) {
  return async (page) => {
    await page.reload()
    await settleDesktop(page)
    if (then) await then(page)
    await page.mouse.move(1439, 450)
  }
}

/** Click a desktop icon and wait for its window. */
function openApp(name, title) {
  return async (page) => {
    await page
      .getByRole('button', { name: `Open ${name}`, exact: true })
      .first()
      .click()
    await page.getByRole('dialog', { name: title }).waitFor()
  }
}

export default defineConfig({
  name: 'shirone.dev',
  slug: 'portfolio',
  root: '..',
  target: {
    mode: 'url',
    url: `${ORIGIN}/`,
    start: `pnpm build && pnpm start --port 3210`,
    env: {
      NODE_ENV: 'production',
      NEXT_PUBLIC_PUBLIC_URL: ORIGIN,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
      RESEND_API_KEY: 'mock-resend-api-key',
      RESEND_MAIL_TO: 'mock@example.com',
      TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
      REDIS_HOST: 'redis://localhost:6379',
      DISCORD_WEBHOOK_URL: 'https://discord.com/api/webhooks/mock',
      NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: 'phc_placeholder_for_ci',
      NEXT_PUBLIC_POSTHOG_HOST: 'https://us.i.posthog.com',
    },
    readyTimeoutMs: 300000,
  },
  ready: READY,
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: MODE,
  setup: async ({ page, context }) => {
    await page.clock.setFixedTime(NOW)
    await context.route('**/api/github-activity', (route) =>
      route.fulfill({ contentType: 'application/json', body: githubActivity })
    )
    await context.route(/posthog\.com/, (route) => route.abort())
    // The Turnstile widget loads from Cloudflare at its own pace; leaving it
    // out keeps the contact shot the same on every run.
    await context.route(/challenges\.cloudflare\.com/, (route) => route.abort())
    // Runs in the kit's own headless Chromium, where storage always works; a
    // failure here should stop the run, not be swallowed.
    /* eslint-disable noctcore-react/no-unguarded-web-storage */
    await page.evaluate(
      ([mode, palette]) => {
        localStorage.setItem('shiroos:theme', mode)
        localStorage.setItem('shiroos:palette', palette)
      },
      [MODE, PALETTE]
    )
    /* eslint-enable noctcore-react/no-unguarded-web-storage */
    await page.reload()
  },
  shots: [
    {
      id: 'desktop',
      title: 'Desktop',
      caption:
        'The desktop: who I am, a short shell transcript, featured projects and my GitHub activity.',
      nav: view(),
    },
    {
      id: 'projects',
      title: 'Projects',
      caption: 'Projects: everything I have built, filterable by status.',
      nav: view(openApp('Projects', 'projects.app')),
    },
    {
      id: 'project',
      title: 'Project detail',
      caption:
        'A project window, scrolled to its tech stack and screenshot gallery.',
      nav: view(async (page) => {
        await openApp('Projects', 'projects.app')(page)
        await page
          .getByRole('dialog', { name: 'projects.app' })
          .getByRole('button', { name: 'Open Shiranami', exact: true })
          .click()
        const win = page.getByRole('dialog', { name: 'shiranami.app' })
        await win.waitFor()
        // Scroll past the intro to the stack and the gallery below it.
        await win
          .getByRole('heading', { name: 'tech stack', exact: true })
          .evaluate((heading) => heading.scrollIntoView({ block: 'start' }))
        // Gallery thumbnails load lazily; wait until each one has decoded.
        await win
          .locator('img')
          .evaluateAll((images) =>
            Promise.all(images.map((img) => img.decode().catch(() => {})))
          )
      }),
      delayMs: 500,
    },
    {
      id: 'about',
      title: 'About',
      caption: 'About: who I am, what I work on and what I do away from code.',
      nav: view(openApp('About', 'about.me')),
    },
    {
      id: 'monitor',
      title: 'Monitor',
      caption: 'Monitor: the languages, frameworks and tools I use every day.',
      nav: view(openApp('Monitor', 'monitor.sys')),
    },
    {
      id: 'contact',
      title: 'Contact',
      caption: 'Contact: a form, plus my email and GitHub.',
      nav: view(async (page) => {
        await openApp('Contact', 'contact.app')(page)
        await page
          .getByRole('dialog', { name: 'contact.app' })
          .getByRole('button', { name: 'Toggle maximize window' })
          .click()
        await page.getByRole('button', { name: 'Send message' }).waitFor()
      }),
    },
    {
      id: 'palette',
      title: 'Command palette',
      caption:
        'The command palette: open any app or project, switch the theme or the palette.',
      nav: view(async (page) => {
        // The taskbar button sits below the palette, so the pointer does not
        // leave a row highlighted.
        await page
          .getByLabel('Taskbar')
          .getByRole('button', { name: /search apps/ })
          .click()
        await page.getByRole('dialog', { name: 'Command palette' }).waitFor()
      }),
    },
    {
      id: 'readme',
      title: 'Readme',
      caption: 'Readme: a short welcome note and the keyboard shortcuts.',
      nav: view(openApp('Readme', 'readme.md')),
    },
  ],
  frame: {
    style: 'window',
    theme: 'dark',
    title: '{name}',
    background: {
      type: 'gradient',
      from: '#0f7c74',
      to: '#0b1f1e',
      angle: 135,
    },
    padding: 72,
    radius: 14,
    shadow: true,
    maxWidth: 1800,
  },
  outputs: {
    raw: 'showcase-out/{slug}/raw/{id}.png',
    readme: 'assets/showcase/{id}.webp',
  },
  hero: {
    tagline: 'My portfolio, built as a small desktop OS.',
    logo: 'src/app/icon.png',
    shots: ['projects', 'project', 'desktop'],
    output: 'assets/showcase/hero.webp',
  },
})
