import { defineConfig } from '@noctcore/showcase-kit'

const ORIGIN = 'https://shirone.blog'

export default defineConfig({
  name: 'shirone.blog',
  slug: 'shirone-blog',
  root: '..',
  target: { mode: 'url', url: `${ORIGIN}/` },
  ready: 'main',
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  // The blog ships a single dark theme and has no toggle.
  colorScheme: 'dark',
  // The glow follows the mouse, so it would land somewhere different each run.
  css: '#cursor-glow { display: none !important; }',
  shots: [
    {
      id: 'home',
      title: 'Home',
      caption: 'Home: a short intro and the latest post.',
      nav: '/',
    },
    {
      id: 'post',
      title: 'Shiranami 2 post',
      caption:
        'A post: how I rewrote Shiranami in Rust, with reading time, tags and a table of contents.',
      nav: '/blog/shiranami-v2-rust-rewrite/',
    },
    {
      id: 'archive',
      title: 'Archive',
      caption: 'The archive: every post with its date, reading time and tags.',
      nav: async (page) => {
        await page.goto(`${ORIGIN}/`, { waitUntil: 'load' })
        await page
          .getByRole('heading', { name: 'The archive' })
          .evaluate((heading) =>
            window.scrollTo(
              0,
              heading.getBoundingClientRect().top + window.scrollY - 140
            )
          )
      },
      delayMs: 500,
    },
  ],
  frame: {
    style: 'window',
    theme: 'dark',
    title: '{name}',
    background: {
      type: 'gradient',
      from: '#4a3413',
      to: '#0c0a08',
      angle: 135,
    },
    padding: 72,
    radius: 14,
    shadow: true,
    maxWidth: 1800,
  },
  outputs: {
    raw: 'showcase-out/{slug}/raw/{id}.png',
    readme: 'showcase-out/{slug}/framed/{id}.webp',
    portfolio: {
      dir: 'public/projects/{slug}',
      size: [1920, 1080],
      format: 'webp',
      thumbnail: 'home',
    },
  },
})
