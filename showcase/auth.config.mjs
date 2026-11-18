import { defineConfig } from '@noctcore/showcase-kit'

// Path navs resolve under the target url's path (the docs base path), so the
// paths below leave out the /auth/ prefix.
export default defineConfig({
  name: 'noctcore auth',
  slug: 'auth',
  root: '..',
  target: { mode: 'url', url: 'https://noctcore.github.io/auth/' },
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
      caption: 'Docs home: what the library defends against, module by module.',
      nav: '/',
    },
    {
      id: 'learn',
      title: 'Revocation races',
      caption:
        'A Learn page: why a racing login cannot undo a revocation, in plain terms.',
      nav: '/learn/revocation-races/',
    },
    {
      id: 'build',
      title: 'NestJS guide',
      caption:
        'A Build guide: wiring the NestJS module, its session guard and CSRF middleware.',
      nav: '/build/nestjs/',
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
