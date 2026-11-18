import { defineConfig } from '@noctcore/showcase-kit'

// Path navs resolve under the target url's path (the docs base path), so the
// paths below leave out the /showcase-kit/ prefix.
export default defineConfig({
  name: 'noctcore showcase-kit',
  slug: 'showcase-kit',
  root: '..',
  target: { mode: 'url', url: 'https://noctcore.github.io/showcase-kit/' },
  ready: 'main',
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  // Starlight follows the system scheme; dark matches the rest of the portfolio.
  colorScheme: 'dark',
  // The search shortcut reads Ctrl K or Cmd K depending on the OS running the
  // capture; hiding it keeps images identical on Windows and macOS.
  css: 'site-search kbd { display: none !important; }',
  shots: [
    {
      id: 'home',
      title: 'Docs home',
      caption: 'Docs home: one config file, the same pixels on every run.',
      nav: '/',
    },
    {
      id: 'gallery',
      title: 'Gallery',
      caption:
        'The gallery: the same hero banner in each layout, with the config that made it.',
      nav: '/gallery/#hero-layouts',
      // The gallery images load lazily; give them time to decode after the
      // jump to the anchor.
      delayMs: 1500,
    },
    {
      id: 'portfolio',
      title: 'Portfolio guide',
      caption:
        'The portfolio guide: exact-size images, a thumbnail and the gallery JSON.',
      nav: '/guides/portfolio/',
    },
  ],
  frame: {
    style: 'window',
    theme: 'dark',
    title: '{name}',
    background: {
      type: 'gradient',
      from: '#312e81',
      to: '#0b1020',
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
