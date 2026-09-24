import { defineConfig } from '@noctcore/showcase-kit'

// Path navs resolve against the origin, not the docs base path, so every
// path below carries the /eslint-plugins/ prefix.
const BASE = '/eslint-plugins'

export default defineConfig({
  name: 'noctcore ESLint plugins',
  slug: 'eslint-plugins',
  root: '..',
  target: { mode: 'url', url: `https://noctcore.github.io${BASE}/` },
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
      caption: 'Docs home: what the plugins catch and who they are for.',
      nav: `${BASE}/`,
    },
    {
      id: 'plugin',
      title: 'async-safety plugin',
      caption:
        'A plugin overview: what async-safety solves, what it reports and how to install it.',
      nav: `${BASE}/packages/async-safety/`,
    },
    {
      id: 'rule',
      title: 'require-fetch-timeout rule',
      caption:
        'A rule page: why the rule exists, with incorrect and correct examples.',
      nav: `${BASE}/rules/async-safety/require-fetch-timeout/#why`,
      delayMs: 300,
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
